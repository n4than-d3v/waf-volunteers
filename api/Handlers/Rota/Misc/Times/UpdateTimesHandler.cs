using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Times;

public class UpdateTimes : IRequest<IResult>
{
    public TimeRange[] Times { get; set; }

    public class TimeRange
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }

        public string BeaconName { get; set; }
    }
}

public class UpdateTimesHandler : IRequestHandler<UpdateTimes, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateTimesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateTimes request, CancellationToken cancellationToken)
    {
        var existingTimes = await _repository.GetAll<TimeRange>(x => true);

        foreach (var time in existingTimes)
        {
            var updatedTime = request.Times.FirstOrDefault(j => j.Id == time.Id);
            if (updatedTime != null)
            {
                // Update existing time range details
                time.Name = updatedTime.Name;
                time.Start = updatedTime.Start;
                time.End = updatedTime.End;
                time.BeaconName = updatedTime.BeaconName;
            }
            else
            {
                // Delete time ranges that no longer exist
                _repository.Delete(time);
            }
        }

        foreach (var time in request.Times.Where(j => j.Id == null))
        {
            // Create new time ranges
            _repository.Create(new TimeRange
            {
                Name = time.Name,
                Start = time.Start,
                End = time.End,
                BeaconName = time.BeaconName
            });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
