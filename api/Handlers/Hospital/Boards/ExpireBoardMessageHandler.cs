using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using MediatR;

namespace Api.Handlers.Hospital.Boards;

public class ExpireBoardMessage : IRequest<IResult>
{
    public int BoardId { get; set; }
}

public class ExpireBoardMessageHandler : IRequestHandler<ExpireBoardMessage, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ExpireBoardMessageHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ExpireBoardMessage request, CancellationToken cancellationToken)
    {
        var message = await _repository.Get<BoardMessage>(request.BoardId);
        if (message == null) return Results.BadRequest();

        message.End = DateTime.UtcNow;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
