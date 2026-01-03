using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Medications;

public class TargetSpecies:Entity
{
    public string Name { get; set; }

    [JsonIgnore]
    public List<Medication> Medications { get; set; }
}
