using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public class SpeciesVariantFeeding : Entity, IFeeding
{
    [JsonIgnore]
    public SpeciesVariant SpeciesVariant { get; set; }

    public TimeOnly Time { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Food Food { get; set; }
}
