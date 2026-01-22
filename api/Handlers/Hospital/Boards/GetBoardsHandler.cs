using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Boards;

public class GetBoards : IRequest<IResult>
{
}

public class GetBoardsHandler : IRequestHandler<GetBoards, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetBoardsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetBoards request, CancellationToken cancellationToken)
    {
        var boards = await _repository.GetAll<Board>(x => true, tracking: false,
            action: x => x.Include(y => y.Areas).ThenInclude(y => y.Area));
        return Results.Ok(boards.OrderBy(x => x.Name));
    }
}
