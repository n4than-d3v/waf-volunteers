using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Boards;

public class BoardCustomPen : Entity
{
    public string Title { get; set; }
    public string[] Body { get; set; }
    public string[] Tags { get; set; }
    public DateOnly? ExpiresOn { get; set; }

    public List<BoardCustomPenTask> Tasks { get; set; }

    [JsonIgnore]
    public List<Board> Boards { get; set; }

    [NotMapped]
    public IEnumerable<int> ExposeBoardIds => Boards.Select(b => b.Id);
    [NotMapped]
    public IEnumerable<string> ExposeBoardNames => Boards.Select(b => b.Name);
    [NotMapped]
    public bool IsActive => ExpiresOn == null || DateOnly.FromDateTime(DateTime.UtcNow) <= ExpiresOn.Value;
}
