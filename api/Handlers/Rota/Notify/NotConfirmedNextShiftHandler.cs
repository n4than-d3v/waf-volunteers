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

public class NotConfirmedNextShift : IRequest<IResult>
{
}

public class NotConfirmedNextShiftHandler : IRequestHandler<NotConfirmedNextShift, IResult>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly PushSettings _pushSettings;
    private readonly RotaSettings _rotaSettings;

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;
    private readonly IRotaService _rotaService;

    public NotConfirmedNextShiftHandler(IHttpContextAccessor httpContextAccessor, IOptions<PushSettings> pushSettings, IOptions<RotaSettings> rotaSettings, IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService, IRotaService rotaService)
    {
        _httpContextAccessor = httpContextAccessor;

        _pushSettings = pushSettings.Value;
        _rotaSettings = rotaSettings.Value;

        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _rotaService = rotaService;
    }

    public async Task<IResult> Handle(NotConfirmedNextShift request, CancellationToken cancellationToken)
    {
        _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("NotificationAuthorizationCode", out StringValues value);
        if (value != _pushSettings.NotificationAuthorizationCode) return Results.Forbid();

        var now = DateOnly.FromDateTime(DateTime.UtcNow);

        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        foreach (var account in accounts)
        {
            var rota = await _rotaService.GetVolunteerRotaAsync(now, account.Id);

            var maxDate = now.AddDays(_rotaSettings.NotifyUnconfirmedRegularShiftsDaysInAdvance);
            var notify = rota.Rota
                .Where(x => x.Date <= maxDate && x.Confirmed == null)
                .Select(x => $"{x.Date.DayOfWeek} {x.Time.Name.ToLower()}")
                .ToList();

            if (!notify.Any()) continue;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                await _pushService.Send(push, new PushNotification
                {
                    Title = "Upcoming shift not confirmed",
                    Body = $"We noticed you have not yet confirmed whether you are coming in on {string.Join(" and ", notify)}. Please can you update your availability on the rota? Thank you!"
                }, account.Id);
            }
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
