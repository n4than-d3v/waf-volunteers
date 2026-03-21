using Api.Database;
using Api.Services;
using MediatR;
using Api.Database.Entities.Account;

namespace Api.Handlers.Hospital.HomeCare;

public class GetHomeCarers : IRequest<IResult>
{
}

public class GetHomeCarersHandler : IRequestHandler<GetHomeCarers, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public GetHomeCarersHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(GetHomeCarers request, CancellationToken cancellationToken)
    {
        var users = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        var accounts = new List<ResponseAccount>();

        foreach (var user in users)
        {
            if (!user.Roles.HasFlag(AccountRoles.BEACON_ORPHAN_FEEDER)) continue;

            var account = new ResponseAccount
            {
                Id = user.Id,
                FirstName = _encryptionService.Decrypt(user.FirstName, user.Salt),
                LastName = _encryptionService.Decrypt(user.LastName, user.Salt)
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
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
