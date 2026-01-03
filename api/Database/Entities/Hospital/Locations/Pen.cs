using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Locations;

public class Pen : Entity
{
    [JsonIgnore]
    public Area Area { get; set; }

    public string Code { get; set; }
}
