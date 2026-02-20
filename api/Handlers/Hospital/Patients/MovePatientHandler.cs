using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Locations;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class MovePatient : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int PenId { get; set; }
    public int? NewAreaId { get; set; }

    public MovePatient WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MovePatientHandler : IRequestHandler<MovePatient, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public MovePatientHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(MovePatient request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId, action: x => x.Include(y => y.Pen));
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
        patient.LastUpdatedDetails = DateTime.UtcNow;

        await _repository.SaveChangesAsync();

        if (request.NewAreaId.HasValue)
        {
            await _mediator.Send(new MovePen
            {
                Id = request.PenId,
                AreaId = request.NewAreaId.Value
            }, cancellationToken);
        }

        return Results.NoContent();
    }
}
