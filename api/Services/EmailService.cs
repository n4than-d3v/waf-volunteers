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

        var sender = email.Draft ? _settings.Drafter : _settings.Sender;

        var message = new Message
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
                    Address = sender.Email,
                    Name = sender.Name
                }
            }
        };

        if (email.Draft)
        {
            message.IsDraft = true;
            await client.Users[sender.Email]
                .Messages
                .PostAsync(message);
        }
        else
        {
            await client.Users[sender.Email]
                .SendMail
                .PostAsync(new SendMailPostRequestBody
                {
                    Message = message
                });
        }
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

    public bool Draft { get; set; } = false;

    private Email(string firstName, string lastName, string address, string subject, string body)
    {
        FirstName = firstName;
        LastName = lastName;
        Address = address;
        Subject = subject;
        Body = body;
    }

    private const string Format = "<!doctypehtml><html lang=en><meta content=\"width=device-width,initial-scale=1\"name=viewport><meta content=\"text/html; charset=UTF-8\"http-equiv=Content-Type><title>Wildlife Aid Foundation</title><style media=all>.img-container{background-color:#1e544e;padding:20px}body{font-family:Helvetica,sans-serif;-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.3;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%}table td{font-family:Helvetica,sans-serif;font-size:16px;vertical-align:top}body{background-color:#f4f5f6;margin:0;padding:0}.body{background-color:#f4f5f6;width:100%}.container{margin:0 auto!important;max-width:600px;padding:0;padding-top:24px;width:600px}.content{box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:0}.main{background:#fff;border:5px solid #1e544e;border-radius:16px;width:100%}.wrapper{box-sizing:border-box;padding:24px}.footer{clear:both;padding-top:24px;text-align:center;width:100%}.footer a,.footer p,.footer span,.footer td{color:#1e544e;font-size:16px;text-align:center}p{font-family:Helvetica,sans-serif;font-size:16px;font-weight:400;margin:0;margin-bottom:16px}a{color:#0867ec;text-decoration:underline}.btn{box-sizing:border-box;min-width:100%!important;width:100%}.btn>tbody>tr>td{padding-bottom:16px}.btn table{width:auto}.btn table td{background-color:#fff;border-radius:4px;text-align:center}.btn a{background-color:#fff;border:solid 2px #0867ec;border-radius:4px;box-sizing:border-box;color:#0867ec;cursor:pointer;display:inline-block;font-size:16px;font-weight:700;margin:0;padding:12px 24px;text-decoration:none;text-transform:capitalize}.btn-primary table td{background-color:#0867ec}.btn-primary a{background-color:#0867ec;border-color:#0867ec;color:#fff}@media all{.btn-primary table td:hover{background-color:#ec0867!important}.btn-primary a:hover{background-color:#ec0867!important;border-color:#ec0867!important}}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.text-link{color:#0867ec!important;text-decoration:underline!important}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}@media only screen and (max-width:640px){.main p,.main span,.main td{font-size:16px!important}.wrapper{padding:8px!important}.content{padding:0!important}.container{padding:0!important;padding-top:8px!important;width:100%!important}.main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}.btn table{max-width:100%!important;width:100%!important}.btn a{font-size:16px!important;max-width:100%!important;width:100%!important}}.header{width:100%;margin:auto}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}}</style><table border=0 cellpadding=0 cellspacing=0 role=presentation class=body><tr><td> <td class=container><div class=content><table border=0 cellpadding=0 cellspacing=0 role=presentation class=main><tr><td class=img-container><img class=\"img\" alt=\"\"src=\"https://volunteers.wildlifeaid.org.uk/images/header.svg\"><tr><td class=wrapper>{CONTENT}</table><div class=footer><table border=0 cellpadding=0 cellspacing=0 role=presentation><tr><td class=content-block><span class=apple-link>Wildlife Aid Foundation © 2025, Registered Charity No. 1138944, Randalls Farm House, Randalls Rd, Leatherhead KT22 0AL</span></table></div></div><td> </table>";
    private const string ContentPlaceholder = "{CONTENT}";

    public static Email Internal_PhoneNumberUpdated(string firstName, string lastName, string recipient, string previousPrimaryPhoneNumber, string updatedPrimaryPhoneNumber) =>
        new(firstName, lastName, $"{recipient}@{HostConstants.Domain}", "[WAF App] Phone number updated", Format.Replace(ContentPlaceholder,
$"""
<p>This is a notification that a volunteer has updated their phone number.</p>
<br />
<p><strong>Date:</strong> {DateTime.Now:dd MMM yyyy HH:mm}</p>
<p><strong>Volunteer:</strong> {firstName} {lastName}</p>
<p><strong>Previous phone number:</strong> {previousPrimaryPhoneNumber}</p>
<p><strong>Updated phone number:</strong> {updatedPrimaryPhoneNumber}</p>
"""));

    public static Email External_PatientUpdate_Death(string fullName, string recipient, string content) =>
        new(fullName, "", recipient, "Wildlife Aid Foundation - Patient Update", Format.Replace(ContentPlaceholder, content))
        { Draft = true };

    public static Email External_PatientUpdate_ReadyForCollection(string fullName, string recipient, string species, DateTime admissionDate) =>
        new(fullName, "", recipient, "Wildlife Aid Foundation - Patient Update", Format.Replace(ContentPlaceholder,
$"""
<p>Hi {fullName},</p>
<br />
<p>We are pleased to announce that the {species} you dropped off on {admissionDate:dddd d MMMM} has made a full recovery and is now ready for collection.</p>
<p>You can find us at: <a href="https://maps.app.goo.gl/XDBoof9GPp7z47Xa7">Randalls Farm House, Randalls Rd, Leatherhead KT22 0AL</a>.</p>
<p>If you are unable to collect, please let us know by responding to this email. Otherwise, we look forward to seeing you soon!</p>
<p>Thank you again for your commitment to keeping wildlife safe and sound!</p>
"""))
        { Draft = true };

    public static Email AccountCreated(string firstName, string lastName, string username, string email, string token) =>
        new(firstName, lastName, email, "WAF - Account created", Format.Replace(ContentPlaceholder,
$"""
<p>Hi {firstName} {lastName},</p>
<br />
<p>Your Wildlife Aid volunteer account has been created.</p>
<p>Please carefully follow the instructions below to get started:</p>
<br />
<p><strong>Step 1 - Installation</strong></p>
<p>Open this email on the device you wish to install the application on.</p>
<p>We recommend you use your mobile phone.</p>
<p>If you do not have a mobile phone, a tablet will also work.</p>
<p>If you do not have a mobile phone or a tablet, you can use your computer or laptop.</p>
<p>Simply <a href="{HostConstants.BaseUrl}/install">click here to install</a> and follow the instructions.</p>
<br />
<p><strong>Step 2 - Set password</strong></p>
<p>After you have installed the application, please return to this email.</p>
<p>Next, <a href="{HostConstants.BaseUrl}/reset-password?token={token}">click here to set your password</a>.</p>
<p>You will be asked to set the password that you will use to log into your account.</p>
<p>Note that the above link will expire in 7 days, but if you're unable to set your password within this timeframe, <a href="{HostConstants.BaseUrl}/forgot-password">click here to request a password reset</a>.</p>
<br />
<p><strong>Step 3 - Log in</strong></p>
<p>Finally, you can log into your new volunteer account.</p>
<p>Your username is: "<strong>{username}</strong>".</p>
<p>Simply <a href="{HostConstants.BaseUrl}/install">click here to login</a> by providing your username and password.</p>
<br /><br />
<p>If you experience any difficulties, please contact the office for support.</p>
"""));

    public static Email ResetPassword(string firstName, string lastName, string username, string email, string token) =>
        new(firstName, lastName, email, "WAF - Reset password", Format.Replace(ContentPlaceholder,
$"""
<p>Hi {firstName} {lastName},</p>
<br />
<p>We have received a request to reset your password.</p>
<p>Please <a href="{HostConstants.BaseUrl}/reset-password?token={token}">click here</a> to reset your password.</p>
<p>This link will expire in 2 hours.</p>
<p>If this was not you, contact the office.</p>
"""));

    public static Email ResetPasswordSuccess(string firstName, string lastName, string username, string email) =>
        new(firstName, lastName, email, "WAF - Reset password success", Format.Replace(ContentPlaceholder,
$"""
<p>Hi {firstName} {lastName},</p>
<br />
<p>Thank you for verifying your email address, your password has been successfully reset.</p>
<p>As a reminder, your username for logging in is: "<strong>{username}</strong>".</p>
<p>If this was not you, please urgently contact the office.</p>
"""));
}
