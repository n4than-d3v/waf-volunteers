using Api.Database.Entities.Hospital.Locations;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientMovement : Entity
{
    public Patient Patient { get; set; }
    public DateTime Moved { get; set; }
    public Pen From { get; set; }
    public Pen To { get; set; }
}
