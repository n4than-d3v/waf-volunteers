using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Assignments.Shifts;

public class UpdateAssignableShifts : IRequest<IResult>
{
    public AssignableShift[] AssignableShifts { get; set; }

    public class AssignableShift
    {
        public int? Id { get; set; }
        public DayOfWeek Day { get; set; }
        public int TimeId { get; set; }
        public int JobId { get; set; }
    }
}

public class UpdateAssignableShiftsHandler : IRequestHandler<UpdateAssignableShifts, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateAssignableShiftsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateAssignableShifts request, CancellationToken cancellationToken)
    {
        var existingAssignableShifts = await _repository.GetAll<AssignableShift>(x => true);
        var jobs = await _repository.GetAll<Job>(x => true);
        var times = await _repository.GetAll<TimeRange>(x => true);

        foreach (var assignableShift in existingAssignableShifts)
        {
            var updatedAssignableShift = request.AssignableShifts.FirstOrDefault(j => j.Id == assignableShift.Id);
            if (updatedAssignableShift != null)
            {
                var time = times.FirstOrDefault(x => x.Id == updatedAssignableShift.TimeId);
                var job = jobs.FirstOrDefault(x => x.Id == updatedAssignableShift.JobId);
                if (time == null || job == null) return Results.BadRequest();

                // Update existing assignable shift details
                assignableShift.Day = updatedAssignableShift.Day;
                assignableShift.Time = time;
                assignableShift.Job = job;
            }
            else
            {
                // Delete assignable shifts that no longer exist
                _repository.Delete(assignableShift);
            }
        }

        foreach (var assignableShift in request.AssignableShifts.Where(j => j.Id == null))
        {
            var time = times.FirstOrDefault(x => x.Id == assignableShift.TimeId);
            var job = jobs.FirstOrDefault(x => x.Id == assignableShift.JobId);
            if (time == null || job == null) return Results.BadRequest();

            // Create new assignable shifts
            _repository.Create(new AssignableShift
            {
                Day = assignableShift.Day,
                Time = time,
                Job = job
            });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
