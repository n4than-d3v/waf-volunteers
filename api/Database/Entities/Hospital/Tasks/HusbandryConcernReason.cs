
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Tasks;

public class HusbandryConcernReason : Entity
{
    [JsonIgnore]
    public HusbandryConcernCategory Category { get; set; }

    public string Description { get; set; }
}
