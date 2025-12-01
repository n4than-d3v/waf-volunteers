using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Notices;

public class CreateNotice : IRequest<IResult>
{
    public string Title { get; set; }
    public string Content { get; set; }
}

public class CreateNoticeHandler : IRequestHandler<CreateNotice, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public CreateNoticeHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(CreateNotice request, CancellationToken cancellationToken)
    {
        var notice = new Notice(request.Title, request.Content);
        _repository.Create(notice);
        await _repository.SaveChangesAsync();

        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);
        foreach (var account in accounts)
        {
            try
            {
                var json = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
                if (string.IsNullOrWhiteSpace(json)) continue;

                var subscription = JsonConvert.DeserializeObject<PushSubscription>(json);
                if (subscription == null) continue;

                await _pushService.Send(subscription!, new PushNotification
                {
                    Title = "Notice",
                    Body = request.Title
                });
            }
            catch
            {
            }
        }

        return Results.NoContent();
    }
}
