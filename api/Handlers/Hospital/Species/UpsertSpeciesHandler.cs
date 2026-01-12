using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.PatientTypes;

public class UpsertSpecies : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public SpeciesType SpeciesType { get; set; }
}

public class UpsertDispositionReasonHandler : IRequestHandler<UpsertSpecies, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertDispositionReasonHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertSpecies request, CancellationToken cancellationToken)
    {
        Species species;
        if (request.Id != null)
        {
            species = await _repository.Get<Species>(request.Id.Value);
            if (species == null) return Results.BadRequest();

            species.Name = request.Name;
            species.SpeciesType = request.SpeciesType;
        }
        else
        {
            species = new Species
            {
                Name = request.Name,
                SpeciesType = request.SpeciesType
            };
            _repository.Create(species);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
