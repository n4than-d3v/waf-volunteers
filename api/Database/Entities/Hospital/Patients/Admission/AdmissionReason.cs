using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Admission;

public class AdmissionReason : Entity
{
    public string Description { get; set; }

    [JsonIgnore]
    public List<Patient> Patients { get; set; }
}
