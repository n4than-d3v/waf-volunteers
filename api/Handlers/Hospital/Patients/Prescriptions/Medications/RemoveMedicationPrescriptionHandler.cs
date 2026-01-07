using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Medications;

public class RemoveMedicationPrescription : IRequest<IResult>
{
    public int PrescriptionMedicationId { get; set; }
}

public class RemoveMedicationPrescriptionHandler : IRequestHandler<RemoveMedicationPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveMedicationPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveMedicationPrescription request, CancellationToken cancellationToken)
    {
        var prescription = await _repository.Get<PatientPrescriptionMedication>(request.PrescriptionMedicationId);
        if (prescription == null) return Results.BadRequest();

        _repository.Delete(prescription);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
