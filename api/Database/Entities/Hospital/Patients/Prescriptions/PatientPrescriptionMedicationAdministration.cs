using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionMedicationAdministration : PatientPrescriptionAdministrationBase
{
    [JsonIgnore]
    public PatientPrescriptionMedication PatientPrescriptionMedication { get; set; }
}
