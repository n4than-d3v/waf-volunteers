using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;

namespace Api.Handlers.Hospital.Locations;

public class SetPenCleanStatus : IRequest<IResult>
{
    public int Id { get; set; }
    public PenCleanStatus CleanStatus { get; set; }
    public string? CustomBoardMessage { get; set; }

    public SetPenCleanStatus WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class SetPenCleanStatusHandler : IRequestHandler<SetPenCleanStatus, IResult>
{
    private readonly IDatabaseRepository _repository;

    public SetPenCleanStatusHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(SetPenCleanStatus request, CancellationToken cancellationToken)
    {
        var pen = await _repository.Get<Pen>(request.Id);
        if (pen == null) return Results.BadRequest();

        pen.CleanStatus = request.CleanStatus;
        pen.CustomBoardMessage = request.CustomBoardMessage;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
