using Api.Database.Entities.Hospital.Locations;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientMovement : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateTime Moved { get; set; }
    public Pen From { get; set; }
    public Pen To { get; set; }
}
