namespace Api.Handlers.Hospital.Tasks.Concerns.Reasons;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpsertConcernReason : IRequest<IResult>
{
    public int? Id { get; set; }
    public int CategoryId { get; set; }
    public string Description { get; set; }
}

public class UpsertConcernReasonHandler : IRequestHandler<UpsertConcernReason, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertConcernReasonHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertConcernReason request, CancellationToken cancellationToken)
    {
        var category = await _repository.Get<HusbandryConcernCategory>(request.CategoryId, tracking: true, action: x => x.Include(y => y.Reasons));
        if (category == null) return Results.BadRequest();

        HusbandryConcernReason reason;

        if (request.Id != null)
        {
            reason = await _repository.Get<HusbandryConcernReason>(request.Id.Value, tracking: true, action: x => x.Include(y => y.Category));
            if (reason == null) return Results.BadRequest();

            reason.Description = request.Description;
            reason.Category = category;
        }
        else
        {
            reason = new HusbandryConcernReason
            {
                Description = request.Description,
                Category = category
            };

            _repository.Create(reason);
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
