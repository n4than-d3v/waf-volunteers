using Api.Constants;
using Api.Database.Entities.Account;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Api.Services;

public interface IUserContext
{
    int Id { get; }
    string FirstName { get; }
    string LastName { get; }
    string Email { get; }
    AccountRoles Roles { get; }
}

public class UserContext : IUserContext
{
    private readonly ClaimsPrincipal _user;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _user = httpContextAccessor.HttpContext!.User;
    }

    public int Id => int.Parse(_user.FindFirstValue(AccountConstants.Claims.Id) ?? "-1");

    public string FirstName => _user.FindFirstValue(AccountConstants.Claims.FirstName) ?? "Unknown";

    public string LastName => _user.FindFirstValue(AccountConstants.Claims.LastName) ?? "Unknown";

    public string Email => _user.FindFirstValue(ClaimTypes.Email) ?? "Unknown";

    public AccountRoles Roles => _user.GetRoles();
}

public static class ClaimsPrincipalExtensions
{
    public static AccountRoles GetRoles(this ClaimsPrincipal claimsPrincipal)
    {
        return (AccountRoles)int.Parse(claimsPrincipal.FindFirstValue(ClaimTypes.Role) ?? "0");
    }

    public static bool IsAdmin(this ClaimsPrincipal claimsPrincipal) => claimsPrincipal.GetRoles().HasFlag(AccountRoles.APP_ADMIN);
    public static bool IsClocking(this ClaimsPrincipal claimsPrincipal) => claimsPrincipal.GetRoles().HasFlag(AccountRoles.APP_CLOCKING);
}