using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Boards;

public class GetBoardMessages : IRequest<IResult>
{
}

public class GetBoardMessagesHandler : IRequestHandler<GetBoardMessages, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetBoardMessagesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetBoardMessages request, CancellationToken cancellationToken)
    {
        var messages = await _repository.GetAll<BoardMessage>(x => true, tracking: false,
            action: x => x.Include(y => y.Board));

        return Results.Ok(messages.OrderByDescending(x => x.End).ThenByDescending(x => x.Start).ThenBy(x => x.Board.Name));
    }
}
