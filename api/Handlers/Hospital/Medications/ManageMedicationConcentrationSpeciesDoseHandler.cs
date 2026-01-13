using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class ManageMedicationConcentrationSpeciesDose : IRequest<IResult>
{
    public int? Id { get; set; }
    public bool? Delete { get; set; }

    public int MedicationConcentrationId { get; set; }
    public int? SpeciesId { get; set; }
    // or
    public SpeciesType? SpeciesType { get; set; }

    public double DoseMgKgRangeStart { get; set; }
    public double DoseMgKgRangeEnd { get; set; }
    public double DoseMlKgRangeStart { get; set; }
    public double DoseMlKgRangeEnd { get; set; }
    public int? AdministrationMethodId { get; set; }
    public string? Frequency { get; set; }
    public string Notes { get; set; }
}

public class ManageMedicationConcentrationSpeciesDoseHandler : IRequestHandler<ManageMedicationConcentrationSpeciesDose, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ManageMedicationConcentrationSpeciesDoseHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ManageMedicationConcentrationSpeciesDose request, CancellationToken cancellationToken)
    {
        AdministrationMethod? administrationMethod = null;
        if (request.AdministrationMethodId != null)
        {
            administrationMethod = await _repository.Get<AdministrationMethod>(request.AdministrationMethodId.Value);
            if (administrationMethod == null) return Results.BadRequest();
        }

        Species? species = null;
        if (request.SpeciesId != null)
        {
            species = await _repository.Get<Species>(request.SpeciesId.Value);
            if (species == null) return Results.BadRequest();
        }

        if (request.Id == null)
        {
            var medicationConcentration = await _repository.Get<MedicationConcentration>(request.MedicationConcentrationId);
            if (medicationConcentration == null) return Results.BadRequest();

            var medicationConcentrationSpeciesDose = new MedicationConcentrationSpeciesDose
            {
                MedicationConcentration = medicationConcentration,
                AdministrationMethod = administrationMethod,
                DoseMgKgRangeStart = request.DoseMgKgRangeStart,
                DoseMgKgRangeEnd = request.DoseMgKgRangeEnd,
                DoseMlKgRangeStart = request.DoseMlKgRangeStart,
                DoseMlKgRangeEnd = request.DoseMlKgRangeEnd,
                Frequency = request.Frequency,
                Notes = request.Notes,
                Species = species,
                SpeciesType = request.SpeciesType
            };

            _repository.Create(medicationConcentrationSpeciesDose);
        }
        else
        {
            var medicationConcentrationSpeciesDose = await _repository.Get<MedicationConcentrationSpeciesDose>(request.Id.Value);
            if (medicationConcentrationSpeciesDose == null) return Results.BadRequest();

            if (request.Delete ?? false)
            {
                _repository.Delete(medicationConcentrationSpeciesDose);
            }
            else
            {
                medicationConcentrationSpeciesDose.AdministrationMethod = administrationMethod;
                medicationConcentrationSpeciesDose.DoseMgKgRangeStart = request.DoseMgKgRangeStart;
                medicationConcentrationSpeciesDose.DoseMgKgRangeEnd = request.DoseMgKgRangeEnd;
                medicationConcentrationSpeciesDose.DoseMlKgRangeStart = request.DoseMlKgRangeStart;
                medicationConcentrationSpeciesDose.DoseMlKgRangeEnd = request.DoseMlKgRangeEnd;
                medicationConcentrationSpeciesDose.Frequency = request.Frequency;
                medicationConcentrationSpeciesDose.Notes = request.Notes;
                medicationConcentrationSpeciesDose.Species = species;
                medicationConcentrationSpeciesDose.SpeciesType = request.SpeciesType;
            }
        }

        await _repository.SaveChangesAsync();
        return Results.Accepted();
    }
}
