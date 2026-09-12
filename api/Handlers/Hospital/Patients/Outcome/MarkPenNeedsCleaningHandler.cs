using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Outcome;

/// <summary>
/// Internal request made when dispositioning a patient
/// </summary>
public class MarkPenNeedsCleaning : IRequest<IResult>
{
    public int Id { get; set; }

    public bool IsMovingIntoQuarantine { get; set; } = false;
}

public class MarkPenNeedsCleaningHandler : IRequestHandler<MarkPenNeedsCleaning, IResult>
{
    private readonly IDatabaseRepository _repository;

    public MarkPenNeedsCleaningHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(MarkPenNeedsCleaning request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.Id, action: x => x.Include(y => y.Patients).Include(y => y.Area));
        if (pen == null) return Results.BadRequest();

        if (pen.Empty)
        {
            pen.CleanStatus = (pen.Area.IsQuarantine || request.IsMovingIntoQuarantine)
                ? PenCleanStatus.NeedsDeepCleaning
                : PenCleanStatus.NeedsCleaning;

            var concerns = await _repository.GetAll<HusbandryConcern>(
                x => x.Pen.Id == pen.Id && x.Checked == false,
                action: x => x.Include(c => c.Pen));

            foreach (var concern in concerns)
                concern.Checked = true;

            await _repository.SaveChangesAsync();
        }

        return Results.NoContent();
    }
}
