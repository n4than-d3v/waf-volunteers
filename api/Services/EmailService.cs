using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Api.Configuration;
using Api.Constants;
using Microsoft.Graph.Models;
using Microsoft.Graph.Users.Item.SendMail;
using Azure.Identity;

namespace Api.Services;

public interface IEmailService
{
    Task SendEmailAsync(Email email);
}

public class EmailService : IEmailService
{
    private const string Scope = "https://graph.microsoft.com/.default";
    private readonly SmtpSettings _settings;

    public EmailService(IOptions<SmtpSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(Email email)
    {
        var credential = new ClientSecretCredential(
            tenantId: _settings.TenantId,
            clientId: _settings.Client.Id,
            clientSecret: _settings.Client.Secret
        );

        var client = new GraphServiceClient(credential, [Scope]);

        await client.Users[_settings.Sender.Email]
            .SendMail
            .PostAsync(new SendMailPostRequestBody
            {
                Message = new Message
                {
                    Subject = email.Subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = email.Body
                    },
                    ToRecipients =
                    [
                        new Recipient
                        {
                            EmailAddress = new EmailAddress
                            {
                                Address = email.Address,
                                Name = email.FullName
                            }
                        }
                    ],
                    From = new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = _settings.Sender.Email,
                            Name = _settings.Sender.Name
                        }
                    }
                },
                SaveToSentItems = true
            });
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

    public static Email ResetPassword(string firstName, string lastName, string email, string token) =>
        new(firstName, lastName, email, "WAF - Reset password",
$"""
<p>Hi {firstName},</p>
<br />
<p>We have received a request to reset your password.</p>
<p>Please <a href="{HostConstants.BaseUrl}/reset-password?token={token}">click here</a> to reset your password.</p>
<p>This link will expire in 2 hours.</p>
<p>If this was not you, contact the office.</p>
""");

    public static Email ResetPasswordSuccess(string firstName, string lastName, string email) =>
        new(firstName, lastName, email, "WAF - Reset password success",
$"""
<p>Hi {firstName},</p>
<br />
<p>Thank you for verifying your email address, your password has been successfully reset.</p>
<p>If this was not you, please urgently contact the office.</p>
""");
}
