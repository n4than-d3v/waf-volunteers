using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Learning;
using Api.Services;
using MediatR;

namespace Api.Handlers.Learning;

public class WitnessAuxDevPlanTaskPerformance : IRequest<IResult>
{
    public int TaskId { get; set; }
    public int PerformerId { get; set; }
    public string Notes { get; set; }
    public bool SignedOff { get; set; }
}

public class WitnessAuxDevPlanTaskPerformanceHandler : IRequestHandler<WitnessAuxDevPlanTaskPerformance, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public WitnessAuxDevPlanTaskPerformanceHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(WitnessAuxDevPlanTaskPerformance request, CancellationToken cancellationToken)
    {
        var task = await _repository.Get<AuxDevPlanTask>(request.TaskId);
        if (task == null) return Results.BadRequest();

        var performer = await _repository.Get<Account>(request.PerformerId);
        if (performer == null) return Results.BadRequest();

        var witnesser = await _repository.Get<Account>(_userContext.Id);
        if (witnesser == null) return Results.BadRequest();

        var witness = new AuxDevPlanTaskWitness
        {
            Task = task,
            Date = DateTime.UtcNow,
            PerformedBy = performer,
            WitnessedBy = witnesser,
            Notes = request.Notes,
            SignedOff = request.SignedOff
        };

        _repository.Create(witness);
        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
