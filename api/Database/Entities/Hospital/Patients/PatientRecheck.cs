using Api.Database.Entities.Account;
using System.Text.Json.Serialization;
using Rechecker = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientRecheck : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Due { get; set; }
    public string Description { get; set; }
    public AccountRoles Roles { get; set; }

    public Rechecker? Rechecker { get; set; }
    public DateTime? Rechecked { get; set; }
    public string? Comments { get; set; }
}
