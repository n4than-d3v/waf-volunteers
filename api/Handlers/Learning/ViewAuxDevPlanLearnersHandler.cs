using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Learning;
using Api.Services;
using MediatR;

namespace Api.Handlers.Learning;

public class ViewAuxDevPlanLearners : IRequest<IResult>
{
}

public class ViewAuxDevPlanLearnersHandler : IRequestHandler<ViewAuxDevPlanLearners, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewAuxDevPlanLearnersHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewAuxDevPlanLearners request, CancellationToken cancellationToken)
    {
        var witnesses = await _repository.GetAll<AuxDevPlanTaskWitness>(x => true, tracking: false);
        var tasks = await _repository.GetAll<AuxDevPlanTask>(x => true, tracking: false);
        var learners = await _repository.GetAll<Account>(x => true, tracking: false);

        var plans = learners
            .Where(x => x.Roles.HasFlag(AccountRoles.BEACON_AUXILIARY))
            .Select(learner =>
            {
                return true;
            });

        return Results.Ok(plans);
    }

    public class Learner
    {
        public string Name { get; set; }
        public List<LearnerTask> Tasks { get; set; }

        public class LearnerTask
        {
            public string Name { get; set; }
            public List<LearnerTaskWitness> Witnesses { get; set; }
            public bool SignedOff => Witnesses.Any(x => x.SignedOff);

            public class LearnerTaskWitness
            {
                public DateTime Date { get; set; }
                public string WitnessedBy { get; set; }
                public string Notes { get; set; }
                public bool SignedOff { get; set; }
            }
        }
    }
}
