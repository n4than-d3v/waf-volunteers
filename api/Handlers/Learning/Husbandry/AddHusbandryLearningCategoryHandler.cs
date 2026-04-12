using Api.Database;
using Api.Database.Entities.Learning.Husbandry;
using MediatR;

namespace Api.Handlers.Learning.Husbandry;

public class AddHusbandryLearningCategory : IRequest<IResult>
{
    public int? ParentId { get; set; }
    public string Name { get; set; }
    public string? YouTube { get; set; }
}

public class AddHusbandryLearningCategoryHandler
    : IRequestHandler<AddHusbandryLearningCategory, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddHusbandryLearningCategoryHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(
        AddHusbandryLearningCategory request,
        CancellationToken cancellationToken
    )
    {
        HusbandryLearningCategory? parent = null;

        if (request.ParentId.HasValue)
        {
            parent = await _repository.Get<HusbandryLearningCategory>(request.ParentId.Value);
            if (parent == null)
                return Results.BadRequest();
        }

        _repository.Create(
            new HusbandryLearningCategory
            {
                Name = request.Name,
                YouTube = request.YouTube,
                Parent = parent,
            }
        );
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
