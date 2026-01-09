using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients;

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

    public AddPatientNoteHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
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
        try
        {
            if (request.Files != null && request.Files.Count > 0)
            {
                foreach (var file in request.Files)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms, cancellationToken);

                    var noteFile = new PatientNoteAttachment
                    {
                        PatientNote = note,
                        FileName = file.FileName,
                        ContentType = file.ContentType,
                        Data = ms.ToArray()
                    };

                    _repository.Create(note);
                }

                await _repository.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            return Results.BadRequest(e.ToString());
        }
        return Results.Created();
    }
}
