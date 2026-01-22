using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using Api.Database.Entities.Hospital.Locations;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Boards;

public class UpsertBoard : IRequest<IResult>
{
    public int? Id { get; set; }

    public string Name { get; set; }
    public List<UpsertBoardArea> Areas { get; set; }

    public class UpsertBoardArea
    {
        public int AreaId { get; set; }
        public BoardAreaDisplayType DisplayType { get; set; }
    }
}

public class UpsertBoardHandler : IRequestHandler<UpsertBoard, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertBoardHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertBoard request, CancellationToken cancellationToken)
    {
        var areas = await _repository.GetAll<Area>(x => true);

        Board? board;
        if (request.Id.HasValue)
        {
            board = await _repository.Get<Board>(request.Id.Value,
                action: x => x.Include(y => y.Areas).ThenInclude(y => y.Area));
        }
        else
        {
            board = new Board { Areas = [], Messages = [] };
            _repository.Create(board);
        }

        if (board == null) return Results.BadRequest();

        board.Name = request.Name;
        foreach (var upsertArea in request.Areas)
        {
            var area = areas.FirstOrDefault(x => x.Id == upsertArea.AreaId);
            if (area == null) return Results.BadRequest();

            var boardArea = board.Areas.FirstOrDefault(x => x.Area.Id == area.Id);
            if (boardArea == null)
            {
                boardArea = new BoardArea { Area = area, Board = board };
                board.Areas.Add(boardArea);
            }

            boardArea.DisplayType = upsertArea.DisplayType;
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
