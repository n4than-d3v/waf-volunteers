using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Outcome;

public class DispositionReason : Entity
{
    public string Description { get; set; }

    public string Communication { get; set; }

    [JsonIgnore]
    public List<Patient> Patients { get; set; }
}
