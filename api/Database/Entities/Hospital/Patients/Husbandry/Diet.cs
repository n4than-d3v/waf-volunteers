namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public class Diet : Entity
{
    public string Name { get; set; }
    public string Description { get; set; }

    public List<Patient> Patients { get; set; }
}
