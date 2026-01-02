using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;

namespace Api.Handlers.Hospital.PatientTypes;

public class UpsertSpeciesAge : IRequest<IResult>
{
    public int? Id { get; set; }
    public int SpeciesId { get; set; }
    public string Name { get; set; }
    public int AssociatedVariantId { get; set; }
}

public class UpsertSpeciesAgeHandler : IRequestHandler<UpsertSpeciesAge, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertSpeciesAgeHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertSpeciesAge request, CancellationToken cancellationToken)
    {
        var species = await _repository.Get<Species>(request.SpeciesId);
        if (species == null) return Results.BadRequest();

        var speciesVariant = await _repository.Get<SpeciesVariant>(request.AssociatedVariantId);
        if (speciesVariant == null) return Results.BadRequest();

        SpeciesAge speciesAge;
        if (request.Id != null)
        {
            speciesAge = await _repository.Get<SpeciesAge>(request.Id.Value);
            if (speciesAge == null) return Results.BadRequest();

            speciesAge.Name = request.Name;
            speciesAge.Species = species;
            speciesAge.AssociatedVariant = speciesVariant;
        }
        else
        {
            speciesAge = new SpeciesAge
            {
                Name = request.Name,
                Species = species,
                AssociatedVariant = speciesVariant
            };
            _repository.Create(speciesAge);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
