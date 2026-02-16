using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Services;
using MediatR;
using Microsoft.Extensions.Options;

namespace Api.Handlers.Hospital.Patients.Notes;

public class AddPatientNote : IRequest<IResult>
{
    public int PatientId { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public string Comments { get; set; }
    public IFormFileCollection Files { get; set; }

    public AddPatientNote WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class AddPatientNoteHandler : IRequestHandler<AddPatientNote, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly string _rootDirectory;

    public AddPatientNoteHandler(IDatabaseRepository repository, IUserContext userContext, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _userContext = userContext;
        _rootDirectory = fileSettings.Value.RootDirectory;
    }

    public async Task<IResult> Handle(AddPatientNote request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var author = await _repository.Get<Account>(_userContext.Id);
        if (author == null) return Results.BadRequest();

        var note = new PatientNote
        {
            Noter = author,
            Noted = DateTime.UtcNow,
            Patient = patient,
            WeightValue = request.WeightValue,
            WeightUnit = request.WeightUnit,
            Comments = request.Comments
        };

        _repository.Create(note);
        await _repository.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            var folder = Path.Combine(_rootDirectory, "patientNotes", note.Id.ToString());
            Directory.CreateDirectory(folder);

            foreach (var file in request.Files)
            {
                var filePath = Path.Combine(folder, file.FileName);
                await using var outStream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(outStream, cancellationToken);

                var noteFile = new PatientNoteAttachment
                {
                    PatientNote = note,
                    FileName = file.FileName,
                    ContentType = file.ContentType
                };

                _repository.Create(noteFile);
            }

            await _repository.SaveChangesAsync();
        }

        return Results.Created();
    }
}
