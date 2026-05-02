using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardMessage : Entity
{
    [JsonIgnore]
    public Board Board { get; set; }

    public string Message { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    public bool Emergency { get; set; }

    [NotMapped]
    public int ExposeBoardId => Board.Id;
    [NotMapped]
    public string ExposeBoardName => Board.Name;
    [NotMapped]
    public bool IsActive => Start <= DateTime.UtcNow && DateTime.UtcNow <= End;
}
