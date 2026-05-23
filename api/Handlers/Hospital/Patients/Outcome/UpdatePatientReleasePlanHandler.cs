using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class UpdatePatientReleasePlan : IRequest<IResult>
{
    public int PatientId { get; set; }

    public DateTime? PlannedRelease { get; set; }
    public string? PlannedReleaseNotes { get; set; }

    public UpdatePatientReleasePlan WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class UpdatePatientReleasePlanHandler : IRequestHandler<UpdatePatientReleasePlan, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdatePatientReleasePlanHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdatePatientReleasePlan request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        patient.LastUpdatedDetails = DateTime.UtcNow;
        patient.PlannedReleaseLastUpdated = DateTime.UtcNow;
        patient.PlannedRelease = request.PlannedRelease;
        patient.PlannedReleaseNotes = request.PlannedReleaseNotes;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
