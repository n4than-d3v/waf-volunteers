using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients;

public class SpeciesVariant : Entity
{
    [JsonIgnore]
    public Species Species { get; set; }

    public string Name { get; set; }
    public string FriendlyName { get; set; }
    public int Order { get; set; }

    public int LongTermDays { get; set; }

    public string FeedingGuidance { get; set; }
}
