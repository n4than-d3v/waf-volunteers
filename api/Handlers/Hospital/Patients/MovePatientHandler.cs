using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients;

public class MovePatient : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int PenId { get; set; }

    public MovePatient WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MovePatientHandler : IRequestHandler<MovePatient, IResult>
{
    private readonly IDatabaseRepository _repository;

    public MovePatientHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(MovePatient request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var pen = await _repository.Get<Pen>(request.PenId);
        if (pen == null) return Results.BadRequest();

        if (patient.Pen != null)
        {
            var movement = new PatientMovement
            {
                Patient = patient,
                From = patient.Pen,
                To = pen,
                Moved = DateTime.UtcNow
            };

            _repository.Create(movement);
        }

        patient.Pen = pen;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
