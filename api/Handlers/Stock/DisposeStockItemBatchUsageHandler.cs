using Api.Database;
using Api.Database.Entities.Stock;
using MediatR;

namespace Api.Handlers.Stock;

public class DisposeStockItemBatchUsage : IRequest<IResult>
{
    public int UsageId { get; private set; }
    public string Initials { get; set; }

    public DisposeStockItemBatchUsage WithId(int id)
    {
        UsageId = id;
        return this;
    }
}

public class DisposeStockItemBatchUsageHandler : IRequestHandler<DisposeStockItemBatchUsage, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DisposeStockItemBatchUsageHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DisposeStockItemBatchUsage request, CancellationToken cancellationToken)
    {
        var usage = await _repository.Get<StockItemBatchUsage>(request.UsageId);
        if (usage == null) return Results.BadRequest();

        usage.Disposed = DateTime.UtcNow;
        usage.DisposedBy = request.Initials;

        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
