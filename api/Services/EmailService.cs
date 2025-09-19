namespace Api.Services;

using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Identity.Client;
using Microsoft.Extensions.Options;
using Api.Configuration;
using Api.Constants;

public interface IEmailService
{
    Task SendEmailAsync(Email email);
}

public class EmailService : IEmailService
{
    private const string Scope = "https://outlook.office365.com/.default";
    private const string Authority = "https://login.microsoftonline.com";

    private const string SmtpServer = "smtp.office365.com";
    private const int SmtpPort = 587;

    private readonly SmtpSettings _settings;

    public EmailService(IOptions<SmtpSettings> settings)
    {
        _settings = settings.Value;
    }

    private async Task<string> GetAccessTokenAsync()
    {
        var app = ConfidentialClientApplicationBuilder
            .Create(_settings.Client.Id)
            .WithClientSecret(_settings.Client.Secret)
            .WithAuthority(new Uri($"{Authority}/{_settings.TenantId}"))
            .Build();

        var authResult = await app.AcquireTokenForClient([Scope]).ExecuteAsync();
        return authResult.AccessToken;
    }

    public async Task SendEmailAsync(Email email)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.Sender.Name, _settings.Sender.Email));
        message.To.Add(new MailboxAddress(email.FullName, email.Address));
        message.Subject = email.Subject;

        message.Body = new TextPart("html")
        {
            Text = email.Body
        };

        var accessToken = await GetAccessTokenAsync();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(SmtpServer, SmtpPort, SecureSocketOptions.StartTls);

        var oauth2 = new SaslMechanismOAuth2(_settings.Sender.Email, accessToken);
        await smtp.AuthenticateAsync(oauth2);

        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
    }
}

public class Email
{
    public string FullName => $"{FirstName} {LastName}";
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Address { get; private set; }

    public string Subject { get; private set; }
    public string Body { get; private set; }

    private Email(string firstName, string lastName, string address, string subject, string body)
    {
        FirstName = firstName;
        LastName = lastName;
        Address = address;
        Subject = subject;
        Body = body;
    }

    public static Email ResetPassword(string firstName, string lastName, string email, string token)
        => new(firstName, lastName, email, "WAF - Reset password",
$""""
<h1>Reset password</h1>
<p>Hi {firstName},</p>
<p>We have received a request to reset your password.</p>
<p>Please <a href="{HostConstants.BaseUrl}/reset-password?token={token}">click here</a> to reset.</p>
<p>If this was not you, contact the office.</p>
"""");
}