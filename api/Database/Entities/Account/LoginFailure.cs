namespace Api.Database.Entities.Account;

public class LoginFailure : Entity
{
    public string Reference { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string PasswordHash { get; set; }
    public string? Exception { get; set; }
    public LoginFailureBreakpoint Breakpoint { get; set; }
    public string Salt { get; set; }
}

public enum LoginFailureBreakpoint
{
    NoUserWithUsername = 1,
    PasswordDoesNotMatch = 2,
    StatusIsNotActive = 3,
    UnhandledError = 4
}