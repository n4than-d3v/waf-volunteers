using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Labs;

public class PatientBloodTestAttachment : Entity
{
    [JsonIgnore]
    public PatientBloodTest PatientBloodTest { get; set; }

    public string FileName { get; set; }
    public string ContentType { get; set; }

    [JsonIgnore]
    public byte[] Data { get; set; }
}
