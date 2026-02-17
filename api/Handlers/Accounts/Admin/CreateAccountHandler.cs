using Api.Database;
using Api.Database.Entities.Account;
using Api.Handlers.Accounts.Reset;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

/// <summary>
/// This is ONLY to be used to create non-beacon accounts (e.g. admin / clocking)
/// </summary>
public class CreateAccount : IRequest<IResult>
{
    public string Username { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public AccountRoles Roles { get; set; }
}

public class CreateAccountHandler : IRequestHandler<CreateAccount, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IMediator _mediator;

    public CreateAccountHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IMediator mediator)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(CreateAccount request, CancellationToken cancellationToken)
    {
        var username = request.Username.ToLowerInvariant();

        var existingUser = await _repository.Get<Account>(x => x.Username == username, tracking: false);
        if (existingUser != null) return Results.BadRequest("User already exists with that username");

        var salt = _encryptionService.GenerateSalt();

        var account = new Account(
            username,
            password: "-",
            AccountStatus.Active,
            request.Roles,
            lastLoggedIn: null,
            userAgent: null,
            _encryptionService.Encrypt(request.FirstName ?? string.Empty, salt),
            _encryptionService.Encrypt(request.LastName ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Email ?? string.Empty, salt),
            _encryptionService.Encrypt(string.Empty, salt),
            salt
        );

        _repository.Create(account);
        await _repository.SaveChangesAsync();

        await _mediator.Send(new RequestPasswordReset
        {
            Username = username,
            IsAccountNewlyCreated = true
        }, cancellationToken);

        return Results.Created(string.Empty, new { id = account.Id });
    }
}
