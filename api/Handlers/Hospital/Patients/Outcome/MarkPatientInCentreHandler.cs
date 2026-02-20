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

    public MarkPatientInCentreHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(MarkPatientInCentre request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        patient.LastUpdatedDetails = DateTime.UtcNow;
        patient.Status = PatientStatus.Inpatient;
        patient.Disposition = null;
        patient.Dispositioner = null;
        patient.Dispositioned = null;
        patient.DispositionReasons?.Clear();

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
