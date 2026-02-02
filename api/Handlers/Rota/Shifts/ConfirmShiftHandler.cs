using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Shifts;

public class ConfirmShift : IRequest<IResult>
{
    public int? UserId { get; private set; }

    public DateOnly Date { get; set; }
    public int TimeId { get; set; }
    public int JobId { get; set; }
    public AttendanceType ShiftType { get; set; }

    public ConfirmShift WithId(int id)
    {
        UserId = id;
        return this;
    }
}

public class ConfirmShiftHandler : IRequestHandler<ConfirmShift, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;
    private readonly IUserContext _context;

    public ConfirmShiftHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService, IUserContext context)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _context = context;
    }

    public async Task<IResult> Handle(ConfirmShift request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;

        var time = await _repository.Get<TimeRange>(request.TimeId);
        var job = await _repository.Get<Job>(request.JobId);
        var account = await _repository.Get<Account>(userId);

        var attendance = await _repository.Get<Attendance>(
            x => x.Date == request.Date && x.Time.Id == request.TimeId && x.Job.Id == request.JobId && x.Account.Id == userId,
            action: x => x.Include(y => y.Time).Include(y => y.Job).Include(y => y.Account).Include(y => y.MissingReason));
        if (attendance == null)
        {
            _repository.Create(new Attendance
            {
                Date = request.Date,
                Time = time,
                Job = job,
                Account = account,
                Confirmed = true,
                Type = request.ShiftType
            });
        }
        else
        {
            attendance.Confirmed = true;
            attendance.MissingReason = null;
            attendance.CustomMissingReason = null;
        }

        await _repository.SaveChangesAsync();

        var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
        if (!string.IsNullOrWhiteSpace(subscription))
        {
            var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
            await _pushService.Send(push, new PushNotification
            {
                Title = "Shift confirmation",
                Body = $"Thank you! You have signed up for {request.Date.DayOfWeek} {time.Name.ToLower()} on {request.Date:dd MMMM yyyy}"
            }, account.Id);
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
