namespace Api.Database.Entities.Hospital.Patients;

public class Species : Entity
{
    public string Name { get; set; }

    public List<SpeciesAge> Ages { get; set; }
    public List<SpeciesVariant> Variants { get; set; }
}
