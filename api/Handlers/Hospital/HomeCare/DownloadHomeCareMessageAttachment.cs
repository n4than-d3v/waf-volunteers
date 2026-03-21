using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Handlers.Hospital.HomeCare;

public class DownloadHomeCareMessageAttachment : IRequest<IResult>
{
    public int MessageId { get; set; }
    public int AttachmentId { get; set; }
}

public class DownloadHomeCareMessageAttachmentHandler : IRequestHandler<DownloadHomeCareMessageAttachment, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly string _rootDirectory;

    public DownloadHomeCareMessageAttachmentHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(DownloadHomeCareMessageAttachment request, CancellationToken cancellationToken)
    {
        var attachment = await _repository.Get<HomeCareMessageAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.HomeCareMessage));
        if (attachment == null) return Results.BadRequest();
        if (attachment.HomeCareMessage.Id != request.MessageId) return Results.BadRequest();

        var filePath = Path.Combine(_rootDirectory, "homeCareMessages", attachment.HomeCareMessage.Id.ToString(), attachment.FileName);
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
