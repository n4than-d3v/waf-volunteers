using Api.Database;
using Api.Database.Entities.Learning.Husbandry;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Learning.Husbandry;

public class GetHusbandryLearningCategories : IRequest<IResult> { }

public class GetHusbandryLearningCategoriesHandler
    : IRequestHandler<GetHusbandryLearningCategories, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetHusbandryLearningCategoriesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(
        GetHusbandryLearningCategories request,
        CancellationToken cancellationToken
    )
    {
        var categories = await _repository.GetAll<HusbandryLearningCategory>(
            x => true,
            tracking: false,
            action: x => x.Include(y => y.Parent)
        );

        var lookup = categories.ToDictionary(x => x.Id);

        var dtoMap = categories.ToDictionary(
            x => x.Id,
            x => new HusbandryCategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                YouTube = x.YouTube,
                Children = [],
            }
        );

        List<HusbandryCategoryDto> roots = [];

        foreach (var category in categories)
        {
            if (category.Parent == null)
            {
                roots.Add(dtoMap[category.Id]);
            }
            else if (category.Parent.Id != category.Id)
            {
                dtoMap[category.Parent.Id].Children!.Add(dtoMap[category.Id]);
            }
        }

        return Results.Ok(roots);
    }

    public class HusbandryCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? YouTube { get; set; }
        public List<HusbandryCategoryDto>? Children { get; set; }
    }
}
