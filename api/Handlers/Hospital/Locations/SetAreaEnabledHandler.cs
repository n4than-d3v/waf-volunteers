using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class SetAreaEnabled : IRequest<IResult>
{
    public int Id { get; set; }
    public bool Enabled { get; set; }

    public SetAreaEnabled WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class SetAreaEnabledHandler : IRequestHandler<SetAreaEnabled, IResult>
{
    private readonly IDatabaseRepository _repository;

    public SetAreaEnabledHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(SetAreaEnabled request, CancellationToken cancellationToken)
    {
        var area = await _repository.Get<Area>(request.Id);
        if (area == null) return Results.BadRequest();

        area.Deleted = !request.Enabled;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
