using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class MarkPatientInCentre : IRequest<IResult>
{
    public int PatientId { get; set; }

    public MarkPatientInCentre WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MarkPatientInCentreHandler : IRequestHandler<MarkPatientInCentre, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public MarkPatientInCentreHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(MarkPatientInCentre request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId,
            action: x => x.IncludeBasicDetails().IncludeOutcome());
        if (patient == null) return Results.BadRequest();

        patient.LastUpdatedStatus = DateTime.UtcNow;
        patient.LastUpdatedDetails = DateTime.UtcNow;
        patient.Status = PatientStatus.Inpatient;
        patient.TransferLocation = null;
        patient.ReleaseType = null;
        patient.Disposition = null;
        patient.Dispositioner = null;
        patient.Dispositioned = null;
        patient.DispositionReasons?.Clear();

        await _repository.SaveChangesAsync();

        if (patient.Pen != null)
        {
            await _mediator.Send(new MarkPenNeedsCleaning { Id = patient.Pen.Id }, cancellationToken);
        }

        return Results.NoContent();
    }
}
