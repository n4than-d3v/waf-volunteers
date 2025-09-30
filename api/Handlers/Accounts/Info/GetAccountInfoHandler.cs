using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Microsoft.Graph.Models;

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
        var phone = _encryptionService.Decrypt(user.Phone, user.Salt);
        var lineOne = _encryptionService.Decrypt(user.AddressLineOne, user.Salt);
        var lineTwo = _encryptionService.Decrypt(user.AddressLineTwo, user.Salt);
        var city = _encryptionService.Decrypt(user.AddressCity, user.Salt);
        var county = _encryptionService.Decrypt(user.AddressCounty, user.Salt);
        var postcode = _encryptionService.Decrypt(user.AddressPostcode, user.Salt);
        var subscription = _encryptionService.Decrypt(user.PushSubscription, user.Salt);

        return Results.Ok(new
        {
            firstName,
            lastName,
            email,
            phone,
            address = new
            {
                lineOne,
                lineTwo,
                city,
                county,
                postcode
            },
            subscribed = !string.IsNullOrWhiteSpace(subscription)
        });
    }
}
