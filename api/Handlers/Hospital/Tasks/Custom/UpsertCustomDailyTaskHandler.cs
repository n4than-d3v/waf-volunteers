namespace Api.Handlers.Hospital.Tasks;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;

public class UpsertCustomDailyTask : IRequest<IResult>
{
    public int? Id { get; private set; }

    public string Location { get; set; }
    public string Message { get; set; }

    public UpsertCustomDailyTask WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpsertCustomDailyTaskHandler : IRequestHandler<UpsertCustomDailyTask, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertCustomDailyTaskHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertCustomDailyTask request, CancellationToken cancellationToken)
    {
        if (request.Id.HasValue)
        {
            var task = await _repository.Get<CustomDailyTask>(request.Id.Value);
            if (task == null) return Results.NotFound();

            task.Location = request.Location;
            task.Message = request.Message;
        }
        else
        {
            var task = new CustomDailyTask
            {
                Location = request.Location,
                Message = request.Message
            };

            _repository.Create(task);
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
