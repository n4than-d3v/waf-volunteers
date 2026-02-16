using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Handlers.Hospital.Admission;

public class ExportAttachmentsToDisk : IRequest<IResult>
{
}

public class ExportAttachmentsToDiskHandler : IRequestHandler<ExportAttachmentsToDisk, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly string _rootDirectory;

    public ExportAttachmentsToDiskHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(ExportAttachmentsToDisk request, CancellationToken cancellationToken)
    {
        // Process PatientNoteAttachment
        var patientNoteAttachments = await _repository.GetAll<PatientNoteAttachment>(x => true, tracking: true, action: x => x.Include(y => y.PatientNote));
        foreach (var attachment in patientNoteAttachments)
        {
            if (attachment.Data == null || attachment.Data.Length == 0) continue;

            var folder = Path.Combine(_rootDirectory, "patientNotes", attachment.PatientNote.Id.ToString());
            Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, attachment.FileName);
            await File.WriteAllBytesAsync(filePath, attachment.Data, cancellationToken);

            attachment.Data = new byte[0];
        }

        // Process NoticeAttachment
        var noticeAttachments = await _repository.GetAll<NoticeAttachment>(x => true, tracking: true, action: x => x.Include(y => y.Notice));
        foreach (var attachment in noticeAttachments)
        {
            if (attachment.Data == null || attachment.Data.Length == 0) continue;

            var folder = Path.Combine(_rootDirectory, "notices", attachment.Notice.Id.ToString());
            Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, attachment.FileName);
            await File.WriteAllBytesAsync(filePath, attachment.Data, cancellationToken);

            attachment.Data = new byte[0];
        }

        // Process PatientBloodTestAttachment
        var bloodTestAttachments = await _repository.GetAll<PatientBloodTestAttachment>(x => true, tracking: true, action: x => x.Include(y => y.PatientBloodTest));
        foreach (var attachment in bloodTestAttachments)
        {
            if (attachment.Data == null || attachment.Data.Length == 0) continue;

            var folder = Path.Combine(_rootDirectory, "patientBloodTests", attachment.PatientBloodTest.Id.ToString());
            Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, attachment.FileName);
            await File.WriteAllBytesAsync(filePath, attachment.Data, cancellationToken);

            attachment.Data = new byte[0];
        }

        // Save all metadata updates in DB
        await _repository.SaveChangesAsync();

        return Results.Ok("Attachments exported to disk successfully.");
    }
}
