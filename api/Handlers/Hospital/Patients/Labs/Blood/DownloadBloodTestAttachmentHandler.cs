using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Labs.Blood;

public class DownloadBloodTestAttachment : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int BloodTestId { get; set; }
    public int AttachmentId { get; set; }
}

public class DownloadBloodTestAttachmentHandler : IRequestHandler<DownloadBloodTestAttachment, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DownloadBloodTestAttachmentHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DownloadBloodTestAttachment request, CancellationToken cancellationToken)
    {
        var attachment = await _repository.Get<PatientBloodTestAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.PatientBloodTest).ThenInclude(y => y.Patient));
        if (attachment == null) return Results.BadRequest();
        if (attachment.PatientBloodTest.Id != request.BloodTestId) return Results.BadRequest();
        if (attachment.PatientBloodTest.Patient.Id != request.PatientId) return Results.BadRequest();

        return Results.File(
            attachment.Data,
            attachment.ContentType,
            attachment.FileName
        );
    }
}
