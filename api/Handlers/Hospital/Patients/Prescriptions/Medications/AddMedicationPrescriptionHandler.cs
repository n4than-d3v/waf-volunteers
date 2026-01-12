using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Database.Entities.Hospital.Patients.Medications;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Medications;

public class AddMedicationPrescription : IRequest<IResult>
{
    public int PatientId { get; set; }
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public int MedicationId { get; set; }
    public int MedicationConcentrationId { get; set; }
    public int AdministrationMethodId { get; set; }
    public string Comments { get; set; }
    public string Frequency { get; set; }

    public AddMedicationPrescription WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class AddMedicationPrescriptionHandler : IRequestHandler<AddMedicationPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddMedicationPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddMedicationPrescription request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var medication = await _repository.Get<Medication>(request.MedicationId);
        if (medication == null) return Results.BadRequest();

        var medicationConcentration = await _repository.Get<MedicationConcentration>(request.MedicationConcentrationId);
        if (medicationConcentration == null) return Results.BadRequest();

        var administrationMethod = await _repository.Get<AdministrationMethod>(request.AdministrationMethodId);
        if (administrationMethod == null) return Results.BadRequest();

        var prescription = new PatientPrescriptionMedication
        {
            Patient = patient,
            Start = request.Start,
            End = request.End,
            Medication = medication,
            MedicationConcentration = medicationConcentration,
            AdministrationMethod = administrationMethod,
            QuantityValue = request.QuantityValue,
            QuantityUnit = request.QuantityUnit,
            Comments = request.Comments,
            Frequency = request.Frequency
        };

        _repository.Create(prescription);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
