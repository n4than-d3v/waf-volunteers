using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Medications;

public class MedicationConcentration : Entity
{
    [JsonIgnore]
    public Medication Medication { get; set; }

    public string Form { get; set; }
    public double ConcentrationValue { get; set; }
    public string ConcentrationUnit { get; set; }
    public string DefaultUnit { get; set; }
    public List<MedicationConcentrationSpeciesDose> SpeciesDoses { get; set; }
}
