using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Outcome;

/// <summary>
/// Internal request made when dispositioning a patient
/// </summary>
public class MarkPenNeedsCleaning : IRequest<IResult>
{
    public int Id { get; set; }
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
        var pen = await _repository.Get<Pen>(request.Id, action: x => x.Include(y => y.Patients));
        if (pen == null) return Results.BadRequest();

        if (pen.Empty)
        {
            pen.NeedsCleaning = true;
            await _repository.SaveChangesAsync();
        }

        return Results.NoContent();
    }
}
