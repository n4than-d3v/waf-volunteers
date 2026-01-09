using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Locations;

public class GetAreas : IRequest<IResult>
{
}

public class GetAreasHandler : IRequestHandler<GetAreas, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetAreasHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetAreas request, CancellationToken cancellationToken)
    {
        var areas = await _repository.GetAll<Area>(x => true, tracking: false,
            x => x.Include(y => y.Pens).ThenInclude(y => y.Patients));
        return Results.Ok(areas);
    }
}
