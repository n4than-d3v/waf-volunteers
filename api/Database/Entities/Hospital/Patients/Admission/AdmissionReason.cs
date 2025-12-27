namespace Api.Database.Entities.Hospital.Patients.Admission;

public class AdmissionReason : Entity
{
    public string Description { get; set; }

    public List<Patient> Patients { get; set; }
}
