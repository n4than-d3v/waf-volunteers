namespace Api.Database.Entities.Hospital.Patients.Medications;

public class Medication : Entity
{
    public string ActiveSubstance { get; set; }
    public string[] Brands { get; set; }
    public string Notes { get; set; }
    public List<MedicationConcentration> Concentrations { get; set; }
}
