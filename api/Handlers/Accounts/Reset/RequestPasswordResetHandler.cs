using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts.Reset;

public class RequestPasswordReset : IRequest<IResult>
{
    public string Username { get; set; }
    internal bool IsAccountNewlyCreated { get; set; }
}

public class RequestPasswordResetHandler : IRequestHandler<RequestPasswordReset, IResult>
{
    private const int TokenLength = 256;
    private const int TokenLifetimeSeconds = 60 * 60 * 2; // 2 hours
    private const int TokenLifetimeSecondsWhenNewlyCreated = 60 * 60 * 24 * 7; // 7 days

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IStringGenerator _stringGenerator;
    private readonly IEmailService _emailService;

    public RequestPasswordResetHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IStringGenerator stringGenerator, IEmailService emailService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _stringGenerator = stringGenerator;
        _emailService = emailService;
    }

    public async Task<IResult> Handle(RequestPasswordReset request, CancellationToken cancellationToken)
    {
        var username = request.Username.ToLowerInvariant();
        var user = await _repository.Get<Account>(x => x.Username == username);
        if (user == null) return Results.BadRequest("Username does not exist");

        var firstName = _encryptionService.Decrypt(user.FirstName, user.Salt);
        var lastName = _encryptionService.Decrypt(user.LastName, user.Salt);
        var email = _encryptionService.Decrypt(user.Email, user.Salt);

        var token = _stringGenerator.Generate(TokenLength);

        var salt = _encryptionService.GenerateSalt();

        int lifetimeSeconds = request.IsAccountNewlyCreated ? TokenLifetimeSecondsWhenNewlyCreated : TokenLifetimeSeconds;

        _repository.Create(new ResetPasswordRequest
        {
            Account = user,
            Token = _encryptionService.Encrypt(token, salt),
            Salt = salt,
            Expires = DateTime.UtcNow.AddSeconds(lifetimeSeconds)
        });
        await _repository.SaveChangesAsync();

        await _emailService.SendEmailAsync(request.IsAccountNewlyCreated
            ? Email.AccountCreated(firstName, lastName, username, email, token)
            : Email.ResetPassword(firstName, lastName, username, email, token));

        return Results.NoContent();
    }
}
