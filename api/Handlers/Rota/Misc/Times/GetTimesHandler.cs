using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Times;

public class GetTimes : IRequest<IResult>
{
}

public class GetTimesHandler : IRequestHandler<GetTimes, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetTimesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetTimes request, CancellationToken cancellationToken)
    {
        var timeRanges = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        return Results.Ok(timeRanges.OrderBy(x => x.Id));
    }
}
