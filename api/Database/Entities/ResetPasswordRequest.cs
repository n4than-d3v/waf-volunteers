namespace Api.Database.Entities;

public class ResetPasswordRequest : Entity
{
    public Account Account { get; set; }
    public string Token { get; set; }
    public string Salt { get; set; }
    public DateTime Expires { get; set; }
}
