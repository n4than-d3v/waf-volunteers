using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class CleanPen : IRequest<IResult>
{
    public int Id { get; set; }

    public CleanPen WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class CleanPenHandler : IRequestHandler<CleanPen, IResult>
{
    private readonly IDatabaseRepository _repository;

    public CleanPenHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(CleanPen request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.Id);
        if (pen == null) return Results.BadRequest();

        pen.NeedsCleaning = false;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
