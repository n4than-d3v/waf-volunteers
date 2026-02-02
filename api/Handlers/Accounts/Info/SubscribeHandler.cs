using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Accounts.Info;

public class Subscribe : IRequest<IResult>
{
    public string Subscription { get; set; }
}

public class SubscribeHandler : IRequestHandler<Subscribe, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;
    private readonly IPushService _pushService;

    public SubscribeHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext, IPushService pushService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(Subscribe request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(_userContext.Id);
        if (user == null) return Results.BadRequest();

        PushSubscription subscription;

        try
        {
           subscription = JsonConvert.DeserializeObject<PushSubscription>(request.Subscription);
        }
        catch
        {
            return Results.BadRequest();
        }

        var encrypted = _encryptionService.Encrypt(request.Subscription, user.Salt);

        user.Subscribe(encrypted);
        await _repository.SaveChangesAsync();

        await _pushService.Send(subscription!, new PushNotification
        {
            Title = "Notifications enabled",
            Body = "Thank you for enabling notifications"
        }, user.Id);

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
