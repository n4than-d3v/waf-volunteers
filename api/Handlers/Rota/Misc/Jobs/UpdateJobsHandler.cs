using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Jobs;

public class UpdateJobs : IRequest<IResult>
{
    public Job[] Jobs { get; set; }

    public class Job
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }
}

public class UpdateJobsHandler : IRequestHandler<UpdateJobs, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateJobsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateJobs request, CancellationToken cancellationToken)
    {
        var existingJobs = await _repository.GetAll<Job>(x => true);

        foreach (var job in existingJobs)
        {
            var updatedJob = request.Jobs.FirstOrDefault(j => j.Id == job.Id);
            if (updatedJob != null)
            {
                // Update existing job details
                job.Name = updatedJob.Name;
            }
            else
            {
                // Delete jobs that no longer exist
                _repository.Delete(job);
            }
        }

        foreach (var job in request.Jobs.Where(j => j.Id == null))
        {
            // Create new jobs
            _repository.Create(new Job { Name = job.Name });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
