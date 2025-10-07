namespace Api.Configuration;

public class PushSettings
{
    public string Email { get; set; }
    public string PublicKey { get; set; }
    public string PrivateKey { get; set; }

    public string NotificationAuthorizationCode { get; set; }
}
