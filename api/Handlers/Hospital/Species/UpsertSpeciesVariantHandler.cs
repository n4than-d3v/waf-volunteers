using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.PatientTypes;

public class UpsertSpeciesVariant : IRequest<IResult>
{
    public int? Id { get; set; }
    public int SpeciesId { get; set; }
    public string Name { get; set; }
    public string FriendlyName { get; set; }
    public int Order { get; set; }
    public int LongTermDays { get; set; }
    public List<UpsertSpeciesVariantFood> FeedingGuidance { get; set; }

    public class UpsertSpeciesVariantFood
    {
        public TimeOnly Time { get; set; }
        public decimal QuantityValue { get; set; }
        public string QuantityUnit { get; set; }
        public int FoodId { get; set; }
    }
}

public class UpsertSpeciesVariantHandler : IRequestHandler<UpsertSpeciesVariant, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertSpeciesVariantHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertSpeciesVariant request, CancellationToken cancellationToken)
    {
        try
        {
            var species = await _repository.Get<Species>(request.SpeciesId);
            if (species == null) return Results.BadRequest();

            var foods = await _repository.GetAll<Food>(x => true);

            SpeciesVariant speciesVariant;
            if (request.Id != null)
            {
                speciesVariant = await _repository.Get<SpeciesVariant>(request.Id.Value,
                    action: x => x.Include(y => y.FeedingGuidance).ThenInclude(y => y.Food));
                if (speciesVariant == null) return Results.BadRequest();

                speciesVariant.Name = request.Name;
                speciesVariant.FriendlyName = request.FriendlyName;
                speciesVariant.Order = request.Order;
                speciesVariant.LongTermDays = request.LongTermDays;
                speciesVariant.Species = species;
                speciesVariant.FeedingGuidance ??= [];
            }
            else
            {
                speciesVariant = new SpeciesVariant
                {
                    Name = request.Name,
                    FriendlyName = request.FriendlyName,
                    Order = request.Order,
                    LongTermDays = request.LongTermDays,
                    Species = species,
                    FeedingGuidance = []
                };
                _repository.Create(speciesVariant);
            }

            var existingGuidance = speciesVariant.FeedingGuidance.ToList();

            foreach (var existingItem in existingGuidance)
            {
                if (!request.FeedingGuidance.Any(r => r.FoodId == existingItem.Food.Id))
                {
                    speciesVariant.FeedingGuidance.Remove(existingItem);
                    _repository.Delete(existingItem);
                }
            }

            foreach (var item in request.FeedingGuidance)
            {
                var existingItem = existingGuidance.FirstOrDefault(x => x.Food.Id == item.FoodId);
                if (existingItem != null)
                {
                    existingItem.Time = item.Time;
                    existingItem.QuantityValue = item.QuantityValue;
                    existingItem.QuantityUnit = item.QuantityUnit;
                }
                else
                {
                    var food = foods.FirstOrDefault(f => f.Id == item.FoodId);
                    if (food == null) return Results.BadRequest();

                    var newGuidance = new SpeciesVariantFood
                    {
                        Food = food,
                        Time = item.Time,
                        QuantityValue = item.QuantityValue,
                        QuantityUnit = item.QuantityUnit,
                        SpeciesVariant = speciesVariant
                    };

                    speciesVariant.FeedingGuidance.Add(newGuidance);
                }
            }

            await _repository.SaveChangesAsync();
            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message + " - " + ex.StackTrace);
        }
    }
}
