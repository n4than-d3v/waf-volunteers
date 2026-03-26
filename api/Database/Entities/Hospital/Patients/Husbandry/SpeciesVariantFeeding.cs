using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public class SpeciesVariantFeeding : Entity, IFeeding
{
    [JsonIgnore]
    public SpeciesVariant SpeciesVariant { get; set; }

    public string Time { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Food Food { get; set; }
    public bool TopUp { get; set; }
    public string? Notes { get; set; }
    public string? Dish { get; set; }
}
