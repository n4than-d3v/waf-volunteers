using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardMessage : Entity
{
    [JsonIgnore]
    public Board Board { get; set; }

    public string Message { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}
