using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class AddNewbie : IRequest<IResult>
{
    public string Name { get; set; }
    public DateOnly Date { get; set; }
    public int TimeId { get; set; }
    public int JobId { get; set; }
}

public class AddNewbieHandler : IRequestHandler<AddNewbie, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddNewbieHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddNewbie request, CancellationToken cancellationToken)
    {
        var time = await _repository.Get<TimeRange>(request.TimeId);
        var job = await _repository.Get<Job>(request.JobId);

        var newbie = new Newbie
        {
            Name = request.Name,
            Date = request.Date,
            Time = time,
            Job = job
        };

        _repository.Create(newbie);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
