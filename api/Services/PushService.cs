using Api.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using WebPush;

namespace Api.Services;

public class PushNotification
{
    public string Title { get; set; }
    public string Body { get; set; }
    public string Icon { get; set; } = "icons/icon-192x192.png";
    public string Badge { get; set; } = "icons/icon-192x192.png";
    public string Image { get; set; }
}

public interface IPushService
{
    Task<bool> Send(PushSubscription subscription, PushNotification message);
}

public class PushService : IPushService
{
    private readonly PushSettings _settings;

    public PushService(IOptions<PushSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task<bool> Send(PushSubscription subscription, PushNotification message)
    {
        var vapidDetails = new VapidDetails($"mailto:{_settings.Email}", _settings.PublicKey, _settings.PrivateKey);

        var webPushClient = new WebPushClient();
        try
        {
            await webPushClient.SendNotificationAsync(subscription, JsonConvert.SerializeObject(new { notification = message }, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }), vapidDetails);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
