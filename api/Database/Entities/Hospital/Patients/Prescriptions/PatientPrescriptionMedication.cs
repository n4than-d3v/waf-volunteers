using Api.Database.Entities.Hospital.Patients.Medications;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionMedication : PatientPrescriptionBase<PatientPrescriptionMedicationAdministration>
{
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Medication Medication { get; set; }
    public MedicationConcentration MedicationConcentration { get; set; }
    public AdministrationMethod AdministrationMethod { get; set; }
    public string Comments { get; set; }
}
