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
                    Address = _settings.Sender.Email,
                    Name = _settings.Sender.Name
                }
            }
        };

        if (email.Draft)
        {
            return;

            message.IsDraft = true;
            await client.Users[_settings.Sender.Email]
                .Messages
                .PostAsync(message);
        }
        else
        {
            await client.Users[_settings.Sender.Email]
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

    private const string Format = "<!doctypehtml><html lang=en><meta content=\"width=device-width,initial-scale=1\"name=viewport><meta content=\"text/html; charset=UTF-8\"http-equiv=Content-Type><title>Wildlife Aid Foundation</title><style media=all>.img-container{background-color:#1e544e;padding:20px}body{font-family:Helvetica,sans-serif;-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.3;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%}table td{font-family:Helvetica,sans-serif;font-size:16px;vertical-align:top}body{background-color:#f4f5f6;margin:0;padding:0}.body{background-color:#f4f5f6;width:100%}.container{margin:0 auto!important;max-width:600px;padding:0;padding-top:24px;width:600px}.content{box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:0}.main{background:#fff;border:5px solid #1e544e;border-radius:16px;width:100%}.wrapper{box-sizing:border-box;padding:24px}.footer{clear:both;padding-top:24px;text-align:center;width:100%}.footer a,.footer p,.footer span,.footer td{color:#1e544e;font-size:16px;text-align:center}p{font-family:Helvetica,sans-serif;font-size:16px;font-weight:400;margin:0;margin-bottom:16px}a{color:#0867ec;text-decoration:underline}.btn{box-sizing:border-box;min-width:100%!important;width:100%}.btn>tbody>tr>td{padding-bottom:16px}.btn table{width:auto}.btn table td{background-color:#fff;border-radius:4px;text-align:center}.btn a{background-color:#fff;border:solid 2px #0867ec;border-radius:4px;box-sizing:border-box;color:#0867ec;cursor:pointer;display:inline-block;font-size:16px;font-weight:700;margin:0;padding:12px 24px;text-decoration:none;text-transform:capitalize}.btn-primary table td{background-color:#0867ec}.btn-primary a{background-color:#0867ec;border-color:#0867ec;color:#fff}@media all{.btn-primary table td:hover{background-color:#ec0867!important}.btn-primary a:hover{background-color:#ec0867!important;border-color:#ec0867!important}}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.text-link{color:#0867ec!important;text-decoration:underline!important}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}@media only screen and (max-width:640px){.main p,.main span,.main td{font-size:16px!important}.wrapper{padding:8px!important}.content{padding:0!important}.container{padding:0!important;padding-top:8px!important;width:100%!important}.main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}.btn table{max-width:100%!important;width:100%!important}.btn a{font-size:16px!important;max-width:100%!important;width:100%!important}}.header{width:100%;margin:auto}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}}</style><table border=0 cellpadding=0 cellspacing=0 role=presentation class=body><tr><td> <td class=container><div class=content><table border=0 cellpadding=0 cellspacing=0 role=presentation class=main><tr><td class=img-container><img class=\"img\" alt=\"\"src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjYiIHZpZXdCb3g9IjAgMCAyMjAgNjYiIGZpbGw9Im5vbmUiPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF81XzYpIj48cGF0aCBkPSJNNy44MjYzNyA2MS43Njk5QzYuOTIzNzMgNjAuMjIzOSA2LjE1MzczIDU4LjQ2NTQgNi4xMzQzMiA1Ni42NDE1QzYuMTExNjcgNTQuNjE0OSA2LjgxNjk2IDUyLjA2MjEgOC44NjgxNCA1MS4yMzE5QzExLjAzNTggNTAuMzU1OSAxMi41NTY0IDQ4LjQ2NjYgMTMuOTEyIDQ2LjYyOTdDMTUuMjIyMyA0NC44NTQ4IDE2LjIwNTggNDMuMDIxMSAxOC4zMTUyIDQyLjA5MjhDMTkuNzI1OCA0MS40NzE4IDIxLjI3ODcgNDEuMjU5MyAyMi44MTU1IDQxLjE5MDdDMjUuOTYzNCA0MS4wNTAxIDI5LjEzNzMgNDEuNDg4MSAzMi4xMzMxIDQyLjQ4MThDMzMuMDE2NCA0Mi43NzI3IDMzLjkxNTggNDMuMTM1NSAzNC41NTMxIDQzLjgxNTRDMzUuMjk3MyA0NC42MDk3IDM1LjU4NTIgNDUuNzI3NSAzNi4wNTc1IDQ2LjY4NTJDMzYuNTYyMyA0Ny43MDUxIDM3LjA1NCA0OC43MjgxIDM3LjYwNzMgNDkuNzI1MUMzOC42NTIzIDUxLjYwNzggMzkuMzk5NiA1Mi4yODc3IDQyLjA4NDkgNTIuNzM4N0M0NC43NzM0IDUzLjE4OTggNDMuMDU1NSA1Ni40MzIzIDQzLjA1NTUgNTYuNDMyM0M0My4wNTU1IDU2LjQzMjMgNDEuMDM5OSA2MS4yNTM1IDM4LjgwMTEgNjIuNTM0OEMzNi41NjIzIDYzLjgxNjEgMzMuNTAxNyA2Mi43NjAzIDMwLjI4OSA2MC43MjcyQzI3LjA3OTYgNTguNjk0MiAyNC4zMTY3IDU5LjA3IDI0LjMxNjcgNTkuMDdDMTkuNjkzNCA1OC45NzIgMTYuMDUzNyA2Mi41ODM4IDEyLjIxOTkgNjQuNjUyOUMxMS44MDkgNjQuODcxOSAxMS4zNzIzIDY1LjA4NzYgMTAuOTA2NCA2NS4wNzEyQzEwLjg5NjcgNjUuMDcxMiAxMC44OTAyIDY1LjA3MTIgMTAuODgwNSA2NS4wNzEyQzkuNDg2MDggNjQuOTk5MyA4LjQzMTM3IDYyLjgyOSA3LjgxNjY3IDYxLjc3NjUiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTQxLjcxOTUgNDcuNjE3QzQ0LjgxNTYgNDkuNDkzMiA0Ny4yMjkyIDQ0LjI4OTUgNDcuNTAwOSA0MS45NTlDNDcuNjE0MiA0MS4wMDEzIDQ3Ljk2MzYgMzguNjM0OCA0Ni41NzI0IDM4LjQyNTZDNDQuNTU2OCAzOC4xMjQ5IDM5LjkyNzEgNDIuOTQ2MSAzOS45MjcxIDQyLjk0NjFDMzguODU5NSA0My45OTIxIDM4LjczMzMgNDUuODA5NCA0MS43MTk1IDQ3LjYxN1oiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTMuMDQ4MTYgNDUuMTMwMkMzLjA0ODE2IDQ1LjEzMDIgNC45ODkzMyA0Ny4wMTI5IDcuNjAwMjEgNDQuMTQ5NkMxMC4yMTQzIDQxLjI4NjMgOS42MTU4IDM5LjQwMzYgOC40MjE5OCAzNy42NzEyQzcuMjI4MTYgMzUuOTM4OCA0LjA5MzE1IDMxLjcxOTEgMS4zMzAyMSAzMy4xNTA3Qy0xLjQzMjczIDM0LjU4MjQgMC41ODI4NjEgNDIuOTQzNSAzLjA0ODE2IDQ1LjEzMDJaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMS4yNTkgMjQuMzM1M0M3Ljc1MTkyIDMxLjQxODQgMTAuNzM0OSAzNC41MDcyIDEwLjczNDkgMzQuNTA3MkMxNS4yMTU3IDM3Ljk3MiAxNy44MjY2IDM1LjkzODkgMTcuODI2NiAzNS45Mzg5QzIwLjgxMjggMzIuMDk1IDE1LjA2MzcgMjIuOTAzNiAxNS4wNjM3IDIyLjkwMzZDMTMuNTQ2MyAyMC4wOTI2IDExLjI1NTcgMjQuMzM1MyAxMS4yNTU3IDI0LjMzNTMiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTI3LjIzNDcgMTguMTU3M0MyNy4yMzQ3IDE4LjE1NzMgMjIuMzA3NCAxNy40Nzc0IDIxLjYzNDQgMjYuODk3NkMyMC45NjE1IDM2LjMxNDUgMjYuMzM4NiAzNC44ODI4IDI2LjMzODYgMzQuODgyOEMyNi4zMzg2IDM0Ljg4MjggMzAuNTE4NiAzMi42OTk0IDMwLjU5MyAyNS44NDE4QzMwLjY2NzQgMTguOTg0MyAyOC44NzUgMTguOTA5MSAyNy4yMzQ3IDE4LjE1NzNaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0zMi4zODU1IDMxLjI4NzRDMzIuMzg1NSAzMS4yODc0IDMwLjI5NTUgMzcuOTc1IDM0LjI1MjMgMzkuMjk4OEMzOC4yMDkxIDQwLjYyNTkgNDAuNDQ3OSAzNS40ODc2IDQwLjQ0NzkgMzUuNDg3NkM0NC4xODE0IDI0LjYzOSAzOS4yMzQ3IDIzLjA1NyAzOS4yMzQ3IDIzLjA1N0MzNC44ODY0IDIyLjQ1MjMgMzIuMzg1NSAzMS4yODc0IDMyLjM4NTUgMzEuMjg3NFoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTM3Ljk4NTkgMTEuMTg4M0MzNi43OTIgMTQuMzkxNSAzOS4yMzQ3IDE1LjgyMzIgMzkuMjM0NyAxNS44MjMyQzM5LjM2NDEgMTAuMzk3MyA0Mi45MTMyIDYuNTU2NjQgNDIuOTEzMiA2LjU1NjY0QzQxLjEyMDkgNi43MDcgMzkuMTc5NyA3Ljk4ODMgMzcuOTg1OSAxMS4xOTE1IiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0yNS4yMzYxIDUuMTYxMTVDMjMuOTA2NCA4LjcyNzIyIDI2LjYyNzMgMTAuMzIyMyAyNi42MjczIDEwLjMyMjNDMjYuNzcyOSA0LjI4MTg5IDMwLjcyMzIgMCAzMC43MjMyIDBDMjguNzI3IDAuMTY2NyAyNi41NjU5IDEuNTk1MDkgMjUuMjM2MSA1LjE2MTE1WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMTIuMzQ2MiA5LjI1MzQ1QzExLjQ1OTcgMTIuNjIwMSAxNC4wODAzIDEzLjgxOTcgMTQuMDgwMyAxMy44MTk3QzEzLjY2MjkgOC4zMDg4MiAxNi44NzI0IDQuMDQ5OCAxNi44NzI0IDQuMDQ5OEMxNS4wNzM1IDQuMzg2NDcgMTMuMjM1OSA1Ljg4MzUgMTIuMzQ2MiA5LjI1MzQ1WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMC45NzEzNzkgMjAuOTcxOUMwLjQ4OTMyIDI0LjA5NjcgMi45Njc1NiAyNC45MjY5IDIuOTY3NTYgMjQuOTI2OUMyLjA3MTM4IDE5Ljk5MTMgNC41NjI1NiAxNS44MzY5IDQuNTYyNTYgMTUuODM2OUMyLjk2NzU2IDE2LjMxNDEgMS40NTAyIDE3Ljg0MzggMC45NjgxNDQgMjAuOTY4NiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNODMuNzM2MSAxOC40MjQ5Qzg0LjU3NDEgMTguNDI0OSA4NS41NDQ3IDE3LjkzNDYgODUuNTQ0NyAyMy44NzA0Qzg1LjU0NDcgMzYuNDIxOSA3OC4yMTk5IDQ2LjMzNTYgNzcuNjA1MiA0Ni4zMzU2Qzc2LjE4NDkgNDYuMzM1NiA3Mi44OTQ3IDM3LjcyOTQgNzEuODMwMiAzNy43Mjk0QzcwLjc2NTggMzcuNzI5NCA2Ny40NzIzIDQ2LjMzNTYgNjYuMDUyIDQ2LjMzNTZDNjUuNDQwNSA0Ni4zMzU2IDU5LjExMjMgMzguMDUzIDU5LjExMjMgMjYuODcxQzU5LjExMjMgMTcuOTM3OSA1OS43MjcgMTguNDI0OSA2MC40MDMyIDE4LjQyNDlINjQuNDA1MkM2NC43Mjg4IDE4LjQyNDkgNjUuMTQ2MSAxOC40NTc2IDY1LjE0NjEgMTguODgyNUM2NS4xNDYxIDE5LjIwOTQgNjQuMjExMSAyMS40OTA5IDY0LjIxMTEgMjUuNzk1NkM2NC4yMTExIDMzLjgxNjggNjYuMTQ1OCAzNy41NjU5IDY2Ljg4OTkgMzcuNTY1OUM2Ny44ODk3IDM3LjU2NTkgNzAuNTM2MSAzMi45Mzc2IDcwLjUzNjEgMjUuMTc3OUM3MC41MzYxIDIwLjg0MDQgNjkuOTUzOCAxOS4yNzggNjkuOTUzOCAxOC44NTMxQzY5Ljk1MzggMTguNDYwOCA3MC4xNDc5IDE4LjQyODIgNzAuNTAzOCAxOC40MjgySDc0LjdDNzUuMTIwNSAxOC40MjgyIDc1LjUwNTUgMTguNDkzNSA3NS41MDU1IDE4Ljk4MzhDNzUuNTA1NSAxOS41Mzk1IDc0Ljg5NDEgMjEuNDYxNCA3NC44OTQxIDI1LjA3OThDNzQuODk0MSAzMi4zNDkyIDc2LjczNDkgMzcuNTY1OSA3Ny43MDIzIDM3LjU2NTlDNzguOTI4NSAzNy41NjU5IDgxLjE4NjcgMzEuODI2MiA4MS4xODY3IDI2LjM1MTNDODEuMTg2NyAyMi44OTY0IDgwLjA5IDE5LjM0MDEgODAuMDkgMTguOTE4NUM4MC4wOSAxOC4zOTU1IDgwLjQ3ODIgMTguNDI4MiA4MC43Njk0IDE4LjQyODJIODMuNzM5NEw4My43MzYxIDE4LjQyNDlaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik04OC42MDg4IDE5Ljk5MUM4OC42MDg4IDE4LjU4ODggODkuODAyNiAxNy43NDIyIDkxLjA5MzUgMTcuNzQyMkM5Mi4zODQ0IDE3Ljc0MjIgOTMuNTc4MiAxOC41ODg4IDkzLjU3ODIgMTkuOTkxQzkzLjU3ODIgMjEuMzkzMiA5Mi4zODQ0IDIyLjE0MTggOTEuMDkzNSAyMi4xNDE4Qzg5LjgwMjYgMjIuMTQxOCA4OC42MDg4IDIxLjM5MzIgODguNjA4OCAxOS45OTFaTTg5Ljk2NDQgNDUuNTU0OUM4OC4zODIzIDQ1LjU1NDkgODguMjUyOSA0Ni4yMzggODguMjUyOSAzNC43NjE5Qzg4LjI1MjkgMjMuMjg1OCA4OC43NzA2IDI0LjY4OCA4OS44MzUgMjQuNjg4SDkxLjYxMTJDOTIuOTY2OCAyNC42ODggOTIuOTk5MSAyNC43ODYxIDkyLjk5OTEgMjUuMTc4M0M5Mi45OTkxIDI2LjM4NDQgOTIuNjEwOSAyNy41OTA1IDkyLjYxMDkgMzEuMTQzNUM5Mi42MTA5IDM5LjM2MDggOTMuODY5NCA0NC40MTQxIDkzLjg2OTQgNDQuNzA4M0M5My44Njk0IDQ1Ljc1MSA5Mi45MDIgNDUuNTU0OSA5Mi4xNTc5IDQ1LjU1NDlIODkuOTY0NFoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTk3LjUzMTUgNDUuNTU0NUM5Ni40MDI0IDQ1LjU1NDUgOTYuNTMxOCAzNC42MzA4IDk2LjUzMTggMzMuODgyM0M5Ni41MzE4IDMyLjM0OTMgOTYuNDAyNCAxNy43NDE4IDk3Ljg1NTEgMTcuNzQxOEgxMDAuOTIyQzEwMS4yNzggMTcuNzQxOCAxMDIuMjQ1IDE3LjY0MzggMTAyLjI0NSAxOC4zNTk2QzEwMi4yNDUgMTguNTU1NyAxMDAuODkgMjMuMjQ5NSAxMDAuODkgMzEuMzY4N0MxMDAuODkgNDAuMzM0NiAxMDIuMTE2IDQ0LjczNzQgMTAyLjExNiA0NS4xNTlDMTAyLjExNiA0NS43MTQ3IDEwMS4yNzggNDUuNTUxMyAxMDAuOTIyIDQ1LjU1MTNIOTcuNTM0OEw5Ny41MzE1IDQ1LjU1NDVaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMTQuMTAzIDMzLjQyNTRDMTE0LjEwMyAyNy42ODU3IDExMy4yMzMgMjcuMjk2NyAxMTIuMDM5IDI3LjI5NjdDMTEwLjY1MSAyNy4yOTY3IDEwNy40OSAyOS4xMjM5IDEwNy40OSAzNS4wNTY0QzEwNy40OSAzNy4zMDUyIDEwOC4zMjggNDAuNzkyOCAxMTEuMDcyIDQwLjc5MjhDMTE0LjU1NiA0MC43OTI4IDExNC4xMDMgMzUuNzcyMiAxMTQuMTAzIDMzLjQyNTRaTTEwOS45MDcgNDUuNTU1MkMxMDYuMjkzIDQ1LjU1NTIgMTAzLjEyOSA0Mi4zMjU4IDEwMy4xMjkgMzUuNzM5NkMxMDMuMTI5IDI4LjI3NCAxMDguMDM0IDI0LjE5ODEgMTEwLjg3NCAyNC4xOTgxQzExMS41NSAyNC4xOTgxIDExMi4yNjIgMjQuOTQ2NiAxMTIuNzE1IDI0Ljk0NjZDMTEzLjM1OSAyNC45NDY2IDExMy40NTYgMjMuNzczMSAxMTMuNDU2IDIzLjI1MDJDMTEzLjQ1NiAyMC42MDkxIDExMi42NSAxOS40MzU3IDExMi42NSAxOC4xOTY5QzExMi42NSAxNy43MzkzIDExMy40NTYgMTcuNzM5MyAxMTMuNzc5IDE3LjczOTNIMTE3LjEzNEMxMTguNTg3IDE3LjczOTMgMTE4LjQ1OCAzMi4zNDY3IDExOC40NTggMzMuODc5N0MxMTguNDU4IDM0LjYyODIgMTE4LjU4NyA0NS41NTIgMTE3LjQ1OCA0NS41NTJIMTA5LjkwN1Y0NS41NTUyWiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMTIyLjcxOCA0NS41NTQ1QzEyMS41ODkgNDUuNTU0NSAxMjEuNzE4IDM0LjYzMDggMTIxLjcxOCAzMy44ODIzQzEyMS43MTggMzIuMzQ5MyAxMjEuNTg5IDE3Ljc0MTggMTIzLjA0MiAxNy43NDE4SDEyNi4xMDlDMTI2LjQ2NSAxNy43NDE4IDEyNy40MzIgMTcuNjQzOCAxMjcuNDMyIDE4LjM1OTZDMTI3LjQzMiAxOC41NTU3IDEyNi4wNzYgMjMuMjQ5NSAxMjYuMDc2IDMxLjM2ODdDMTI2LjA3NiA0MC4zMzQ2IDEyNy4zMDIgNDQuNzM3NCAxMjcuMzAyIDQ1LjE1OUMxMjcuMzAyIDQ1LjcxNDcgMTI2LjQ2NSA0NS41NTEzIDEyNi4xMDkgNDUuNTUxM0gxMjIuNzIxTDEyMi43MTggNDUuNTU0NVoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTEzMC4wNzUgMTkuOTkxQzEzMC4wNzUgMTguNTg4OCAxMzEuMjY5IDE3Ljc0MjIgMTMyLjU2IDE3Ljc0MjJDMTMzLjg1MSAxNy43NDIyIDEzNS4wNDUgMTguNTg4OCAxMzUuMDQ1IDE5Ljk5MUMxMzUuMDQ1IDIxLjM5MzIgMTMzLjg1MSAyMi4xNDE4IDEzMi41NiAyMi4xNDE4QzEzMS4yNjkgMjIuMTQxOCAxMzAuMDc1IDIxLjM5MzIgMTMwLjA3NSAxOS45OTFaTTEzMS40MzEgNDUuNTU0OUMxMjkuODQ5IDQ1LjU1NDkgMTI5LjcyMyA0Ni4yMzggMTI5LjcyMyAzNC43NjE5QzEyOS43MjMgMjMuMjg1OCAxMzAuMjM3IDI0LjY4OCAxMzEuMzA1IDI0LjY4OEgxMzMuMDgxQzEzNC40MzYgMjQuNjg4IDEzNC40NjkgMjQuNzg2MSAxMzQuNDY5IDI1LjE3ODNDMTM0LjQ2OSAyNi4zODQ0IDEzNC4wODEgMjcuNTkwNSAxMzQuMDgxIDMxLjE0MzVDMTM0LjA4MSAzOS4zNjA4IDEzNS4zMzkgNDQuNDE0MSAxMzUuMzM5IDQ0LjcwODNDMTM1LjMzOSA0NS43NTEgMTM0LjM3MiA0NS41NTQ5IDEzMy42MzEgNDUuNTU0OUgxMzEuNDM0SDEzMS40MzFaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNDAuODU1IDQ1LjU1NDZDMTQwLjM3MyA0NS41NTQ2IDEzOS43OTEgNDYuNTMxOSAxMzkuNzkxIDM1LjgwNDNDMTM5Ljc5MSAzNC4xNzMzIDEzOS44ODggMzIuNTQyMiAxMzkuODg4IDMwLjkxNDRDMTM5Ljg4OCAyOS45MzcxIDE0MC4xNzkgMjguMDc3MyAxMzguNzI2IDI4LjA3NzNDMTM4LjE0NCAyOC4wNzczIDEzNy44MjQgMjguNDY5NSAxMzcuNDY4IDI4LjQ2OTVDMTM3LjA0NyAyOC40Njk1IDEzNy4wOCAyOC4wNDQ2IDEzNy4wOCAyNy40NTk1QzEzNy4wOCAyNC45ODE5IDEzNy43OTEgMjQuNjg3NyAxMzkuMDE0IDI0LjY4NzdDMTQwLjQ2NyAyNC42ODc3IDE0MC40NjcgMjIuNTA0MyAxNDAuOTIgMjEuMDM2N0MxNDEuNTMxIDE5LjAxNjcgMTQzLjUzNCAxNy43NDUyIDE0NS4yMTMgMTcuNzQ1MkMxNDYuNDcyIDE3Ljc0NTIgMTQ4LjExOCAxNy41ODE3IDE0OC4xMTggMTguNTI2NEMxNDguMTE4IDE5LjAxNjcgMTQ3LjczIDIyLjIxMDEgMTQ3LjE4MyAyMi4yMTAxQzE0Ni43MzEgMjIuMjEwMSAxNDYuNjAxIDIxLjkxNTkgMTQ2LjI0OCAyMS45MTU5QzE0NS4zNDYgMjEuOTE1OSAxNDQuNzMxIDIzLjI1MjggMTQ0LjczMSAyNC4wMDEzQzE0NC43MzEgMjQuNDU4OSAxNDUuMDU1IDI0Ljg0NzkgMTQ1LjUzNyAyNC44NDc5QzE0NS45NTcgMjQuODQ3OSAxNDYuMzQyIDI0LjY4NDUgMTQ2Ljc2MyAyNC42ODQ1QzE0Ny45ODkgMjQuNjg0NSAxNDguMDIxIDI1LjU2MzcgMTQ4LjAyMSAyNi42NzVDMTQ4LjAyMSAyNy4xMzI3IDE0OC4wMjEgMjguMzcxNSAxNDcuMzQ1IDI4LjM3MTVDMTQ3LjA4NiAyOC4zNzE1IDE0Ni40NDMgMjguMDc3MyAxNDUuODYgMjguMDc3M0MxNDQuMDg0IDI4LjA3NzMgMTQ0LjE0OSAzMC4yOTM0IDE0NC4xNDkgMzEuNTY0OUMxNDQuMTQ5IDM1Ljg2OTcgMTQ1LjM0MyA0NC41NDEzIDE0NS4zNDMgNDQuOTY2M0MxNDUuMzQzIDQ1LjY4NTQgMTQ0Ljg5IDQ1LjU1NDYgMTQ0LjMxMSA0NS41NTQ2SDE0MC44NThIMTQwLjg1NVoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTE1Mi44MDkgMzIuNzcwOUMxNTIuODA5IDMzLjEzMDQgMTUyLjk3MSAzMy40ODY3IDE1My4zOTIgMzMuNDg2N0MxNTMuNzggMzMuNDg2NyAxNTkuNjUyIDMyLjE4MjUgMTU5LjY1MiAzMC41MTg4QzE1OS42NTIgMjguODU1MSAxNTguMTY3IDI4LjA0MTIgMTU2Ljk0MSAyOC4wNDEyQzE1NC4zMjcgMjguMDQxMiAxNTIuODA5IDMwLjg3ODMgMTUyLjgwOSAzMi43Njc2TTE0OC40NTEgMzYuMDAwM0MxNDguNDUxIDI4LjEwOTggMTUyLjc3NyAyNC4xOTczIDE1Ny4wOTkgMjQuMTk3M0MxNjAuNjQ5IDI0LjE5NzMgMTYzLjY1MSAyNi4yMTczIDE2My42NTEgMzAuMDY0NEMxNjMuNjUxIDM3LjA3NTYgMTUzLjI1OSAzNS42MDggMTUzLjI1OSAzOC45OTc2QzE1My4yNTkgNDAuNTMwNiAxNTUuNzExIDQxLjYzODYgMTU3LjMyNiA0MS42Mzg2QzE2Mi42MTkgNDEuNjM4NiAxNjIuNjE5IDM3LjU2MjcgMTYzLjA3MiAzNy41NjI3QzE2My41NTQgMzcuNTYyNyAxNjMuNjUxIDM5LjI1OTEgMTYzLjY1MSAzOS41MTczQzE2My42NTEgNDMuNjU4NiAxNjAuNDg3IDQ2LjAzODIgMTU2LjYxNCA0Ni4wMzgyQzE1MC44MzkgNDYuMDM4MiAxNDguNDQ4IDQxLjIxMzcgMTQ4LjQ0OCAzNS45OTciIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTE4MC40ODEgMzEuMDc4M0MxODAuNDgxIDMxLjQ3MDYgMTgwLjcwOCAzMS42OTk0IDE4MS4wOTYgMzEuNjk5NEMxODEuNjc4IDMxLjY5OTQgMTg0LjgwNyAzMC44NTI4IDE4Ny42NDggMzAuODUyOEMxODguNzc3IDMwLjg1MjggMTg5LjI5NCAzMC42ODk0IDE4OS4yOTQgMjkuNzc3NEMxODkuMjk0IDI3Ljc1NzQgMTg2LjkwNyAyMy41MTggMTg1LjY4IDIzLjUxOEMxODMuOTM3IDIzLjUxOCAxODAuNDg1IDI4LjcwMiAxODAuNDg1IDMxLjA4MTZNMTg4Ljk2OCA0NS41NTUxQzE4OC42NzYgNDUuNTU1MSAxODcuNzQxIDQ1LjY1MzEgMTg3Ljc0MSA0NS4xNjI4QzE4Ny43NDEgNDQuMjUwOSAxOTAuMjI2IDQwLjk4ODggMTkwLjIyNiAzNy4yNzI0QzE5MC4yMjYgMzUuODA0OCAxODguODM4IDM1LjI1MjQgMTg3LjM4NSAzNS4yNTI0QzE4NC40NDggMzUuMjUyNCAxNzkuNzcgMzUuNzc1MyAxNzkuNzcgMzkuNDkxOEMxNzkuNzcgNDIuMDY3NCAxODEuODY2IDQ0LjgzOTIgMTgxLjg2NiA0NS4zMjYzQzE4MS44NjYgNDUuNTIyNCAxODEuNjcyIDQ1LjU1NTEgMTgxLjI1MSA0NS41NTUxSDE3Ni42MzVDMTc0Ljk4OCA0NS41NTUxIDE3NC41MzggNDIuNjE5OCAxNzQuNTM4IDM4LjM4MDRDMTc0LjUzOCAyNC40MjY3IDE4NC4xMjEgMTcuOTM4NSAxODUuNTQxIDE3LjkzODVDMTg2LjYwNiAxNy45Mzg1IDE5NC45MzMgMjIuNTk5NSAxOTQuOTMzIDM3LjczQzE5NC45MzMgNDYuNDM0MyAxOTMuNTQ1IDQ1LjU1NTEgMTkyLjU3OCA0NS41NTUxSDE4OC45NjRIMTg4Ljk2OFoiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTE5Ny44NDIgMTkuOTkxQzE5Ny44NDIgMTguNTg4OCAxOTkuMDM2IDE3Ljc0MjIgMjAwLjMyNyAxNy43NDIyQzIwMS42MTggMTcuNzQyMiAyMDIuODEyIDE4LjU4ODggMjAyLjgxMiAxOS45OTFDMjAyLjgxMiAyMS4zOTMyIDIwMS42MTggMjIuMTQxOCAyMDAuMzI3IDIyLjE0MThDMTk5LjAzNiAyMi4xNDE4IDE5Ny44NDIgMjEuMzkzMiAxOTcuODQyIDE5Ljk5MVpNMTk5LjE5OCA0NS41NTQ5QzE5Ny42MTYgNDUuNTU0OSAxOTcuNDg2IDQ2LjIzOCAxOTcuNDg2IDM0Ljc2MTlDMTk3LjQ4NiAyMy4yODU4IDE5OC4wMDEgMjQuNjg4IDE5OS4wNjggMjQuNjg4SDIwMC44NDVDMjAyLjIgMjQuNjg4IDIwMi4yMzMgMjQuNzg2MSAyMDIuMjMzIDI1LjE3ODNDMjAyLjIzMyAyNi4zODQ0IDIwMS44NDQgMjcuNTkwNSAyMDEuODQ0IDMxLjE0MzVDMjAxLjg0NCAzOS4zNjA4IDIwMy4xMDMgNDQuNDE0MSAyMDMuMTAzIDQ0LjcwODNDMjAzLjEwMyA0NS43NTEgMjAyLjEzNSA0NS41NTQ5IDIwMS4zOTEgNDUuNTU0OUgxOTkuMTk4WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMjE1LjYzOSAzMy40MjU0QzIxNS42MzkgMjcuNjg1NyAyMTQuNzY5IDI3LjI5NjcgMjEzLjU3NSAyNy4yOTY3QzIxMi4xODcgMjcuMjk2NyAyMDkuMDIzIDI5LjEyMzkgMjA5LjAyMyAzNS4wNTY0QzIwOS4wMjMgMzcuMzA1MiAyMDkuODYxIDQwLjc5MjggMjEyLjYwNCA0MC43OTI4QzIxNi4wODkgNDAuNzkyOCAyMTUuNjM5IDM1Ljc3MjIgMjE1LjYzOSAzMy40MjU0Wk0yMTEuNDQzIDQ1LjU1NTJDMjA3LjgyOSA0NS41NTUyIDIwNC42NjUgNDIuMzI1OCAyMDQuNjY1IDM1LjczOTZDMjA0LjY2NSAyOC4yNzQgMjA5LjU3IDI0LjE5ODEgMjEyLjQxIDI0LjE5ODFDMjEzLjA5IDI0LjE5ODEgMjEzLjc5OCAyNC45NDY2IDIxNC4yNTEgMjQuOTQ2NkMyMTQuODk1IDI0Ljk0NjYgMjE0Ljk5MiAyMy43NzMxIDIxNC45OTIgMjMuMjUwMkMyMTQuOTkyIDIwLjYwOTEgMjE0LjE4NyAxOS40MzU3IDIxNC4xODcgMTguMTk2OUMyMTQuMTg3IDE3LjczOTMgMjE0Ljk5MiAxNy43MzkzIDIxNS4zMTYgMTcuNzM5M0gyMTguNjcxQzIyMC4xMjMgMTcuNzM5MyAyMTkuOTk0IDMyLjM0NjcgMjE5Ljk5NCAzMy44Nzk3QzIxOS45OTQgMzQuNjI4MiAyMjAuMTIzIDQ1LjU1MiAyMTguOTk0IDQ1LjU1MkgyMTEuNDQzVjQ1LjU1NTJaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik02My40Nzk2IDUxLjA1ODdWNTMuNjMxMUg2Ni40NzIzVjU0LjQ0MTdINjMuNDc5NlY1Ny42MDI0SDYyLjQ5NjFWNTAuMjQ4SDY2Ljk4MDJWNTEuMDU4N0g2My40Nzk2WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNODQuNTEyMiA1My45MjkyQzg0LjUxMjIgNTMuNDc4MSA4NC40NTA3IDUzLjA3MjggODQuMzI3OCA1Mi43MTMzQzg0LjIwNDggNTIuMzUzNyA4NC4wMzMzIDUyLjA0OTcgODMuODEwMSA1MS44MDEzQzgzLjU4NjkgNTEuNTUyOSA4My4zMTUxIDUxLjM2MzMgODIuOTk4MSA1MS4yMjkzQzgyLjY4MSA1MS4wOTUzIDgyLjMyNTEgNTEuMDI5OSA4MS45MzA0IDUxLjAyOTlDODEuNTM1NyA1MS4wMjk5IDgxLjE4NjMgNTEuMDk1MyA4MC44NjkyIDUxLjIyOTNDODAuNTUyMiA1MS4zNjMzIDgwLjI4MDQgNTEuNTUyOSA4MC4wNTM5IDUxLjgwMTNDNzkuODI3NSA1Mi4wNDk3IDc5LjY1NiA1Mi4zNTM3IDc5LjUzMzEgNTIuNzEzM0M3OS40MTAxIDUzLjA3MjggNzkuMzQ4NiA1My40NzgxIDc5LjM0ODYgNTMuOTI5MkM3OS4zNDg2IDU0LjM4MDIgNzkuNDEwMSA1NC43ODU2IDc5LjUzMzEgNTUuMTQxOEM3OS42NTYgNTUuNTAxNCA3OS44Mjc1IDU1LjgwMjEgODAuMDUzOSA1Ni4wNTA1QzgwLjI4MDQgNTYuMjk4OSA4MC41NTIyIDU2LjQ4ODUgODAuODY5MiA1Ni42MTkzQzgxLjE4NjMgNTYuNzUgODEuNTQyMiA1Ni44MTU0IDgxLjkzMDQgNTYuODE1NEM4Mi4zMTg2IDU2LjgxNTQgODIuNjc3OCA1Ni43NSA4Mi45OTgxIDU2LjYxOTNDODMuMzE1MSA1Ni40ODg1IDgzLjU4NjkgNTYuMjk4OSA4My44MTAxIDU2LjA1MDVDODQuMDMzMyA1NS44MDIxIDg0LjIwNDggNTUuNTAxNCA4NC4zMjc4IDU1LjE0MThDODQuNDUwNyA1NC43ODU2IDg0LjUxMjIgNTQuMzgwMiA4NC41MTIyIDUzLjkyOTJaTTg1LjUyMTYgNTMuOTI5MkM4NS41MjE2IDU0LjQ3ODMgODUuNDM0MiA1NC45ODQ5IDg1LjI2MjggNTUuNDQ1OEM4NS4wOTEzIDU1LjkwNjcgODQuODQ1NCA1Ni4zMDIyIDg0LjUzMTYgNTYuNjMyM0M4NC4yMTc4IDU2Ljk2NTcgODMuODM5MiA1Ny4yMjA3IDgzLjM5NiA1Ny40MDM3QzgyLjk1MjggNTcuNTg2OCA4Mi40NjQyIDU3LjY3ODMgODEuOTMwNCA1Ny42NzgzQzgxLjM5NjYgNTcuNjc4MyA4MC45MDgxIDU3LjU4NjggODAuNDY4MSA1Ny40MDM3QzgwLjAyODEgNTcuMjIwNyA3OS42NDk1IDU2Ljk2MjUgNzkuMzM1NyA1Ni42MzIzQzc5LjAyMTkgNTYuMzAyMiA3OC43NzYgNTUuOTAzNCA3OC42MDQ1IDU1LjQ0NThDNzguNDMzMSA1NC45ODQ5IDc4LjM0NTcgNTQuNDc4MyA3OC4zNDU3IDUzLjkyOTJDNzguMzQ1NyA1My4zOCA3OC40MzMxIDUyLjg3MzQgNzguNjA0NSA1Mi40MTI1Qzc4Ljc3NiA1MS45NTE3IDc5LjAyMTkgNTEuNTU2MiA3OS4zMzU3IDUxLjIyMjhDNzkuNjQ5NSA1MC44ODk0IDgwLjAyODEgNTAuNjMxMSA4MC40NjgxIDUwLjQ0NDhDODAuOTA4MSA1MC4yNTg1IDgxLjM5NjYgNTAuMTY3IDgxLjkzMDQgNTAuMTY3QzgyLjQ2NDIgNTAuMTY3IDgyLjk1MjggNTAuMjU4NSA4My4zOTYgNTAuNDQ0OEM4My44MzkyIDUwLjYzMTEgODQuMjE3OCA1MC44ODk0IDg0LjUzMTYgNTEuMjIyOEM4NC44NDU0IDUxLjU1NjIgODUuMDkxMyA1MS45NTQ5IDg1LjI2MjggNTIuNDEyNUM4NS40MzQyIDUyLjg3MzQgODUuNTIxNiA1My4zOCA4NS41MjE2IDUzLjkyOTJaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik05OS41NDM3IDU2LjgxMjRDOTkuODQ0NSA1Ni44MTI0IDEwMC4xMTMgNTYuNzYwMSAxMDAuMzUyIDU2LjY1ODhDMTAwLjU4OSA1Ni41NTc1IDEwMC43ODkgNTYuNDEzNiAxMDAuOTU0IDU2LjIyNzNDMTAxLjExOSA1Ni4wNDEgMTAxLjI0NSA1NS44MjIgMTAxLjMzIDU1LjU2NzFDMTAxLjQxNyA1NS4zMDg5IDEwMS40NTkgNTUuMDI3OCAxMDEuNDU5IDU0LjcyMDVWNTAuMjQ5SDEwMi40MzlWNTQuNzIwNUMxMDIuNDM5IDU1LjE0NTQgMTAyLjM3MSA1NS41Mzc3IDEwMi4yMzkgNTUuOTAwNUMxMDIuMTA2IDU2LjI2MzMgMTAxLjkxNSA1Ni41NzcxIDEwMS42NjYgNTYuODQxOEMxMDEuNDE3IDU3LjEwNjYgMTAxLjExMyA1Ny4zMTU4IDEwMC43NTQgNTcuNDY2MUMxMDAuMzk1IDU3LjYxNjUgOTkuOTkzNCA1Ny42OTE3IDk5LjU0MzcgNTcuNjkxN0M5OS4wOTQgNTcuNjkxNyA5OC42OTI4IDU3LjYxNjUgOTguMzMzNyA1Ny40NjYxQzk3Ljk3NDUgNTcuMzE1OCA5Ny42NzA0IDU3LjEwNjYgOTcuNDE4MSA1Ni44NDE4Qzk3LjE2OSA1Ni41NzcxIDk2Ljk3NDggNTYuMjYzMyA5Ni44NDIyIDU1LjkwMDVDOTYuNzA5NSA1NS41Mzc3IDk2LjY0MTYgNTUuMTQ1NCA5Ni42NDE2IDU0LjcyMDVWNTAuMjQ5SDk3LjYyMTlWNTQuNzE0Qzk3LjYyMTkgNTUuMDIxMiA5Ny42NjQgNTUuMzA1NiA5Ny43NTEzIDU1LjU2MDVDOTcuODM4NyA1NS44MTg4IDk3Ljk2MTYgNTYuMDM3OCA5OC4xMjY2IDU2LjIyNDFDOTguMjkxNiA1Ni40MTA0IDk4LjQ5MjIgNTYuNTU0MiA5OC43MzE2IDU2LjY1ODhDOTguOTcxIDU2Ljc2MzQgOTkuMjM5NSA1Ni44MTU3IDk5LjU0MDQgNTYuODE1NyIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMTE5LjkxMyA1MC4yNDlWNTcuNjAzNEgxMTkuNDIxQzExOS4zNDMgNTcuNjAzNCAxMTkuMjc4IDU3LjU5MDQgMTE5LjIyMyA1Ny41NjA5QzExOS4xNzIgNTcuNTM0OCAxMTkuMTIgNTcuNDg5IDExOS4wNjggNTcuNDIzNkwxMTQuODU2IDUxLjg4MDFDMTE0Ljg2MiA1MS45NjUxIDExNC44NjkgNTIuMDUgMTE0Ljg3MiA1Mi4xMzE4QzExNC44NzUgNTIuMjEzNSAxMTQuODc4IDUyLjI5MTkgMTE0Ljg3OCA1Mi4zNjM4VjU3LjYwMzRIMTE0LjAxNVY1MC4yNDlIMTE0LjUyM0MxMTQuNTY4IDUwLjI0OSAxMTQuNjAzIDUwLjI0OSAxMTQuNjM2IDUwLjI1NTZDMTE0LjY2NSA1MC4yNjIxIDExNC42OTQgNTAuMjY4NiAxMTQuNzE3IDUwLjI4MTdDMTE0LjczOSA1MC4yOTQ4IDExNC43NjUgNTAuMzExMSAxMTQuNzg4IDUwLjMzNEMxMTQuODExIDUwLjM1NjkgMTE0LjgzNiA1MC4zODMgMTE0Ljg2NiA1MC40MTlMMTE5LjA3NSA1NS45NTZDMTE5LjA2OCA1NS44Njc4IDExOS4wNjIgNTUuNzc5NSAxMTkuMDU4IDU1LjY5NzhDMTE5LjA1MiA1NS42MTI4IDExOS4wNTIgNTUuNTM0NCAxMTkuMDUyIDU1LjQ1OTJWNTAuMjQ5SDExOS45MTZIMTE5LjkxM1oiIGZpbGw9IndoaXRlIj48L3BhdGg+PHBhdGggZD0iTTEzNy4yNiA1My45MjkyQzEzNy4yNiA1My40NzgxIDEzNy4xOTkgNTMuMDcyOCAxMzcuMDc5IDUyLjcxOThDMTM2Ljk1NiA1Mi4zNjM1IDEzNi43ODQgNTIuMDYyOCAxMzYuNTYxIDUxLjgxNzZDMTM2LjMzOCA1MS41NzI1IDEzNi4wNjYgNTEuMzgyOSAxMzUuNzQ5IDUxLjI1MjJDMTM1LjQzMiA1MS4xMjE0IDEzNS4wNzYgNTEuMDU2IDEzNC42ODIgNTEuMDU2SDEzMi45NTFWNTYuNzk5SDEzNC42ODJDMTM1LjA3NiA1Ni43OTkgMTM1LjQyOSA1Ni43MzM2IDEzNS43NDkgNTYuNjAyOUMxMzYuMDY2IDU2LjQ3MjEgMTM2LjMzOCA1Ni4yODU4IDEzNi41NjEgNTYuMDQwN0MxMzYuNzg0IDU1Ljc5NTUgMTM2Ljk1NiA1NS40OTQ4IDEzNy4wNzkgNTUuMTM4NUMxMzcuMjAyIDU0Ljc4MjMgMTM3LjI2IDU0LjM4MDIgMTM3LjI2IDUzLjkyOTJaTTEzOC4yNzMgNTMuOTI5MkMxMzguMjczIDU0LjQ3ODMgMTM4LjE4NSA1NC45ODE2IDEzOC4wMTQgNTUuNDMyN0MxMzcuODQyIDU1Ljg4MzggMTM3LjU5NyA1Ni4yNzI4IDEzNy4yODMgNTYuNTkzMUMxMzYuOTY5IDU2LjkxMzQgMTM2LjU5IDU3LjE2NTEgMTM2LjE0NyA1Ny4zNDE2QzEzNS43MDQgNTcuNTE4MSAxMzUuMjE1IDU3LjYwNjQgMTM0LjY4MiA1Ny42MDY0SDEzMS45NjRWNTAuMjUySDEzNC42ODJDMTM1LjIxNSA1MC4yNTIgMTM1LjcwNCA1MC4zNDAyIDEzNi4xNDcgNTAuNTE2N0MxMzYuNTkgNTAuNjkzMiAxMzYuOTY2IDUwLjk0MTYgMTM3LjI4MyA1MS4yNjUyQzEzNy41OTcgNTEuNTg4OCAxMzcuODQyIDUxLjk3NzggMTM4LjAxNCA1Mi40Mjg5QzEzOC4xODUgNTIuODc5OSAxMzguMjczIDUzLjM4MzMgMTM4LjI3MyA1My45MzI0IiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNTMuNjE4IDU0Ljg3MDlMMTUyLjQ3NiA1MS44ODAxQzE1Mi40NDQgNTEuNzkxOCAxNTIuNDA4IDUxLjY4NzIgMTUyLjM3IDUxLjU2OTVDMTUyLjMzNCA1MS40NTE5IDE1Mi4yOTggNTEuMzI3NyAxNTIuMjYzIDUxLjE5MzdDMTUyLjE5MiA1MS40NzE1IDE1Mi4xMjEgNTEuNzAwMyAxNTIuMDQzIDUxLjg4NjZMMTUwLjkwMSA1NC44NzQxSDE1My42MThWNTQuODcwOVpNMTU1LjY3IDU3LjYwMzRIMTU0LjkwNkMxNTQuODE5IDU3LjYwMzQgMTU0Ljc0OCA1Ny41ODA1IDE1NC42OTMgNTcuNTM4MUMxNTQuNjM4IDU3LjQ5NTYgMTU0LjU5OSA1Ny40MzY3IDE1NC41NyA1Ny4zNjgxTDE1My44OSA1NS41OTMySDE1MC42MjNMMTQ5Ljk0MyA1Ny4zNjgxQzE0OS45MjQgNTcuNDMwMiAxNDkuODg1IDU3LjQ4NTggMTQ5LjgyNyA1Ny41MzE1QzE0OS43NjggNTcuNTgwNSAxNDkuNjk3IDU3LjYwMzQgMTQ5LjYxMyA1Ny42MDM0SDE0OC44NUwxNTEuNzYxIDUwLjI0OUgxNTIuNzU4TDE1NS42NyA1Ny42MDM0WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMTcxLjA5OSA1MS4wODQ4SDE2OC43NDNWNTcuNjAyNEgxNjcuNzYzVjUxLjA4NDhIMTY1LjQwMVY1MC4yNDhIMTcxLjA5OVY1MS4wODQ4WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMTgzLjg1OSA1MC4yNDhIMTgyLjg3MlY1Ny42MDI0SDE4My44NTlWNTAuMjQ4WiIgZmlsbD0id2hpdGUiPjwvcGF0aD48cGF0aCBkPSJNMjAxLjIzNSA1My45MjkyQzIwMS4yMzUgNTMuNDc4MSAyMDEuMTczIDUzLjA3MjggMjAxLjA1IDUyLjcxMzNDMjAwLjkyNyA1Mi4zNTM3IDIwMC43NTYgNTIuMDQ5NyAyMDAuNTMzIDUxLjgwMTNDMjAwLjMxIDUxLjU1MjkgMjAwLjAzOCA1MS4zNjMzIDE5OS43MjEgNTEuMjI5M0MxOTkuNDA0IDUxLjA5NTMgMTk5LjA0OCA1MS4wMjk5IDE5OC42NTMgNTEuMDI5OUMxOTguMjU4IDUxLjAyOTkgMTk3LjkwOSA1MS4wOTUzIDE5Ny41OTIgNTEuMjI5M0MxOTcuMjc1IDUxLjM2MzMgMTk3LjAwMyA1MS41NTI5IDE5Ni43NzcgNTEuODAxM0MxOTYuNTUgNTIuMDQ5NyAxOTYuMzc5IDUyLjM1MzcgMTk2LjI1NiA1Mi43MTMzQzE5Ni4xMzMgNTMuMDcyOCAxOTYuMDcxIDUzLjQ3ODEgMTk2LjA3MSA1My45MjkyQzE5Ni4wNzEgNTQuMzgwMiAxOTYuMTMzIDU0Ljc4NTYgMTk2LjI1NiA1NS4xNDE4QzE5Ni4zNzkgNTUuNTAxNCAxOTYuNTUgNTUuODAyMSAxOTYuNzc3IDU2LjA1MDVDMTk3LjAwMyA1Ni4yOTg5IDE5Ny4yNzUgNTYuNDg4NSAxOTcuNTkyIDU2LjYxOTNDMTk3LjkwOSA1Ni43NSAxOTguMjY1IDU2LjgxNTQgMTk4LjY1MyA1Ni44MTU0QzE5OS4wNDEgNTYuODE1NCAxOTkuNCA1Ni43NSAxOTkuNzIxIDU2LjYxOTNDMjAwLjAzOCA1Ni40ODg1IDIwMC4zMSA1Ni4yOTg5IDIwMC41MzMgNTYuMDUwNUMyMDAuNzU2IDU1LjgwMjEgMjAwLjkyNyA1NS41MDE0IDIwMS4wNSA1NS4xNDE4QzIwMS4xNzMgNTQuNzg1NiAyMDEuMjM1IDU0LjM4MDIgMjAxLjIzNSA1My45MjkyWk0yMDIuMjQ0IDUzLjkyOTJDMjAyLjI0NCA1NC40NzgzIDIwMi4xNTcgNTQuOTg0OSAyMDEuOTg1IDU1LjQ0NThDMjAxLjgxNCA1NS45MDY3IDIwMS41NjggNTYuMzAyMiAyMDEuMjU0IDU2LjYzMjNDMjAwLjk0IDU2Ljk2NTcgMjAwLjU2MiA1Ny4yMjA3IDIwMC4xMTkgNTcuNDAzN0MxOTkuNjc5IDU3LjU4NjggMTk5LjE4NyA1Ny42NzgzIDE5OC42NTMgNTcuNjc4M0MxOTguMTE5IDU3LjY3ODMgMTk3LjYzMSA1Ny41ODY4IDE5Ny4xOTEgNTcuNDAzN0MxOTYuNzUxIDU3LjIyMDcgMTk2LjM3MiA1Ni45NjI1IDE5Ni4wNTggNTYuNjMyM0MxOTUuNzQ1IDU2LjMwMjIgMTk1LjQ5OSA1NS45MDM0IDE5NS4zMjcgNTUuNDQ1OEMxOTUuMTU2IDU0Ljk4NDkgMTk1LjA2OCA1NC40NzgzIDE5NS4wNjggNTMuOTI5MkMxOTUuMDY4IDUzLjM4IDE5NS4xNTYgNTIuODczNCAxOTUuMzI3IDUyLjQxMjVDMTk1LjQ5OSA1MS45NTE3IDE5NS43NDUgNTEuNTU2MiAxOTYuMDU4IDUxLjIyMjhDMTk2LjM3MiA1MC44ODk0IDE5Ni43NTEgNTAuNjMxMSAxOTcuMTkxIDUwLjQ0NDhDMTk3LjYzMSA1MC4yNTg1IDE5OC4xMTkgNTAuMTY3IDE5OC42NTMgNTAuMTY3QzE5OS4xODcgNTAuMTY3IDE5OS42NzUgNTAuMjU4NSAyMDAuMTE5IDUwLjQ0NDhDMjAwLjU2MiA1MC42MzExIDIwMC45NCA1MC44ODk0IDIwMS4yNTQgNTEuMjIyOEMyMDEuNTY4IDUxLjU1NjIgMjAxLjgxNCA1MS45NTQ5IDIwMS45ODUgNTIuNDEyNUMyMDIuMTU3IDUyLjg3MzQgMjAyLjI0NCA1My4zOCAyMDIuMjQ0IDUzLjkyOTJaIiBmaWxsPSJ3aGl0ZSI+PC9wYXRoPjxwYXRoIGQ9Ik0yMTkuMzU2IDUwLjI0OVY1Ny42MDM0SDIxOC44NjRDMjE4Ljc4NiA1Ny42MDM0IDIxOC43MjIgNTcuNTkwNCAyMTguNjcgNTcuNTYwOUMyMTguNjE4IDU3LjUzNDggMjE4LjU2NiA1Ny40ODkgMjE4LjUxNCA1Ny40MjM2TDIxNC4zMDIgNTEuODgwMUMyMTQuMzA5IDUxLjk2NTEgMjE0LjMxNSA1Mi4wNSAyMTQuMzE4IDUyLjEzMThDMjE0LjMyMiA1Mi4yMTM1IDIxNC4zMjUgNTIuMjkxOSAyMTQuMzI1IDUyLjM2MzhWNTcuNjAzNEgyMTMuNDYxVjUwLjI0OUgyMTMuOTY5QzIxNC4wMTQgNTAuMjQ5IDIxNC4wNSA1MC4yNDkgMjE0LjA4MiA1MC4yNTU2QzIxNC4xMTEgNTAuMjYyMSAyMTQuMTQgNTAuMjY4NiAyMTQuMTYzIDUwLjI4MTdDMjE0LjE4NiA1MC4yOTQ4IDIxNC4yMTIgNTAuMzExMSAyMTQuMjM0IDUwLjMzNEMyMTQuMjU3IDUwLjM1NjkgMjE0LjI4MyA1MC4zODMgMjE0LjMwOSA1MC40MTlMMjE4LjUyMSA1NS45NTZDMjE4LjUxNCA1NS44Njc4IDIxOC41MDggNTUuNzc5NSAyMTguNTA1IDU1LjY5NzhDMjE4LjQ5OCA1NS42MTI4IDIxOC40OTUgNTUuNTM0NCAyMTguNDk1IDU1LjQ1OTJWNTAuMjQ5SDIxOS4zNTlIMjE5LjM1NloiIGZpbGw9IndoaXRlIj48L3BhdGg+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDBfNV82Ij48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjY2IiBmaWxsPSJ3aGl0ZSI+PC9yZWN0PjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==\"><tr><td class=wrapper>{CONTENT}</table><div class=footer><table border=0 cellpadding=0 cellspacing=0 role=presentation><tr><td class=content-block><span class=apple-link>Wildlife Aid Foundation © 2025, Registered Charity No. 1138944, Randalls Farm House, Randalls Rd, Leatherhead KT22 0AL</span></table></div></div><td> </table>";
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
