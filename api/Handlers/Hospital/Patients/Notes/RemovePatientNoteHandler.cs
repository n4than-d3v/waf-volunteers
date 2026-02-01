using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Notes;

public class RemovePatientNote : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemovePatientNoteHandler : IRequestHandler<RemovePatientNote, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemovePatientNoteHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemovePatientNote request, CancellationToken cancellationToken)
    {
        var note = await _repository.Get<PatientNote>(request.Id);
        if (note == null) return Results.BadRequest();

        _repository.Delete(note);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
