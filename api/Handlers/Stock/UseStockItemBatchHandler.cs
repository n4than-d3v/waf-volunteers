using Api.Database;
using Api.Database.Entities.Stock;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Stock;

public class UseStockItemBatch : IRequest<IResult>
{
    public int BatchId { get; private set; }
    public int Quantity { get; set; }
    public string Initials { get; set; }

    public UseStockItemBatch WithId(int id)
    {
        BatchId = id;
        return this;
    }
}

public class UseStockItemBatchHandler : IRequestHandler<UseStockItemBatch, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UseStockItemBatchHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UseStockItemBatch request, CancellationToken cancellationToken)
    {
        var batch = await _repository.Get<StockItemBatch>(request.BatchId, action: x => x.Include(y => y.Item));
        if (batch == null) return Results.BadRequest();

        var now = DateTime.UtcNow;
        var expiry = now.AddDays(batch.Item.AfterOpeningLifetimeDays);

        var usage = new StockItemBatchUsage
        {
            Batch = batch,
            Date = now,
            Quantity = request.Quantity,
            SignedOutBy = request.Initials,
            Expiry = DateOnly.FromDateTime(expiry)
        };

        _repository.Create(usage);
        await _repository.SaveChangesAsync();
        return Results.Ok(new { id = usage.Id });
    }
}
