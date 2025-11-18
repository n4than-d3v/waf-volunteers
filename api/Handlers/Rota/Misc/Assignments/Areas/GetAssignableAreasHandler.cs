using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Assignments.Areas;

public class GetAssignableAreas : IRequest<IResult>
{
}

public class GetAssignableAreasHandler : IRequestHandler<GetAssignableAreas, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetAssignableAreasHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetAssignableAreas request, CancellationToken cancellationToken)
    {
        var assignableAreas = await _repository.GetAll<AssignableArea>(x => true, tracking: false);
        return Results.Ok(assignableAreas.OrderBy(x => x.Id));
    }
}
