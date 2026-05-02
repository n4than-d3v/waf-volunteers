using Api.Database;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Boards;

namespace Api.Handlers.Hospital.Boards;

public class UpsertBoardCustomPen : IRequest<IResult>
{
    public int? Id { get; set; }
    public int BoardId { get; set; }
    public string Title { get; set; }
    public string[] Body { get; set; }
    public string[] Tags { get; set; }
    public DateOnly? ExpiresOn { get; set; }
    public List<UpsertBoardCustomPenTask> Tasks { get; set; }

    public UpsertBoardCustomPen WithId(int id)
    {
        BoardId = id;
        return this;
    }

    public class UpsertBoardCustomPenTask
    {
        public string Time { get; set; }
        public decimal QuantityValue { get; set; }
        public string QuantityUnit { get; set; }
        public string FoodOrTask { get; set; }
        public bool TopUp { get; set; }
        public string? Notes { get; set; }
        public string? Dish { get; set; }
    }
}

public class UpsertBoardCustomPenHandler : IRequestHandler<UpsertBoardCustomPen, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertBoardCustomPenHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertBoardCustomPen request, CancellationToken cancellationToken)
    {
        var board = await _repository.Get<Board>(request.BoardId);
        if (board == null) return Results.BadRequest();

        BoardCustomPen? boardCustomPen;
        if (request.Id != null)
        {
            boardCustomPen = await _repository.Get<BoardCustomPen>(request.Id.Value,
                action: x => x.Include(y => y.Tasks));
            if (boardCustomPen == null) return Results.BadRequest();

            boardCustomPen.Title = request.Title;
            boardCustomPen.Body = request.Body;
            boardCustomPen.Tags = request.Tags;
            boardCustomPen.ExpiresOn = request.ExpiresOn;
            boardCustomPen.Tasks ??= [];
        }
        else
        {
            boardCustomPen = new BoardCustomPen
            {
                Board = board,
                Title = request.Title,
                Body = request.Body,
                Tags = request.Tags,
                ExpiresOn = request.ExpiresOn,
                Tasks = []
            };
            _repository.Create(boardCustomPen);
        }

        boardCustomPen.Tasks.RemoveAll(x => true);

        foreach (var item in request.Tasks)
        {
            var newTask = new BoardCustomPenTask
            {
                Time = item.Time,
                QuantityValue = item.QuantityValue,
                QuantityUnit = item.QuantityUnit,
                TopUp = item.TopUp,
                Notes = item.Notes,
                Dish = item.Dish,
                FoodOrTask = item.FoodOrTask,
                BoardCustomPen = boardCustomPen
            };

            boardCustomPen.Tasks.Add(newTask);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
