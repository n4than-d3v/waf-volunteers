using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.MissingReasons;

public class GetMissingReasons : IRequest<IResult>
{
}

public class GetMissingReasonsHandler : IRequestHandler<GetMissingReasons, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetMissingReasonsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetMissingReasons request, CancellationToken cancellationToken)
    {
        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);
        return Results.Ok(missingReasons.OrderBy(x => x.Id));
    }
}
