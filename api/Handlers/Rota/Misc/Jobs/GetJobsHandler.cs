using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Jobs;

public class GetJobs : IRequest<IResult>
{
}

public class GetJobsHandler : IRequestHandler<GetJobs, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetJobsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetJobs request, CancellationToken cancellationToken)
    {
        var jobs = await _repository.GetAll<Job>(x => true, tracking: false);
        return Results.Ok(jobs.OrderBy(x => x.Id));
    }
}
