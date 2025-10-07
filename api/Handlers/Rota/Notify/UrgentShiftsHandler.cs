using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Notify;

public class UrgentShifts : IRequest<IResult>
{
}

public class UrgentShiftsHandler : IRequestHandler<UrgentShifts, IResult>
{
    private const int CheckFutureUrgentShiftDays = 7;

    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly PushSettings _settings;

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public UrgentShiftsHandler(IHttpContextAccessor httpContextAccessor, IOptions<PushSettings> settings, IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _httpContextAccessor = httpContextAccessor;
        _settings = settings.Value;

        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(UrgentShifts request, CancellationToken cancellationToken)
    {
        _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("NotificationAuthorizationCode", out StringValues value);
        if (value != _settings.NotificationAuthorizationCode) return Results.Forbid();

        var now = DateOnly.FromDateTime(DateTime.UtcNow);
        var end = now.AddDays(CheckFutureUrgentShiftDays);

        var regularShifts = await _repository.GetAll<RegularShift>(
            x => true, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));

        var totalAttendance = await _repository.GetAll<Attendance>(
            x => now <= x.Date && x.Date <= end, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);
        var times = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false,
            action: x => x.Include(y => y.Time).Include(y => y.Job));

        foreach (var account in accounts)
        {
            var notify = new List<string>();

            var accountRegularShifts = regularShifts.Where(x => x.Account.Id == account.Id);
            var allowedJobIds = regularShifts.Select(x => x.Job.Id).Distinct().ToList();

            var accountAttendance = await _repository.GetAll<Attendance>(
                x => now <= x.Date && x.Account.Id == account.Id, tracking: false,
                action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

            for (var date = now; date <= end; date = date.AddDays(1))
            {
                foreach (var time in times)
                {
                    var relevantRequirements = requirements.Where(x =>
                        x.Day == date.DayOfWeek &&
                        x.Time.Id == time.Id &&
                        allowedJobIds.Contains(x.Job.Id));
                    if (!relevantRequirements.Any()) continue;

                    foreach (var relevantRequirement in relevantRequirements)
                    {
                        bool Attending(Attendance x) =>
                            x.Date == date &&
                            x.Time.Id == time.Id &&
                            x.Job.Id == relevantRequirement.Job.Id &&
                            x.Confirmed;

                        var attendance = totalAttendance.Count(Attending);
                        var isUserAttending = accountAttendance.Any(Attending);

                        if (attendance < relevantRequirement.Minimum && !isUserAttending)
                        {
                            notify.Add($"{date.DayOfWeek} {time.Name}");
                        }
                    }
                }
            }

            if (!notify.Any()) continue;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                await _pushService.Send(push, new PushNotification
                {
                    Title = "Urgent shifts",
                    Body = $"We need your help on {string.Join(" and ", notify)}. Please can you spare a few hours to attend an urgent shift?",
                    Image = "images/notifications/header.png"
                });
            }
        }

        return Results.NoContent();
    }
}
