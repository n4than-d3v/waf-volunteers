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

        var accounts = new List<ResponseAccount>();

        foreach (var user in users)
        {
            var account = new ResponseAccount
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = _encryptionService.Decrypt(user.FirstName, user.Salt),
                LastName = _encryptionService.Decrypt(user.LastName, user.Salt),
                Email = _encryptionService.Decrypt(user.Email, user.Salt),
                Phone = _encryptionService.Decrypt(user.Phone, user.Salt),
                Subscribed = !string.IsNullOrWhiteSpace(_encryptionService.Decrypt(user.PushSubscription, user.Salt)),
                Roles = (int)user.Roles,
                Status = (int)user.Status,
                Address = new()
                {
                    LineOne = _encryptionService.Decrypt(user.AddressLineOne, user.Salt),
                    LineTwo = _encryptionService.Decrypt(user.AddressLineTwo, user.Salt),
                    City = _encryptionService.Decrypt(user.AddressCity, user.Salt),
                    County = _encryptionService.Decrypt(user.AddressCounty, user.Salt),
                    Postcode = _encryptionService.Decrypt(user.AddressPostcode, user.Salt)
                }
            };
            accounts.Add(account);
        }

        return Results.Ok(accounts
            .OrderBy(x => x.FirstName)
            .ThenBy(x => x.LastName)
        );
    }

    public class ResponseAccount
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public ResponseAccountAddress Address { get; set; }
        public bool Subscribed { get; set; }
        public int Roles { get; set; }
        public int Status { get; set; }

        public class ResponseAccountAddress
        {
            public string LineOne { get; set; }
            public string LineTwo { get; set; }
            public string City { get; set; }
            public string County { get; set; }
            public string Postcode { get; set; }
        }
    }
}
