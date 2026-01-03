using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients;

public class SpeciesAge : Entity
{
    [JsonIgnore]
    public Species Species { get; set; }

    public string Name { get; set; }
    public SpeciesVariant AssociatedVariant { get; set; }
}
