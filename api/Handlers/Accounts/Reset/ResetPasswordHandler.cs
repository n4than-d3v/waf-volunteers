using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Accounts.Reset;

public class ResetPassword : IRequest<IResult>
{
    public string Token { get; set; }
    public string Password { get; set; }
}

public class ResetPasswordHandler : IRequestHandler<ResetPassword, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IHashService _hashService;
    private readonly IEmailService _emailService;

    public ResetPasswordHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IHashService hashService, IEmailService emailService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _hashService = hashService;
        _emailService = emailService;
    }

    public async Task<IResult> Handle(ResetPassword request, CancellationToken cancellationToken)
    {
        var resetPasswordRequests = await _repository.GetAll<ResetPasswordRequest>(x => true, action: x => x.Include(y => y.Account));
        foreach (var resetPasswordRequest in resetPasswordRequests)
        {
            var token = _encryptionService.Decrypt(resetPasswordRequest.Token, resetPasswordRequest.Salt);
            if (request.Token == token)
            {
                // Ensure link is still active (not expired)
                if (DateTime.UtcNow > resetPasswordRequest.Expires) return Results.BadRequest();

                // Remove request
                _repository.Delete(resetPasswordRequest);

                // Save new password
                var password = _hashService.Hash(request.Password);
                var account = resetPasswordRequest.Account;
                account.ResetPassword(password);

                await _repository.SaveChangesAsync();

                var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
                var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
                var email = _encryptionService.Decrypt(account.Email, account.Salt);

                // Send email confirmation of change
                await _emailService.SendEmailAsync(Email.ResetPasswordSuccess(firstName, lastName, account.Username, email));

                return Results.NoContent();
            }
        }

        return Results.BadRequest();
    }
}
