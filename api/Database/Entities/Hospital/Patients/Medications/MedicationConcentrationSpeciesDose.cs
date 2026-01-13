using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Medications;

public class MedicationConcentrationSpeciesDose : Entity
{
    [JsonIgnore]
    public MedicationConcentration MedicationConcentration { get; set; }

    public Species? Species { get; set; }
    // or
    public SpeciesType? SpeciesType { get; set; }

    public double DoseMgKgRangeStart { get; set; }
    public double DoseMgKgRangeEnd { get; set; }
    public double DoseMlKgRangeStart { get; set; }
    public double DoseMlKgRangeEnd { get; set; }
    public AdministrationMethod? AdministrationMethod { get; set; }
    public string? Frequency { get; set; }
    public string Notes { get; set; }
}
