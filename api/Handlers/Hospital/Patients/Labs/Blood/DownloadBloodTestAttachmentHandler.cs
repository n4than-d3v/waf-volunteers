using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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
    private readonly string _rootDirectory;

    public DownloadBloodTestAttachmentHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(DownloadBloodTestAttachment request, CancellationToken cancellationToken)
    {
        var attachment = await _repository.Get<PatientBloodTestAttachment>(request.AttachmentId, tracking: false,
            action: x => x.Include(y => y.PatientBloodTest).ThenInclude(y => y.Patient));
        if (attachment == null) return Results.BadRequest();
        if (attachment.PatientBloodTest.Id != request.BloodTestId) return Results.BadRequest();
        if (attachment.PatientBloodTest.Patient.Id != request.PatientId) return Results.BadRequest();

        var filePath = Path.Combine(_rootDirectory, "patientBloodTests", attachment.PatientBloodTest.Id.ToString(), attachment.FileName);
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
