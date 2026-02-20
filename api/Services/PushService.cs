using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Concurrent;
using System.Net;
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
    Task<bool> Send(PushSubscription subscription, PushNotification message, int userId);
    Task RemoveInactiveSubscriptions();
}

public class PushService : IPushService
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly PushSettings _settings;

    private ConcurrentBag<int> _inactiveSubscriptions;

    public PushService(IDatabaseRepository repository, IEncryptionService encryptionService, IOptions<PushSettings> settings)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _settings = settings.Value;
        _inactiveSubscriptions = [];
    }

    public async Task<bool> Send(PushSubscription subscription, PushNotification message, int userId)
    {
        var vapidDetails = new VapidDetails($"mailto:{_settings.Email}", _settings.PublicKey, _settings.PrivateKey);

        var webPushClient = new WebPushClient();
        try
        {
            var resolver = new CamelCasePropertyNamesContractResolver();
            var payload = JsonConvert.SerializeObject(
                new { notification = message },
                new JsonSerializerSettings { ContractResolver = resolver });

            await webPushClient.SendNotificationAsync(subscription, payload, vapidDetails);

            return true;
        }
        catch
        {
            _inactiveSubscriptions.Add(userId);
            return false;
        }
    }

    public async Task RemoveInactiveSubscriptions()
    {
        if (_inactiveSubscriptions.IsEmpty) return;

        foreach (var inactiveSubscription in _inactiveSubscriptions)
        {
            var account = await _repository.Get<Account>(inactiveSubscription);
            if (account == null) continue;

            var blankSubscription = _encryptionService.Encrypt(string.Empty, account.Salt);
            account.Subscribe(blankSubscription);
        }

        _inactiveSubscriptions.Clear();
        await _repository.SaveChangesAsync();
    }
}
