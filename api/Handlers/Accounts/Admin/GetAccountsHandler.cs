using Api.Database;
using Api.Services;
using MediatR;
using Api.Database.Entities.Account;

namespace Api.Handlers.Accounts.Admin;

public class GetAccounts : IRequest<IResult>
{
}

public class GetAccountsHandler : IRequestHandler<GetAccounts, IResult>
{

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public GetAccountsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(GetAccounts request, CancellationToken cancellationToken)
    {
        var users = await _repository.GetAll<Account>(x => true, tracking: false);

        var userDetails = new List<dynamic>();

        foreach (var user in users)
        {
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

            userDetails.Add(new
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
                subscribed = !string.IsNullOrWhiteSpace(subscription),
                roles = (int)user.Roles,
                status = (int)user.Status
            });
        }

        return Results.Ok(userDetails);
    }
}
