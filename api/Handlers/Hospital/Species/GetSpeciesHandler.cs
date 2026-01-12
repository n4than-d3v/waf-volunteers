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
        var species = await _repository.GetAll<Species>(x => true, tracking: false, x => x.Include(y => y.Variants));
        return Results.Ok(species.OrderBy(x => x.Name));
    }
}
