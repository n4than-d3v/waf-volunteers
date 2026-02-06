namespace Api.Configuration;

public class SmtpSettings
{
    public string TenantId { get; set; }
    public SmtpSettingsClient Client { get; set; }
    public SmtpSettingsSender Sender { get; set; }
    public SmtpSettingsSender Drafter { get; set; }
}

public class SmtpSettingsClient
{
    public string Id { get; set; }
    public string Secret { get; set; }
}

public class SmtpSettingsSender
{
    public string Name { get; set; }
    public string Email { get; set; }
}