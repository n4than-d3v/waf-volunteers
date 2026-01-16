using System.Text.Json.Serialization;

namespace Api.Database.Entities.Stock;

public class StockItemBatchUsage : Entity
{
    [JsonIgnore]
    public StockItemBatch Batch { get; set; }

    public DateTime Date { get; set; }
    public DateOnly Expiry { get; set; }
    public int Quantity { get; set; }
    public string SignedOutBy { get; set; }

    public DateTime? Disposed { get; set; }
    public string? DisposedBy { get; set; }
}
