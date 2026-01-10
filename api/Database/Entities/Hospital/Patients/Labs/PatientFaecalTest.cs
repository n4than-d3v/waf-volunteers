using Tester = Api.Database.Entities.Account.Account;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Labs;

public class PatientFaecalTest : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Tester Tester { get; set; }
    public DateTime Tested { get; set; }

    public bool? Float { get; set; }
    public bool? Direct { get; set; }

    public string Comments { get; set; }
}
