using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
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
    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly PushSettings _pushSettings;
    private readonly RotaSettings _rotaSettings;

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;
    private readonly IRotaService _rotaService;

    public UrgentShiftsHandler(IHttpContextAccessor httpContextAccessor, IOptions<PushSettings> pushSettings, IOptions<RotaSettings> rotaSettings, IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService, IRotaService rotaService)
    {
        _httpContextAccessor = httpContextAccessor;

        _pushSettings = pushSettings.Value;
        _rotaSettings = rotaSettings.Value;

        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _rotaService = rotaService;
    }

    public async Task<IResult> Handle(UrgentShifts request, CancellationToken cancellationToken)
    {
        _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("NotificationAuthorizationCode", out StringValues value);
        if (value != _pushSettings.NotificationAuthorizationCode) return Results.Forbid();

        var now = DateOnly.FromDateTime(DateTime.UtcNow);

        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        foreach (var account in accounts)
        {
            var rota = await _rotaService.GetVolunteerRotaAsync(now, account.Id);

            var maxDate = now.AddDays(_rotaSettings.NotifyUnconfirmedUrgentShiftsDaysInAdvance);
            var notify = rota.UrgentShifts.Where(x => x.Date <= maxDate && x.Confirmed != true);

            var critical = notify.Where(x => x.Critical)
                .Select(x => $"{x.Date.DayOfWeek} {x.Time.Name.ToLower()}")
                .ToList();

            var understaffed = notify.Where(x => x.Understaffed && !x.Critical)
                .Select(x => $"{x.Date.DayOfWeek} {x.Time.Name.ToLower()}")
                .ToList();

            if (!notify.Any()) continue;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);

                if (critical.Any())
                {
                    await _pushService.Send(push, new PushNotification
                    {
                        Title = "Critically understaffed shifts",
                        Body = $"{Format(critical)} urgently needs more volunteers. Please can you help?",
                        Url = "/volunteer/rota"
                    }, account.Id);
                }

                if (understaffed.Any())
                {
                    await _pushService.Send(push, new PushNotification
                    {
                        Title = "Understaffed shifts",
                        Body = $"{Format(understaffed)} needs more volunteers. Please can you help?",
                        Url = "/volunteer/rota"
                    }, account.Id);
                }
            }
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }

    private static string NaturalJoin(IList<string> items)
    {
        return items.Count switch
        {
            0 => "",
            1 => items[0],
            2 => $"{items[0]} and {items[1]}",
            _ => string.Join(", ", items.Take(items.Count - 1))
                 + $", and {items.Last()}"
        };
    }

    private static string Format(List<string> shifts)
    {
        var grouped = shifts
            .GroupBy(x => x.Split(' ')[0])
            .Select(g =>
            {
                var times = g.Select(x => x.Split(' ')[1]).ToList();

                return $"{g.Key} {NaturalJoin(times)}";
            })
            .ToList();

        return NaturalJoin(grouped);
    }
}
