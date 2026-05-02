using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardCustomPen : Entity
{
    [JsonIgnore]
    public Board Board { get; set; }

    public string Title { get; set; }
    public string[] Body { get; set; }
    public string[] Tags { get; set; }
    public DateOnly? ExpiresOn { get; set; }

    public List<BoardCustomPenTask> Tasks { get; set; }

    [NotMapped]
    public int ExposeBoardId => Board.Id;
    [NotMapped]
    public string ExposeBoardName => Board.Name;
    [NotMapped]
    public bool IsActive => ExpiresOn == null || DateOnly.FromDateTime(DateTime.UtcNow) <= ExpiresOn.Value;
}
