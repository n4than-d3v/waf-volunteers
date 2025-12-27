namespace Api.Database.Entities.Hospital.Patients.Exams;

public class ExamTreatmentInstruction : Entity
{
    public Exam Exam { get; set; }

    public string Instructions { get; set; }
}
