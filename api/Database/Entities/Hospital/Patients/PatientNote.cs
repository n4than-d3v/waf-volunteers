using Api.Database.Entities.Hospital.Patients.Exams;
using System.Text.Json.Serialization;
using Noter = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientNote : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Noter Noter { get; set; }
    public DateTime Noted { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public string Comments { get; set; }

    public List<PatientNoteAttachment> Attachments { get; set; }
}
