using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.HomeCare;

public class HomeCareMessageAttachment : Entity
{
    [JsonIgnore]
    public HomeCareMessage HomeCareMessage { get; set; }

    public string FileName { get; set; }
    public string ContentType { get; set; }
}
