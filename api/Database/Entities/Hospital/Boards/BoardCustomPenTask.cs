using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardCustomPenTask : Entity
{
    [JsonIgnore]
    public BoardCustomPen BoardCustomPen { get; set; }

    public string Time { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public string FoodOrTask { get; set; }
    public bool TopUp { get; set; }
    public string? Notes { get; set; }
    public string? Dish { get; set; }
}
