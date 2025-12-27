using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.RegularShifts;

public class AddRegularShift : IRequest<IResult>
{
    public int UserId { get; private set; }
    public DayOfWeek Day { get; set; }
    public int? Week { get; set; }
    public int TimeId { get; set; }
    public int JobId { get; set; }

    public AddRegularShift WithId(int id)
    {
        UserId = id;
        return this;
    }
}

public class AddRegularShiftHandler : IRequestHandler<AddRegularShift, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddRegularShiftHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddRegularShift request, CancellationToken cancellationToken)
    {
        var account = await _repository.Get<Account>(request.UserId);
        var job = await _repository.Get<Job>(request.JobId);
        var time = await _repository.Get<TimeRange>(request.TimeId);
        if (account == null || job == null || time == null) return Results.BadRequest();

        _repository.Create(new RegularShift
        {

            Account = account,
            Day = request.Day,
            Week = request.Week,
            Job = job,
            Time = time
        });

        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
