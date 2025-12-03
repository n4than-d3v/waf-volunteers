using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Misc.Requirements;

public class GetRequirements : IRequest<IResult>
{
}

public class GetRequirementsHandler : IRequestHandler<GetRequirements, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetRequirementsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetRequirements request, CancellationToken cancellationToken)
    {
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false, action: x => x.Include(y => y.Time).Include(y => y.Job));
        return Results.Ok(requirements
            .OrderBy(x => x.Day == DayOfWeek.Sunday ? 7 : (int)x.Day)
            .ThenBy(x => x.Time.Id)
            .ThenBy(x => x.Job.Id));
    }
}
