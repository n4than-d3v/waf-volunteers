using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public class QuarantineReason : Entity
{
    public string Name { get; set; }
    public int Order { get; set; }

    [JsonIgnore]
    public List<Patient> Patients { get; set; }
}
