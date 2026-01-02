using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;

namespace Api.Handlers.Hospital.PatientTypes;

public class UpsertSpeciesVariant : IRequest<IResult>
{
    public int? Id { get; set; }
    public int SpeciesId { get; set; }
    public string Name { get; set; }
    public string FeedingGuidance { get; set; }
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
        var species = await _repository.Get<Species>(request.SpeciesId);
        if (species == null) return Results.BadRequest();

        SpeciesVariant speciesVariant;
        if (request.Id != null)
        {
            speciesVariant = await _repository.Get<SpeciesVariant>(request.Id.Value);
            if (speciesVariant == null) return Results.BadRequest();

            speciesVariant.Name = request.Name;
            speciesVariant.Species = species;
            speciesVariant.FeedingGuidance = request.FeedingGuidance;
        }
        else
        {
            speciesVariant = new SpeciesVariant
            {
                Name = request.Name,
                Species = species,
                FeedingGuidance = request.FeedingGuidance
            };
            _repository.Create(speciesVariant);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
