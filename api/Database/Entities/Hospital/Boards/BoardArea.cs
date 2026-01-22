using Api.Database.Entities.Hospital.Locations;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardArea : Entity
{
    [JsonIgnore]
    public Board Board { get; set; }

    public Area Area { get; set; }
    public BoardAreaDisplayType DisplayType { get; set; }
}

public enum BoardAreaDisplayType
{
    Hidden = 0,
    ShowPatients = 1,
    SummarisePatients = 2
}
