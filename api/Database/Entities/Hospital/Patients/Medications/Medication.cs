namespace Api.Database.Entities.Hospital.Patients.Medications;

public class Medication : Entity
{
    public string VMDProductNo { get; set; }
    public string Name { get; set; }
    public string MAHolder { get; set; }
    public string Distributors { get; set; }
    public string VMNo { get; set; }
    public bool ControlledDrug { get; set; }
    public List<ActiveSubstance> ActiveSubstances { get; set; }
    public List<TargetSpecies> TargetSpecies { get; set; }
    public PharmaceuticalForm PharmaceuticalForm { get; set; }
    public TherapeuticGroup TherapeuticGroup { get; set; }
    public string SPCLink { get; set; }
    public string UKPARLink { get; set; }
    public string PAARLink { get; set; }
    public bool Used { get; set; }
}
