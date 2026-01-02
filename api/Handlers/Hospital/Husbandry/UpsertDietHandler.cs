using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class UpsertDiet : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class UpsertDietHandler : IRequestHandler<UpsertDiet, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertDietHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertDiet request, CancellationToken cancellationToken)
    {
        Diet diet;
        if (request.Id != null)
        {
            diet = await _repository.Get<Diet>(request.Id.Value);
            if (diet == null) return Results.BadRequest();

            diet.Name = request.Name;
            diet.Description = request.Description;
        }
        else
        {
            diet = new Diet
            {
                Name = request.Name,
                Description = request.Description
            };
            _repository.Create(diet);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
