using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Exams;

public class ExamTreatmentInstruction : Entity
{
    [JsonIgnore]
    public Exam Exam { get; set; }

    public string Instructions { get; set; }
}
