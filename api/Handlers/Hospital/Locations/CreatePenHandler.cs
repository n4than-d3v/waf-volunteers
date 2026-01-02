using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class CreatePen : IRequest<IResult>
{
    public int AreaId { get; set; }
    public string Code { get; set; }
}

public class CreatePenHandler : IRequestHandler<CreatePen, IResult>
{
    private readonly IDatabaseRepository _repository;

    public CreatePenHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(CreatePen request, CancellationToken cancellationToken)
    {
        var area = await _repository.Get<Area>(request.AreaId);
        if (area == null) return Results.BadRequest();

        var pen = new Pen
        {
            Area = area,
            Code = request.Code
        };

        _repository.Create(pen);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
