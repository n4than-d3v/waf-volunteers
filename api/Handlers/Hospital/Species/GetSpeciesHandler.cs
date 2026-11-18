using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.PatientTypes;

public class GetSpecies : IRequest<IResult>
{
}

public class GetSpeciesHandler : IRequestHandler<GetSpecies, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetSpeciesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetSpecies request, CancellationToken cancellationToken)
    {
        var species = await _repository.GetAll<Species>(x => x.Deleted == false, tracking: false,
            x => x.Include(y => y.Variants).ThenInclude(y => y.FeedingGuidance).ThenInclude(y => y.Food));

        foreach (var s in species)
        {
            s.Variants = [.. s.Variants.Where(x => x.Deleted == false)];
        }

        return Results.Ok(species.OrderBy(x => x.Name));
    }
}
