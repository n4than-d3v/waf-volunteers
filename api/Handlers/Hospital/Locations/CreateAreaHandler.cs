using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class CreateArea : IRequest<IResult>
{
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsQuarantine { get; set; }
}

public class CreateAreaHandler : IRequestHandler<CreateArea, IResult>
{
    private readonly IDatabaseRepository _repository;

    public CreateAreaHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(CreateArea request, CancellationToken cancellationToken)
    {
        var area = new Area
        {
            Name = request.Name,
            Code = request.Code,
            IsQuarantine = request.IsQuarantine
        };

        _repository.Create(area);

        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
