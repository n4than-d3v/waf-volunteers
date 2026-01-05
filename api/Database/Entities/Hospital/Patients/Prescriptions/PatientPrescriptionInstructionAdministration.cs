using System.Text.Json.Serialization;
using Administrator = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionInstructionAdministration : Entity
{
    [JsonIgnore]
    public PatientPrescriptionInstruction PatientPrescriptionInstruction { get; set; }

    public DateTime Administered { get; set; }
    public Administrator Administrator { get; set; }
    public bool Success { get; set; }
    public string Comments { get; set; }
}
