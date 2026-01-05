using Api.Database.Entities.Hospital.Patients.Medications;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionMedication : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }

    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Medication Medication { get; set; }
    public AdministrationMethod AdministrationMethod { get; set; }

    public string Comments { get; set; }

    public string Frequency { get; set; }

    public List<PatientPrescriptionMedicationAdministration> Administrations { get; set; }
}
