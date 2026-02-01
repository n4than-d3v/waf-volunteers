namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionInstruction : PatientPrescriptionBase<PatientPrescriptionInstructionAdministration>
{
    public string Instructions { get; set; }
}
