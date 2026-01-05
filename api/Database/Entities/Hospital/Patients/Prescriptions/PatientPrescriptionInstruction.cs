using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionInstruction : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }

    public string Instructions { get; set; }

    public string Frequency { get; set; }

    public List<PatientPrescriptionInstructionAdministration> Administrations { get; set; }
}
