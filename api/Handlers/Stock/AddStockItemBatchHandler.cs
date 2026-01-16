using Api.Database;
using Api.Database.Entities.Stock;
using MediatR;

namespace Api.Handlers.Stock;

public class AddStockItemBatch : IRequest<IResult>
{
    public int ItemId { get; set; }
    public string Number { get; set; }
    public DateOnly Expiry { get; set; }
    public int Quantity { get; set; }
    public string Initials { get; set; }
}

public class AddStockItemBatchHandler : IRequestHandler<AddStockItemBatch, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddStockItemBatchHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddStockItemBatch request, CancellationToken cancellationToken)
    {
        var item = await _repository.Get<StockItem>(request.ItemId);
        if (item == null) return Results.BadRequest();

        var batch = new StockItemBatch
        {
            Item = item,
            Date = DateTime.UtcNow,
            Number = request.Number,
            Expiry = request.Expiry,
            Quantity = request.Quantity,
            Initials = request.Initials
        };

        _repository.Create(batch);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
