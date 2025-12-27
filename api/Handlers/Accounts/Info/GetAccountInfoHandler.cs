using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Newtonsoft.Json;
using static Api.Services.BeaconService.BeaconVolunteersFilterResults;

namespace Api.Handlers.Accounts.Info;

public class GetAccountInfo : IRequest<IResult>
{
    public int? Id { get; set; }
}

public class GetAccountInfoHandler : IRequestHandler<GetAccountInfo, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;

    public GetAccountInfoHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(GetAccountInfo request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(request.Id ?? _userContext.Id, tracking: false);
        if (user == null) return Results.BadRequest();

        var firstName = _encryptionService.Decrypt(user.FirstName, user.Salt);
        var lastName = _encryptionService.Decrypt(user.LastName, user.Salt);
        var email = _encryptionService.Decrypt(user.Email, user.Salt);
        UpdateBeaconInfo? beaconInfo = null;
        if (!(user.BeaconId == null || string.IsNullOrWhiteSpace(user.BeaconInfo)))
        {
            string json = _encryptionService.Decrypt(user.BeaconInfo, user.Salt);
            beaconInfo = JsonConvert.DeserializeObject<UpdateBeaconInfo>(json);
        }
        var subscription = _encryptionService.Decrypt(user.PushSubscription, user.Salt);
        var cars = user.Cars.Select(car => _encryptionService.Decrypt(car, user.Salt)).ToArray();

        return Results.Ok(new
        {
            id = user.Id,
            username = user.Username,
            firstName,
            lastName,
            email,
            beaconInfo,
            cars,
            roles = user.Roles,
            status = user.Status,
            subscribed = !string.IsNullOrWhiteSpace(subscription)
        });
    }
}
