using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Medications;

public class RemoveMedicationPrescriptionAdministration : IRequest<IResult>
{
    public int AdministrationId { get; set; }
}

public class RemoveMedicationPrescriptionAdministrationHandler : IRequestHandler<RemoveMedicationPrescriptionAdministration, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveMedicationPrescriptionAdministrationHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveMedicationPrescriptionAdministration request, CancellationToken cancellationToken)
    {
        var administration = await _repository.Get<PatientPrescriptionMedicationAdministration>(request.AdministrationId);
        if (administration == null) return Results.BadRequest();

        _repository.Delete(administration);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
