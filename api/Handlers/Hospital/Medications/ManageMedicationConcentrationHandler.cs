using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class ManageMedicationConcentration : IRequest<IResult>
{
    public int? Id { get; set; }
    public bool? Delete { get; set; }

    public int MedicationId { get; set; }
    public string Form { get; set; }
    public double ConcentrationValue { get; set; }
    public string ConcentrationUnit { get; set; }
    public string DefaultUnit { get; set; }
}

public class ManageMedicationConcentrationHandler : IRequestHandler<ManageMedicationConcentration, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ManageMedicationConcentrationHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ManageMedicationConcentration request, CancellationToken cancellationToken)
    {
        if (request.Id == null)
        {
            var medication = await _repository.Get<Medication>(request.MedicationId);
            if (medication == null) return Results.BadRequest();

            var medicationConcentration = new MedicationConcentration
            {
                Medication = medication,
                Form = request.Form,
                ConcentrationValue = request.ConcentrationValue,
                ConcentrationUnit = request.ConcentrationUnit,
                DefaultUnit = request.DefaultUnit
            };

            _repository.Create(medicationConcentration);
        }
        else
        {
            var medicationConcentration = await _repository.Get<MedicationConcentration>(request.Id.Value);
            if (medicationConcentration == null) return Results.BadRequest();

            if (request.Delete ?? false)
            {
                _repository.Delete(medicationConcentration);
            }
            else
            {
                medicationConcentration.Form = request.Form;
                medicationConcentration.ConcentrationValue = request.ConcentrationValue;
                medicationConcentration.ConcentrationUnit = request.ConcentrationUnit;
                medicationConcentration.DefaultUnit = request.DefaultUnit;
            }
        }

        await _repository.SaveChangesAsync();
        return Results.Accepted();
    }
}
