using System.Text.Json.Serialization;
using Acc = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Learning.Auxiliary;

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
