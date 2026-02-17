using Api.Database;
using Api.Services;
using MediatR;
using Api.Database.Entities.Account;
using static Api.Services.BeaconService.BeaconVolunteersFilterResults;
using Newtonsoft.Json;

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
                LastLoggedIn = user.LastLoggedIn,
                Subscribed = !string.IsNullOrWhiteSpace(_encryptionService.Decrypt(user.PushSubscription, user.Salt)),
                Roles = (int)user.Roles,
                Status = (int)user.Status,
                Cars = user.Cars.Select(car => _encryptionService.Decrypt(car, user.Salt)).ToArray()
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
        public DateTime? LastLoggedIn { get; set; }
        public bool Subscribed { get; set; }
        public int Roles { get; set; }
        public int Status { get; set; }
        public string[] Cars { get; set; }
    }
}
