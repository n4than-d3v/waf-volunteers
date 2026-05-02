using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Boards;

public class GetBoardCustomPens : IRequest<IResult>
{
}

public class GetBoardCustomPensHandler : IRequestHandler<GetBoardCustomPens, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetBoardCustomPensHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetBoardCustomPens request, CancellationToken cancellationToken)
    {
        var customPens = await _repository.GetAll<BoardCustomPen>(x => true, tracking: false,
            action: x => x.Include(y => y.Board).Include(y => y.Tasks));

        return Results.Ok(customPens.OrderByDescending(x => x.ExpiresOn).ThenBy(x => x.Board.Name));
    }
}
