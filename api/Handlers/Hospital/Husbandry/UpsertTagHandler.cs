using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class UpsertTag : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class UpsertTagHandler : IRequestHandler<UpsertTag, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertTagHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertTag request, CancellationToken cancellationToken)
    {
        Tag tag;
        if (request.Id != null)
        {
            tag = await _repository.Get<Tag>(request.Id.Value);
            if (tag == null) return Results.BadRequest();

            tag.Name = request.Name;
            tag.Description = request.Description;
        }
        else
        {
            tag = new Tag
            {
                Name = request.Name,
                Description = request.Description
            };
            _repository.Create(tag);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
