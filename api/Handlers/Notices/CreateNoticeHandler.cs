using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Notices;

public class CreateNotice : IRequest<IResult>
{
    public string Title { get; set; }
    public string Content { get; set; }
    public AccountRoles Roles { get; set; }
    public IFormFileCollection Files { get; set; }
}

public class CreateNoticeHandler : IRequestHandler<CreateNotice, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;
    private readonly string _rootDirectory;

    public CreateNoticeHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(CreateNotice request, CancellationToken cancellationToken)
    {
        var notice = new Notice(request.Title, request.Content, request.Roles);
        _repository.Create(notice);
        await _repository.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            var folder = Path.Combine(_rootDirectory, "notices", notice.Id.ToString());
            Directory.CreateDirectory(folder);

            foreach (var file in request.Files)
            {
                var filePath = Path.Combine(folder, file.FileName);
                await using var outStream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(outStream, cancellationToken);

                var noticeFile = new NoticeAttachment
                {
                    Notice = notice,
                    FileName = file.FileName,
                    ContentType = file.ContentType
                };

                _repository.Create(noticeFile);
            }

            await _repository.SaveChangesAsync();
        }

        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);
        foreach (var account in accounts)
        {
            if (!notice.ShouldShow(account)) continue;

            try
            {
                var json = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
                if (string.IsNullOrWhiteSpace(json)) continue;

                var subscription = JsonConvert.DeserializeObject<PushSubscription>(json);
                if (subscription == null) continue;

                await _pushService.Send(subscription!, new PushNotification
                {
                    Title = "Notice",
                    Body = request.Title
                }, account.Id);
            }
            catch
            {
            }
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
