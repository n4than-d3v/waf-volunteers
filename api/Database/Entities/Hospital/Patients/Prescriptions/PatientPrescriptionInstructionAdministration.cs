using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionInstructionAdministration : PatientPrescriptionAdministrationBase
{
    [JsonIgnore]
    public PatientPrescriptionInstruction PatientPrescriptionInstruction { get; set; }
}
