using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using MediatR;

namespace Api.Handlers.Hospital.Boards;

public class AddBoardMessage : IRequest<IResult>
{
    public int? BoardId { get; private set; }
    public string Message { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public bool Emergency { get; set; }

    public AddBoardMessage WithId(int id)
    {
        BoardId = id;
        return this;
    }
}

public class AddBoardMessageHandler : IRequestHandler<AddBoardMessage, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddBoardMessageHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddBoardMessage request, CancellationToken cancellationToken)
    {
        IReadOnlyList<Board> boards;
        if (request.BoardId.HasValue)
        {
            var board = await _repository.Get<Board>(request.BoardId.Value);
            if (board == null) return Results.BadRequest();
            boards = [board];
        }
        else
        {
            boards = await _repository.GetAll<Board>(x => true);
        }

        foreach (var board in boards)
        {
            var message = new BoardMessage
            {
                Board = board,
                Message = request.Message,
                Start = request.Start,
                End = request.End,
                Emergency = request.Emergency
            };

            _repository.Create(message);
        }

        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
