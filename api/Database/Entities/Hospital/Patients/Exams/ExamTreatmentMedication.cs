using Api.Database.Entities.Hospital.Patients.Medications;

namespace Api.Database.Entities.Hospital.Patients.Exams;

public class ExamTreatmentMedication : Entity
{
    public Exam Exam { get; set; }

    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Medication Medication { get; set; }
    public AdministrationMethod AdministrationMethod { get; set; }

    public string Comments { get; set; }
}
