using Api.Database;
using Api.Database.Entities.Learning;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static Api.Handlers.Learning.ViewAuxDevPlanLearnersHandler;

namespace Api.Handlers.Learning;

public class GetAuxDevPlanTasks : IRequest<IResult>
{
}

public class GetAuxDevPlanTasksHandler : IRequestHandler<GetAuxDevPlanTasks, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;

    public GetAuxDevPlanTasksHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(GetAuxDevPlanTasks request, CancellationToken cancellationToken)
    {
        var tasks = await _repository.GetAll<AuxDevPlanTask>(x => true, tracking: false,
            action: x => x
                .Include(y => y.Witnesses)
                    .ThenInclude(y => y.PerformedBy)
                .Include(y => y.Witnesses)
                    .ThenInclude(y => y.WitnessedBy));

        var learnerTasks = tasks.Select(task => new Learner.LearnerTaskWithDetails
        {
            Id = task.Id,
            Name = task.Name,
            Explanation = task.Explanation,
            YouTube = task.YouTube,
            Witnesses = task.Witnesses
                .Where(x => x.PerformedBy.Id == _userContext.Id)
                .Select(witness =>
                {
                    var witnessFirstName = _encryptionService.Decrypt(witness.WitnessedBy.FirstName, witness.WitnessedBy.Salt);
                    var witnessLastName = _encryptionService.Decrypt(witness.WitnessedBy.LastName, witness.WitnessedBy.Salt);
                    return new Learner.LearnerTask.LearnerTaskWitness
                    {
                        Date = witness.Date,
                        WitnessedBy = $"{witnessFirstName} {witnessLastName}",
                        Notes = witness.Notes,
                        SignedOff = witness.SignedOff
                    };
                }).ToList()
        }).ToList();

        return Results.Ok(learnerTasks);
    }
}
