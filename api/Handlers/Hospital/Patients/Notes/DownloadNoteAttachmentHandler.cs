using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Handlers.Hospital.Patients.Notes;

public class DownloadNoteAttachment : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int NoteId { get; set; }
    public int AttachmentId { get; set; }
}

public class DownloadNoteAttachmentHandler : IRequestHandler<DownloadNoteAttachment, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly string _rootDirectory;

    public DownloadNoteAttachmentHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(DownloadNoteAttachment request, CancellationToken cancellationToken)
    {
        var attachment = await _repository.Get<PatientNoteAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.PatientNote).ThenInclude(y => y.Patient));
        if (attachment == null) return Results.BadRequest();
        if (attachment.PatientNote.Id != request.NoteId) return Results.BadRequest();
        if (attachment.PatientNote.Patient.Id != request.PatientId) return Results.BadRequest();

        var filePath = Path.Combine(_rootDirectory, "patientNotes", attachment.PatientNote.Id.ToString(), attachment.FileName);
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
