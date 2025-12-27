namespace Api.Database.Entities.Hospital.Patients;

public class SpeciesVariant : Entity
{
    public Species Species { get; set; }

    public string Name { get; set; }

    public string FeedingGuidance { get; set; }
}
