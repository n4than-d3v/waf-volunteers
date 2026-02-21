using Api.Database;
using Api.Database.Entities.Stock;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Stock;

public class GetStock : IRequest<IResult>
{
}

public class GetStockHandler : IRequestHandler<GetStock, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetStockHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetStock request, CancellationToken cancellationToken)
    {
        var items = await _repository.GetAll<StockItem>(x => true, tracking: false,
            action: x => x
                .Include(y => y.Medication)
                .Include(y => y.MedicationConcentration)
                .Include(y => y.Batches)
                    .ThenInclude(y => y.Usages));
        return Results.Ok(items
            .Select(x => new ItemWrapper(x))
            .OrderBy(x => x.Medication));
    }

    public class ItemWrapper
    {
        public ItemWrapper(StockItem item)
        {
            Id = item.Id;
            Medication = item.Medication.ActiveSubstance;
            var concentration = item.MedicationConcentration;
            MedicationConcentration = $"{concentration.Form} ({concentration.ConcentrationValue} {concentration.ConcentrationUnit})";
            Brand = item.Brand;
            Measurement = item.Measurement;
            AfterOpeningLifetimeDays = item.AfterOpeningLifetimeDays;
            ReorderQuantity = item.ReorderQuantity;
            Batches = item.Batches
                .Select(x => new BatchWrapper(x))
                .Where(x => x.QuantityInStock + x.QuantityInUse > 0)
                .ToList();
        }

        public int Id { get; set; }
        public string Medication { get; set; }
        public string MedicationConcentration { get; set; }
        public string Brand { get; set; }

        public StockMeasurement Measurement { get; set; }
        public int AfterOpeningLifetimeDays { get; set; }
        public int ReorderQuantity { get; set; }

        public bool NeedsReordering => QuantityInStock <= ReorderQuantity;
        public int QuantityInStock => Batches.Sum(x => x.QuantityInStock);
        public int QuantityInUse => Batches.Sum(x => x.QuantityInUse);
        public bool Expired => Batches.Any(x => x.Expired);
        public bool ExpiredAfterOpening => Batches.Any(x => x.ExpiredAfterOpening);
        public bool ExpiresSoon => Batches.Any(x => x.ExpiresSoon);
        public bool ExpiresSoonAfterOpening => Batches.Any(x => x.ExpiresSoonAfterOpening);

        public List<BatchWrapper> Batches { get; set; }
    }

    public class BatchWrapper
    {
        public const int DaysUntilExpiresSoon = 1;

        public BatchWrapper(StockItemBatch batch)
        {
            Id = batch.Id;
            Date = batch.Date;
            Number = batch.Number;
            Expiry = batch.Expiry;
            DeliveredQuantity = batch.Quantity;
            Initials = batch.Initials;
            Usages = batch.Usages.Select(x => new UsageWrapper(x)).ToList();
        }

        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Number { get; set; }
        public DateOnly Expiry { get; set; }
        public int DeliveredQuantity { get; set; }
        public string Initials { get; set; }

        public int QuantityInStock => DeliveredQuantity - Usages.Sum(x => x.Quantity);
        public int QuantityInUse => Usages.Where(x => x.Disposed == null).Sum(x => x.Quantity);
        public int QuantityDisposed => Usages.Where(x => x.Disposed != null).Sum(x => x.Quantity);
        public bool Expired => Expiry < DateOnly.FromDateTime(DateTime.UtcNow);
        public bool ExpiredAfterOpening => Usages.Any(x => x.Expired);
        public bool ExpiresSoon => Expiry < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(DaysUntilExpiresSoon));
        public bool ExpiresSoonAfterOpening => Usages.Any(x => x.ExpiresSoon);

        public List<UsageWrapper> Usages { get; set; }
    }

    public class UsageWrapper
    {
        public UsageWrapper(StockItemBatchUsage usage)
        {
            Id = usage.Id;
            Date = usage.Date;
            Expiry = usage.Expiry;
            Quantity = usage.Quantity;
            SignedOutBy = usage.SignedOutBy;
            Disposed = usage.Disposed;
            DisposedBy = usage.DisposedBy;
        }

        public int Id { get; set; }
        public DateTime Date { get; set; }
        public DateOnly Expiry { get; set; }
        public int Quantity { get; set; }
        public string SignedOutBy { get; set; }

        public DateTime? Disposed { get; set; }
        public string? DisposedBy { get; set; }

        public bool Expired => Disposed == null && Expiry < DateOnly.FromDateTime(DateTime.UtcNow);
        public bool ExpiresSoon => Disposed == null && Expiry < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(BatchWrapper.DaysUntilExpiresSoon));
    }
}
