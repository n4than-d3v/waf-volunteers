using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Requirements;

public class UpdateRequirements : IRequest<IResult>
{
    public Requirement[] Requirements { get; set; }

    public class Requirement
    {
        public int? Id { get; set; }
        public DayOfWeek Day { get; set; }
        public int TimeId { get; set; }
        public int JobId { get; set; }
        public int Minimum { get; set; }
    }
}

public class UpdateRequirementsHandler : IRequestHandler<UpdateRequirements, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateRequirementsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateRequirements request, CancellationToken cancellationToken)
    {
        var jobs = await _repository.GetAll<Job>(x => true);
        var times = await _repository.GetAll<TimeRange>(x => true);

        var existingRequirements = await _repository.GetAll<Requirement>(x => true);

        foreach (var requirement in existingRequirements)
        {
            var updatedRequirement = request.Requirements.FirstOrDefault(j => j.Id == requirement.Id);
            if (updatedRequirement != null)
            {
                // Update existing requirement details
                requirement.Job = jobs.FirstOrDefault(x => x.Id == updatedRequirement.JobId)!;
                requirement.Time = times.FirstOrDefault(x => x.Id == updatedRequirement.TimeId)!;
                requirement.Day = updatedRequirement.Day;
                requirement.Minimum = updatedRequirement.Minimum;
            }
            else
            {
                // Delete requirements that no longer exist
                _repository.Delete(requirement);
            }
        }

        foreach (var requirement in request.Requirements.Where(j => j.Id == null))
        {
            // Create new requirements
            _repository.Create(new Requirement
            {
                Job = jobs.FirstOrDefault(x => x.Id == requirement.JobId)!,
                Time = times.FirstOrDefault(x => x.Id == requirement.TimeId)!,
                Day = requirement.Day,
                Minimum = requirement.Minimum,
            });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
