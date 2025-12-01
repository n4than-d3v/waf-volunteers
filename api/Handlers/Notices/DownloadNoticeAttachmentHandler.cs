using Api.Database;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices;

public class DownloadNoticeAttachment : IRequest<IResult>
{
    public int NoticeId { get; set; }
    public int AttachmentId { get; set; }
}

public class DownloadNoticeAttachmentHandler : IRequestHandler<DownloadNoticeAttachment, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DownloadNoticeAttachmentHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DownloadNoticeAttachment request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId, tracking: false);
        if (notice == null) return Results.BadRequest();

        var attachment = await _repository.Get<NoticeAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.Notice));
        if (attachment == null) return Results.BadRequest();
        if (attachment.Notice.Id != notice.Id) return Results.BadRequest();

        return Results.File(
            attachment.Data,
            attachment.ContentType,
            attachment.FileName
        );
    }
}
