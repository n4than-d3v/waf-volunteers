using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class GetTags : IRequest<IResult>
{
}

public class GetTagsHandler : IRequestHandler<GetTags, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetTagsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetTags request, CancellationToken cancellationToken)
    {
        var tags = await _repository.GetAll<Tag>(x => true, tracking: false);
        return Results.Ok(tags);
    }
}
