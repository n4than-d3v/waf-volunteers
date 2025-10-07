using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.Graph.Models;
using Newtonsoft.Json;
using System.Runtime;
using WebPush;

namespace Api.Handlers.Rota.Notify;

public class NotConfirmedNextShift : IRequest<IResult>
{
}

public class NotConfirmedNextShiftHandler : IRequestHandler<NotConfirmedNextShift, IResult>
{
    private const int CheckFutureRegularShiftDays = 7;

    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly PushSettings _settings;

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public NotConfirmedNextShiftHandler(IHttpContextAccessor httpContextAccessor, IOptions<PushSettings> settings, IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _httpContextAccessor = httpContextAccessor;
        _settings = settings.Value;

        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(NotConfirmedNextShift request, CancellationToken cancellationToken)
    {
        _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("NotificationAuthorizationCode", out StringValues value);
        if (value != _settings.NotificationAuthorizationCode) return Results.Forbid();

        var now = DateOnly.FromDateTime(DateTime.UtcNow);
        var end = now.AddDays(CheckFutureRegularShiftDays);

        var regularShifts = await _repository.GetAll<RegularShift>(
            x => true, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));

        var totalAttendance = await _repository.GetAll<Attendance>(
            x => now <= x.Date && x.Date <= end, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);

        foreach (var account in accounts)
        {
            var notify = new List<string>();

            var accountRegularShifts = regularShifts.Where(x => x.Account.Id == account.Id);

            var accountAttendance = await _repository.GetAll<Attendance>(
                x => now <= x.Date && x.Account.Id == account.Id, tracking: false,
                action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

            for (var date = now; date <= end; date = date.AddDays(1))
            {
                var regularShiftsOnThisDay = accountRegularShifts.Where(r => r.Day == date.DayOfWeek);
                if (!regularShiftsOnThisDay.Any()) continue;

                foreach (var regularShiftOnThisDay in regularShiftsOnThisDay.OrderBy(r => r.Time.Start))
                {
                    var regularShiftAttendance = accountAttendance.FirstOrDefault(p =>
                            p.Date == date &&
                            p.Time.Id == regularShiftOnThisDay.Time.Id &&
                            p.Job.Id == regularShiftOnThisDay.Job.Id);

                    if (regularShiftAttendance != null) continue;

                    notify.Add($"{regularShiftOnThisDay.Day} {regularShiftOnThisDay.Time.Name}");
                }
            }

            if (!notify.Any()) continue;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                await _pushService.Send(push, new PushNotification
                {
                    Title = "Upcoming shift not confirmed",
                    Body = $"We've noticed you've not yet confirmed whether you're coming in on {string.Join(" and ", notify)}. Please can you update your availability on the rota? Thank you!",
                    Image = "images/notifications/header.png"
                });
            }
        }

        return Results.NoContent();
    }
}
