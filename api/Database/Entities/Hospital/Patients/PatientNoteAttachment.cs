using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientNoteAttachment : Entity
{
    [JsonIgnore]
    public PatientNote PatientNote { get; set; }

    public string FileName { get; set; }
    public string ContentType { get; set; }
}
