using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Learning;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
        var tasks = await _repository.GetAll<AuxDevPlanTask>(x => true, tracking: false,
            action: x => x
                .Include(y => y.Witnesses)
                    .ThenInclude(y => y.PerformedBy)
                .Include(y => y.Witnesses)
                    .ThenInclude(y => y.WitnessedBy));
        var learners = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        var plans = learners
            .Where(x => x.Roles.HasFlag(AccountRoles.BEACON_AUXILIARY))
            .Select(learner =>
            {
                var firstName = _encryptionService.Decrypt(learner.FirstName, learner.Salt);
                var lastName = _encryptionService.Decrypt(learner.LastName, learner.Salt);
                return new Learner
                {
                    Id = learner.Id,
                    Name = $"{firstName} {lastName}",
                    Tasks = tasks.Select(task => new Learner.LearnerTask
                    {
                        Id = task.Id,
                        Name = task.Name,
                        Witnesses = task.Witnesses
                            .Where(x => x.PerformedBy.Id == learner.Id)
                            .Select(witness =>
                             {
                                 var witnessFirstName = _encryptionService.Decrypt(witness.WitnessedBy.FirstName, witness.WitnessedBy.Salt);
                                 var witnessLastName = _encryptionService.Decrypt(witness.WitnessedBy.LastName, witness.WitnessedBy.Salt);
                                 return new Learner.LearnerTask.LearnerTaskWitness
                                 {
                                     Id = witness.Id,
                                     Date = witness.Date,
                                     WitnessedBy = $"{witnessFirstName} {witnessLastName}",
                                     Notes = witness.Notes,
                                     SignedOff = witness.SignedOff
                                 };
                             }).ToList()
                    }).ToList()
                };
            }).OrderBy(x => x.Name);

        return Results.Ok(plans);
    }

    public class Learner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<LearnerTask> Tasks { get; set; }
        public int SignedOff => Tasks.Count(x => x.SignedOff);

        public class LearnerTaskWithDetails : LearnerTask
        {
            public string Explanation { get; set; }
            public string[] YouTube { get; set; }
        }

        public class LearnerTask
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public List<LearnerTaskWitness> Witnesses { get; set; }
            public bool SignedOff => Witnesses.Any(x => x.SignedOff);


            public class LearnerTaskWitness
            {
                public int Id { get; set; }
                public DateTime Date { get; set; }
                public string WitnessedBy { get; set; }
                public string Notes { get; set; }
                public bool SignedOff { get; set; }
            }
        }
    }
}
