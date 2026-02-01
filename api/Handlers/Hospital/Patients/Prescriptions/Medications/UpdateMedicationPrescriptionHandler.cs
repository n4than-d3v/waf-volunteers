using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Database.Entities.Hospital.Patients.Medications;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Medications;

public class UpdateMedicationPrescription : IRequest<IResult>
{
    public int Id { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public int MedicationId { get; set; }
    public int MedicationConcentrationId { get; set; }
    public int AdministrationMethodId { get; set; }
    public string Comments { get; set; }
    public string Frequency { get; set; }

    public UpdateMedicationPrescription WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateMedicationPrescriptionHandler : IRequestHandler<UpdateMedicationPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateMedicationPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateMedicationPrescription request, CancellationToken cancellationToken)
    {
        var prescription = await _repository.Get<PatientPrescriptionMedication>(request.Id, tracking: true,
            action: x => x
                .Include(y => y.Medication)
                .Include(y => y.MedicationConcentration)
                .Include(y => y.AdministrationMethod));
        if (prescription == null) return Results.BadRequest();

        var medication = await _repository.Get<Medication>(request.MedicationId);
        if (medication == null) return Results.BadRequest();

        var medicationConcentration = await _repository.Get<MedicationConcentration>(request.MedicationConcentrationId);
        if (medicationConcentration == null) return Results.BadRequest();

        var administrationMethod = await _repository.Get<AdministrationMethod>(request.AdministrationMethodId);
        if (administrationMethod == null) return Results.BadRequest();

        prescription.Start = request.Start;
        prescription.End = request.End;
        prescription.Medication = medication;
        prescription.MedicationConcentration = medicationConcentration;
        prescription.AdministrationMethod = administrationMethod;
        prescription.QuantityValue = request.QuantityValue;
        prescription.QuantityUnit = request.QuantityUnit;
        prescription.Comments = request.Comments;
        prescription.Frequency = request.Frequency;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
