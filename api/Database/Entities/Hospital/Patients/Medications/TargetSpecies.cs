namespace Api.Database.Entities.Hospital.Patients.Medications;

public class TargetSpecies:Entity
{
    public string Name { get; set; }

    public List<Medication> Medications { get; set; }
}
