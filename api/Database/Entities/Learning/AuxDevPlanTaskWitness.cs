using Acc = Api.Database.Entities.Account.Account;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Learning;

public class AuxDevPlanTaskWitness : Entity
{
    [JsonIgnore]
    public AuxDevPlanTask Task { get; set; }

    public DateTime Date { get; set; }
    public Acc PerformedBy { get; set; }
    public Acc WitnessedBy { get; set; }

    public string Notes { get; set; }
    public bool SignedOff { get; set; }
}
