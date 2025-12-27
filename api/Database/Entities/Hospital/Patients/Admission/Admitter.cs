namespace Api.Database.Entities.Hospital.Patients.Admission;

public class Admitter : Entity
{
    public int BeaconId { get; set; }

    public string FullName { get; set; }
    public string Address { get; set; }
    public string Telephone { get; set; }
    public string Email { get; set; }

    public string Salt { get; set; }
}
