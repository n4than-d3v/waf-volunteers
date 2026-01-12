using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class SetPenEnabled : IRequest<IResult>
{
    public int Id { get; set; }
    public bool Enabled { get; set; }

    public SetPenEnabled WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class SetPenEnabledHandler : IRequestHandler<SetPenEnabled, IResult>
{
    private readonly IDatabaseRepository _repository;

    public SetPenEnabledHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(SetPenEnabled request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.Id);
        if (pen == null) return Results.BadRequest();

        pen.Deleted = !request.Enabled;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
