using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Handlers.Hospital.Patients.Notes;
using MediatR;

namespace Api.Handlers.Hospital.Patients;

public class UpdatePatientBasicDetails : IRequest<IResult>
{
    public int PatientId { get; set; }
    public string Name { get; set; }
    public string UniqueIdentifier { get; set; }
    public string Microchip { get; set; }
    public int SpeciesId { get; set; }
    public int SpeciesVariantId { get; set; }
    public Sex Sex { get; set; }
    public List<int> TagIds { get; set; }
    public List<PatientDietItem> Feeding { get; set; }

    public class PatientDietItem
    {
        public TimeOnly Time { get; set; }
        public decimal QuantityValue { get; set; }
        public string QuantityUnit { get; set; }
        public int FoodId { get; set; }
    }

    public UpdatePatientBasicDetails WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class UpdatePatientBasicDetailsHandler : IRequestHandler<UpdatePatientBasicDetails, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public UpdatePatientBasicDetailsHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(UpdatePatientBasicDetails request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId, action: x => x.IncludeBasicDetails().IncludeHusbandry());
        if (patient == null) return Results.BadRequest();

        var species = await _repository.Get<Species>(request.SpeciesId);
        if (species == null) return Results.BadRequest();

        var speciesVariant = await _repository.Get<SpeciesVariant>(request.SpeciesVariantId);
        if (speciesVariant == null) return Results.BadRequest();

        if (patient.SpeciesVariant != null && patient.SpeciesVariant.Id != request.SpeciesVariantId)
        {
            await _mediator.Send(new AddPatientNote
            {
                PatientId = request.PatientId,
                Comments = $"Age updated from {patient.SpeciesVariant.Name} to {speciesVariant.Name}"
            }, cancellationToken);
        }

        var tags = await _repository.GetAll<Tag>(x => true);
        var foods = await _repository.GetAll<Food>(x => true);

        patient.Name = request.Name;
        patient.UniqueIdentifier = request.UniqueIdentifier;
        patient.Microchip = request.Microchip;
        patient.Species = species;
        patient.SpeciesVariant = speciesVariant;
        patient.Sex = request.Sex;
        patient.LastUpdatedDetails = DateTime.UtcNow;
        patient.Tags.RemoveAll(x => !request.TagIds.Contains(x.Id));
        patient.Tags.AddRange(tags.Where(x => request.TagIds.Contains(x.Id)));

        var existingDiets = patient.Feeding.ToList();

        foreach (var existingItem in existingDiets)
        {
            if (!request.Feeding.Any(r => r.Time == existingItem.Time && r.FoodId == existingItem.Food.Id))
            {
                patient.Feeding.Remove(existingItem);
                _repository.Delete(existingItem);
            }
        }

        foreach (var item in request.Feeding)
        {
            var existingItem = existingDiets.FirstOrDefault(x => x.Time == item.Time && x.Food.Id == item.FoodId);
            if (existingItem != null)
            {
                existingItem.QuantityValue = item.QuantityValue;
                existingItem.QuantityUnit = item.QuantityUnit;
            }
            else
            {
                var food = foods.FirstOrDefault(f => f.Id == item.FoodId);
                if (food == null) return Results.BadRequest();

                var newDiet = new PatientFeeding
                {
                    Food = food,
                    Time = item.Time,
                    QuantityValue = item.QuantityValue,
                    QuantityUnit = item.QuantityUnit,
                    Patient = patient
                };

                patient.Feeding.Add(newDiet);
            }
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
