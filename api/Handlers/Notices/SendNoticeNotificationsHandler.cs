using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Notices;

public class SendNoticeNotifications : IRequest<IResult>
{
}

public class SendNoticeNotificationsHandler : IRequestHandler<SendNoticeNotifications, IResult>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly PushSettings _pushSettings;

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public SendNoticeNotificationsHandler(IHttpContextAccessor httpContextAccessor, IOptions<PushSettings> pushSettings, IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _httpContextAccessor = httpContextAccessor;

        _pushSettings = pushSettings.Value;

        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(SendNoticeNotifications request, CancellationToken cancellationToken)
    {
        _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("NotificationAuthorizationCode", out StringValues value);
        if (value != _pushSettings.NotificationAuthorizationCode) return Results.Forbid();

        var notices = await _repository.GetAll<Notice>(x => (x.Sent == false) && x.SendAt <= DateTime.UtcNow);

        if (notices.Any())
        {
            var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

            foreach (var notice in notices)
            {
                foreach (var account in accounts)
                {
                    if (!notice.ShouldShow(account)) continue;

                    try
                    {
                        var json = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
                        if (string.IsNullOrWhiteSpace(json)) continue;

                        var subscription = JsonConvert.DeserializeObject<PushSubscription>(json);
                        if (subscription == null) continue;

                        await _pushService.Send(subscription!, new PushNotification
                        {
                            Title = "Notice",
                            Body = notice.Title,
                            Url = $"/volunteer/notices/{notice.Id}/view"
                        }, account.Id);
                    }
                    catch
                    {
                    }
                }

                notice.Sent = true;
            }

            await _repository.SaveChangesAsync();
            await _pushService.RemoveInactiveSubscriptions();
        }

        return Results.NoContent();
    }
}
