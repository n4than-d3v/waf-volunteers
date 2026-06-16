namespace Api.Handlers.Hospital.Tasks.Concerns.Reasons;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpsertConcernCategory : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Description { get; set; }
}

public class UpsertConcernCategoryHandler : IRequestHandler<UpsertConcernCategory, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertConcernCategoryHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertConcernCategory request, CancellationToken cancellationToken)
    {
        if (request.Id != null)
        {
            var category = await _repository.Get<HusbandryConcernCategory>(request.Id.Value, tracking: true);
            if (category == null) return Results.BadRequest();

            category.Description = request.Description;
        }
        else
        {
            var category = new HusbandryConcernCategory
            {
                Description = request.Description,
            };

            _repository.Create(category);
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
