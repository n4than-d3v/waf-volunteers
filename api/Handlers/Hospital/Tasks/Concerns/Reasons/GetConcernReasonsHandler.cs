namespace Api.Handlers.Hospital.Tasks.Concerns.Reasons;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetConcernReasons : IRequest<IResult>
{
}

public class GetConcernReasonsHandler : IRequestHandler<GetConcernReasons, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetConcernReasonsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetConcernReasons request, CancellationToken cancellationToken)
    {
        var reasons = await _repository.GetAll<HusbandryConcernCategory>(x => true, tracking: false,
            action: x => x.Include(y => y.Reasons));
        return Results.Ok(reasons);
    }
}
