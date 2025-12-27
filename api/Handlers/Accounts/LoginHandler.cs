using Api.Configuration;
using Api.Constants;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Handlers.Accounts;

public class Login : IRequest<IResult>
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class LoginHandler : IRequestHandler<Login, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IHashService _hashService;
    private readonly JwtSettings _settings;

    public LoginHandler(IOptions<JwtSettings> settings, IDatabaseRepository repository, IEncryptionService encryptionService, IHashService hashService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _hashService = hashService;
        _settings = settings.Value;
    }

    public async Task<IResult> Handle(Login request, CancellationToken cancellationToken)
    {
        var username = request.Username.ToLowerInvariant();
        var user = await _repository.Get<Account>(x => x.Username == username);
        if (user == null) return Results.BadRequest();

        var password = _hashService.Hash(request.Password);
        if (user.Password != password) return Results.BadRequest();
        if (user.Status != AccountStatus.Active) return Results.BadRequest();

        var firstName = _encryptionService.Decrypt(user.FirstName, user.Salt);
        var lastName = _encryptionService.Decrypt(user.LastName, user.Salt);
        var email = _encryptionService.Decrypt(user.Email, user.Salt);

        var token = GenerateToken(user.Id, firstName, lastName, email, (int)user.Roles);

        return Results.Ok(new { token });
    }

    private string GenerateToken(int userId, string firstName, string lastName, string email, int roles)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            new Claim(AccountConstants.Claims.Id, userId.ToString()),
            new Claim(AccountConstants.Claims.Email, email),
            new Claim(AccountConstants.Claims.Roles, roles.ToString()),
            new Claim(AccountConstants.Claims.FirstName, firstName),
            new Claim(AccountConstants.Claims.LastName, lastName)
        };

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_settings.ExpiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
