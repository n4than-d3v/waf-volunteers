namespace Api.Handlers.Hospital.Tasks;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;

public class GetCustomDailyTasks : IRequest<IResult>
{
}

public class GetCustomDailyTasksHandler : IRequestHandler<GetCustomDailyTasks, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetCustomDailyTasksHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetCustomDailyTasks request, CancellationToken cancellationToken)
    {
        var tasks = await _repository.GetAll<CustomDailyTask>(x => true, tracking: false);

        return Results.Ok(tasks);
    }
}
