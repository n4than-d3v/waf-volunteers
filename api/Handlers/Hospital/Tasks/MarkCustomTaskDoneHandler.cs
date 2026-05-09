namespace Api.Handlers.Hospital.Tasks;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;

public class MarkCustomTaskDone : IRequest<IResult>
{
    public int Id { get; set; }
}

public class MarkCustomTaskDoneHandler : IRequestHandler<MarkCustomTaskDone, IResult>
{
    private readonly IDatabaseRepository _repository;

    public MarkCustomTaskDoneHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(MarkCustomTaskDone request, CancellationToken cancellationToken)
    {
        var task = await _repository.Get<CustomDailyTask>(request.Id);
        if (task == null) return Results.NotFound();

        task.LastDone = DateTime.UtcNow;
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
