using Tester = Api.Database.Entities.Account.Account;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Labs;

public class PatientBloodTest : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Tester Tester { get; set; }
    public DateTime Tested { get; set; }

    public string Comments { get; set; }

    public List<PatientBloodTestAttachment> Attachments { get; set; }
}
