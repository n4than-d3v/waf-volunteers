using System.Text.Json.Serialization;

namespace Api.Database.Entities.Stock;

public class StockItemBatch : Entity
{
    [JsonIgnore]
    public StockItem Item { get; set; }

    public DateTime Date { get; set; }
    public string Number { get; set; }
    public DateOnly Expiry { get; set; }
    public int Quantity { get; set; }
    public string Initials { get; set; }

    public List<StockItemBatchUsage> Usages { get; set; }
}
