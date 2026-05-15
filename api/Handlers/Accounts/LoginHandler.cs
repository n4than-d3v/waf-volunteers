using Api.Configuration;
using Api.Constants;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UAParser;

namespace Api.Handlers.Accounts;

public class Login : IRequest<IResult>
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class LoginHandler : IRequestHandler<Login, IResult>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IHashService _hashService;
    private readonly JwtSettings _settings;

    public LoginHandler(IOptions<JwtSettings> settings, IHttpContextAccessor httpContextAccessor, IDatabaseRepository repository, IEncryptionService encryptionService, IHashService hashService)
    {
        _httpContextAccessor = httpContextAccessor;
        _repository = repository;
        _encryptionService = encryptionService;
        _hashService = hashService;
        _settings = settings.Value;
    }

    public async Task<IResult> Handle(Login request, CancellationToken cancellationToken)
    {
        try
        {
            var username = request.Username.ToLowerInvariant().Trim();
            var user = await _repository.Get<Account>(x => x.Username == username);
            if (user == null)
            {
                return await Failure(request, LoginFailureBreakpoint.NoUserWithUsername, cancellationToken);
            }

            if (user.Status != AccountStatus.Active)
            {
                user.LoginFailed(false);
                return await Failure(request, LoginFailureBreakpoint.StatusIsNotActive, cancellationToken);
            }

            if (user.LockoutEnd.HasValue && DateTime.UtcNow <= user.LockoutEnd.Value)
            {
                user.LoginFailed(false);
                await Failure(request, LoginFailureBreakpoint.AccountLocked, cancellationToken);
                return Results.StatusCode(StatusCodes.Status429TooManyRequests);
            }

            var password = _hashService.Hash(request.Password);
            if (user.Password != password)
            {
                user.LoginFailed(recordAttempt: true);
                return await Failure(request, LoginFailureBreakpoint.PasswordDoesNotMatch, cancellationToken);
            }

            var userAgent = GetUserAgent();
            user.Login(_encryptionService.Encrypt(userAgent, user.Salt));
            await _repository.SaveChangesAsync();

            var firstName = _encryptionService.Decrypt(user.FirstName, user.Salt);
            var lastName = _encryptionService.Decrypt(user.LastName, user.Salt);
            var email = _encryptionService.Decrypt(user.Email, user.Salt);

            var token = GenerateToken(user.Id, firstName, lastName, email, user.Roles);

            return Results.Ok(new { token });
        }
        catch (Exception e)
        {
            var reference = await Failure(request, LoginFailureBreakpoint.UnhandledError, cancellationToken, e);
            return Results.BadRequest(new { reference });
        }
    }

    private string GetUserAgent()
    {
        try
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
                return string.Empty;

            if (!context.Request.Headers.TryGetValue("User-Agent", out var userAgent))
                return string.Empty;

            context.Request.Headers.TryGetValue("Sec-CH-UA-Model", out var deviceModel);

            var deviceModelWithoutQuotes = deviceModel.ToString().Replace("\"", "");

            var parser = Parser.GetDefault();
            var client = parser.Parse(userAgent.ToString());

            // ---- Device ----
            string device = client.Device.Family;

            if (string.IsNullOrWhiteSpace(device) || device == "Other")
            {
                var osFamily = client.OS.Family ?? string.Empty;

                if (osFamily.Contains("Windows", StringComparison.OrdinalIgnoreCase) ||
                    osFamily.Contains("Mac", StringComparison.OrdinalIgnoreCase) ||
                    osFamily.Contains("Linux", StringComparison.OrdinalIgnoreCase))
                {
                    device = "Desktop";
                }
                else
                {
                    device = "Unknown Device";
                }
            }

            if (!string.IsNullOrWhiteSpace(deviceModelWithoutQuotes))
                device = deviceModelWithoutQuotes;

            // ---- Browser ----
            string browser = client.UA.Family ?? "Unknown Browser";
            string browserVersion = client.UA.Major;

            string browserFormatted = string.IsNullOrWhiteSpace(browserVersion)
                ? browser
                : $"{browser} {browserVersion}";

            // ---- OS ----
            string os = client.OS.Family ?? "Unknown OS";
            string osVersion = client.OS.Major;

            string osFormatted = string.IsNullOrWhiteSpace(osVersion)
                ? os
                : $"{os} {osVersion}";

            return $"{device}, {browserFormatted}, {osFormatted}";
        }
        catch
        {
            return string.Empty;
        }
    }

    private async Task<IResult> Failure(Login request, LoginFailureBreakpoint breakpoint,
     CancellationToken cancellationToken, Exception? exception = null)
    {
        var reference = GenerateLoginFailureReference();
        var username = request.Username.ToLowerInvariant().Trim();

        _repository.Create(new LoginFailure
        {
            Reference = reference,
            Username = username,
            Breakpoint = breakpoint,
            Date = DateTime.UtcNow,
            IpAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Unknown",
            Exception = exception?.Message,
        });

        await _repository.SaveChangesAsync();

        await Task.Delay(Random.Shared.Next(1000, 3000), cancellationToken);
        return Results.BadRequest(new { reference });
    }

    private string GenerateLoginFailureReference()
    {
        const string chars = "BCDFGHJKLMNPQRSTVWXYZ";
        var random = new Random();

        return new string(Enumerable
            .Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)])
            .ToArray());
    }

    private string GenerateToken(int userId, string firstName, string lastName, string email, AccountRoles roles)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            new Claim(AccountConstants.Claims.Id, userId.ToString()),
            new Claim(AccountConstants.Claims.Email, email),
            new Claim(AccountConstants.Claims.Roles, ((int)roles).ToString()),
            new Claim(AccountConstants.Claims.FirstName, firstName),
            new Claim(AccountConstants.Claims.LastName, lastName)
        };

        int expiry = _settings.ExpiresInMinutes;

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiry),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
