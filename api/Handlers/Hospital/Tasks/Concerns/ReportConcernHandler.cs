namespace Api.Handlers.Hospital.Tasks.Concerns;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;

public class ReportConcern : IRequest<IResult>
{
    public int PenId { get; set; }
    public int ReasonId { get; set; }
}

public class ReportConcernHandler : IRequestHandler<ReportConcern, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ReportConcernHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ReportConcern request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.PenId);
        if (pen == null) return Results.NotFound();

        var reason = await _repository.Get<HusbandryConcernReason>(request.ReasonId);
        if (reason == null) return Results.NotFound();

        var concern = new HusbandryConcern
        {
            Pen = pen,
            Reason = reason,
            Raised = DateTime.UtcNow,
            Checked = false
        };

        _repository.Create(concern);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
