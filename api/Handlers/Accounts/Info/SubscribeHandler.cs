using Api.Database;
using Api.Database.Entities;
using Api.Services;
using MediatR;
using Newtonsoft.Json;

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

    public SubscribeHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(Subscribe request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(_userContext.Id);
        if (user == null) return Results.BadRequest();

        try
        {
            JsonConvert.DeserializeObject(request.Subscription);
        }
        catch
        {
            return Results.BadRequest();
        }

        var subscription = _encryptionService.Encrypt(request.Subscription, user.Salt);

        user.Subscribe(subscription);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
