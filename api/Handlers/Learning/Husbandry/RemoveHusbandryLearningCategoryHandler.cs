using Api.Database;
using Api.Database.Entities.Learning.Husbandry;
using MediatR;

namespace Api.Handlers.Learning.Husbandry;

public class RemoveHusbandryLearningCategory : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemoveHusbandryLearningCategoryHandler
    : IRequestHandler<RemoveHusbandryLearningCategory, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveHusbandryLearningCategoryHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(
        RemoveHusbandryLearningCategory request,
        CancellationToken cancellationToken
    )
    {
        var category = await _repository.Get<HusbandryLearningCategory>(request.Id);
        if (category == null)
            return Results.BadRequest();

        _repository.Delete(category);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
