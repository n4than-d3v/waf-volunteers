using Api.Database.Entities;
using Api.Database;
using Api.Handlers.Accounts.Info;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

public class GetAccounts : IRequest<IResult>
{
}

public class GetAccountsHandler : IRequestHandler<GetAccounts, IResult>
{

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;

    public GetAccountsHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
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
                }
            });
        }

        return Results.Ok(userDetails);
    }
}
