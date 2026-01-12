using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class MovePen : IRequest<IResult>
{
    public int Id { get; set; }
    public int AreaId { get; set; }
}

public class MovePenHandler : IRequestHandler<MovePen, IResult>
{
    private readonly IDatabaseRepository _repository;

    public MovePenHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(MovePen request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.Id);
        if (pen == null) return Results.BadRequest();

        var area = await _repository.Get<Area>(request.AreaId);
        if (area == null) return Results.BadRequest();

        pen.Area = area;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
