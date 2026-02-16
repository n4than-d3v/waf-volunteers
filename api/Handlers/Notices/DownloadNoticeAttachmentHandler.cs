using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Handlers.Notices;

public class DownloadNoticeAttachment : IRequest<IResult>
{
    public int NoticeId { get; set; }
    public int AttachmentId { get; set; }
}

public class DownloadNoticeAttachmentHandler : IRequestHandler<DownloadNoticeAttachment, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly string _rootDirectory;

    public DownloadNoticeAttachmentHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(DownloadNoticeAttachment request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId, tracking: false);
        if (notice == null) return Results.BadRequest();

        var attachment = await _repository.Get<NoticeAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.Notice));
        if (attachment == null) return Results.BadRequest();
        if (attachment.Notice.Id != notice.Id) return Results.BadRequest();

        var filePath = Path.Combine(_rootDirectory, "notices", notice.Id.ToString(), attachment.FileName);
        if (!File.Exists(filePath)) return Results.NotFound();

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

        return Results.File(
            stream,
            attachment.ContentType,
            attachment.FileName,
            enableRangeProcessing: true
        );
    }
}
