using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Medications;

public class MedicationConcentrationSpeciesDose : Entity
{
    [JsonIgnore]
    public MedicationConcentration MedicationConcentration { get; set; }

    public Species? Species { get; set; }
    // or
    public SpeciesType? SpeciesType { get; set; }

    public double DoseMgKg { get; set; }
    public double DoseMlKg { get; set; }
    public AdministrationMethod? AdministrationMethod { get; set; }
    public string? Frequency { get; set; }
    public string Notes { get; set; }
}
