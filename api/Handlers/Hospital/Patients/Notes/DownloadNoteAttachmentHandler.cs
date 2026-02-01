using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using Microsoft.EntityFrameworkCore;

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

    public DownloadNoteAttachmentHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DownloadNoteAttachment request, CancellationToken cancellationToken)
    {
        var attachment = await _repository.Get<PatientNoteAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.PatientNote).ThenInclude(y => y.Patient));
        if (attachment == null) return Results.BadRequest();
        if (attachment.PatientNote.Id != request.NoteId) return Results.BadRequest();
        if (attachment.PatientNote.Patient.Id != request.PatientId) return Results.BadRequest();

        return Results.File(
            attachment.Data,
            attachment.ContentType,
            attachment.FileName
        );
    }
}
