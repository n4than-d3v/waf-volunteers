using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Migrations;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Pkcs;
using WebPush;

namespace Api.Handlers.Rota.Shifts;

public class DenyShift : IRequest<IResult>
{
    public int? UserId { get; private set; }

    public DateOnly Date { get; set; }
    public int TimeId { get; set; }
    public int JobId { get; set; }
    public int MissingReasonId { get; set; }
    public string? CustomMissingReason { get; set; }
    public AttendanceType ShiftType { get; set; }

    public DenyShift WithId(int id)
    {
        UserId = id;
        return this;
    }
}

public class DenyShiftHandler : IRequestHandler<DenyShift, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;
    private readonly IRotaService _rotaService;
    private readonly IUserContext _context;


    public DenyShiftHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService, IRotaService rotaService, IUserContext context)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _rotaService = rotaService;
        _context = context;
    }

    public async Task<IResult> Handle(DenyShift request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;

        var time = await _repository.Get<TimeRange>(request.TimeId);
        var job = await _repository.Get<Job>(request.JobId);
        var account = await _repository.Get<Account>(userId);
        var missingReason = await _repository.Get<MissingReason>(request.MissingReasonId);

        var attendance = await _repository.Get<Attendance>(
            x => x.Date == request.Date && x.Time.Id == request.TimeId && x.Job.Id == request.JobId && x.Account.Id == userId,
            action: x => x.Include(y => y.Time).Include(y => y.Job).Include(y => y.Account));
        if (attendance == null)
        {
            _repository.Create(new Attendance
            {
                Date = request.Date,
                Time = time,
                Job = job,
                Account = account,
                Confirmed = false,
                MissingReason = missingReason,
                CustomMissingReason = request.CustomMissingReason,
                Type = request.ShiftType
            });
        }
        else
        {
            attendance.Confirmed = false;
            attendance.MissingReason = missingReason;
            attendance.CustomMissingReason = request.CustomMissingReason;
        }

        await _repository.SaveChangesAsync();

        // If someone is opting out of a shift occurring on the same day, or for tomorrow and it's after 9 am
        // (meaning the "urgent shifts" notification would've already been sent)
        var isCancellingSameDay = request.Date == DateOnly.FromDateTime(DateTime.Now);
        var isCancellingTomorrow = request.Date == DateOnly.FromDateTime(DateTime.Now.AddDays(1));
        var isCurrentlyAfter9am = DateTime.Now.Hour >= 9;
        if (isCancellingSameDay || (isCancellingTomorrow && isCurrentlyAfter9am))
        {
            // Check to see if the shift has now been identified as "urgent"
            var volunteerRota = await _rotaService.GetVolunteerRotaAsync(request.Date, userId);
            var urgentShift = volunteerRota.UrgentShifts.FirstOrDefault(x => x.Date == request.Date && x.Time.Id == request.TimeId && x.Job.Id == request.JobId);
            if (urgentShift != null)
            {
                var recipients = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active && x.Id != userId, tracking: false);
                foreach (var recipient in recipients)
                {
                    var recipientSubscription = _encryptionService.Decrypt(recipient.PushSubscription, recipient.Salt);
                    if (!string.IsNullOrWhiteSpace(recipientSubscription))
                    {
                        var push = JsonConvert.DeserializeObject<PushSubscription>(recipientSubscription);
                        // Build the notification message to sound more urgent than the regular notification
                        string message = $"There has been a last-minute cancellation for {(isCancellingSameDay ? "today" : "tomorrow")}'s {urgentShift.Time.Name.ToLower()} shift! ";
                        if (urgentShift.Coming == 0) message += $"No-one is scheduled to come in! ";
                        else if (urgentShift.Coming == 1) message += "There is only 1 person coming in! ";
                        else message += $"There are only {urgentShift.Coming} people coming in! ";
                        int required = urgentShift.Required - urgentShift.Coming;
                        message += "Please help, ";
                        if (required == 1) message += "we just need one more person to come in!";
                        else message += $"we just need {required} more people to come in!";
                        await _pushService.Send(push, new PushNotification
                        {
                            Title = "Urgent! Last-minute cancellation",
                            Body = message
                        }, recipient.Id);
                    }
                }
            }
        }

        var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
        if (!string.IsNullOrWhiteSpace(subscription))
        {
            var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
            await _pushService.Send(push, new PushNotification
            {
                Title = "Shift cancellation",
                Body = $"You have cancelled your shift for {request.Date.DayOfWeek} {time.Name.ToLower()} on {request.Date:dd MMMM yyyy}"
            }, account.Id);
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
