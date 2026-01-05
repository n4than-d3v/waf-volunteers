using System.Text.Json.Serialization;
using Requester = Api.Database.Entities.Account.Account;
using Responder = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients.HomeCare;

public class HomeCareRequest : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Requester Requester { get; set; }
    public DateTime Requested { get; set; }
    public string Notes { get; set; }

    public Responder? Responder { get; set; }
    public DateTime? Responded { get; set; }
    public DateTime? Pickup { get; set; }

    public DateTime? Dropoff { get; set; }
}
