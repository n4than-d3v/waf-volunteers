using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class UpsertFood : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string? Notes { get; set; }
    public string? Substitute { get; set; }
    public bool ForceFeed { get; set; }
}

public class UpsertFoodHandler : IRequestHandler<UpsertFood, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertFoodHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertFood request, CancellationToken cancellationToken)
    {
        Food food;
        if (request.Id != null)
        {
            food = await _repository.Get<Food>(request.Id.Value);
            if (food == null) return Results.BadRequest();

            food.Name = request.Name;
            food.Notes = request.Notes;
            food.Substitute = request.Substitute;
            food.ForceFeed = request.ForceFeed;
        }
        else
        {
            food = new Food
            {
                Name = request.Name,
                Notes = request.Notes,
                Substitute = request.Substitute,
                ForceFeed = request.ForceFeed
            };
            _repository.Create(food);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
