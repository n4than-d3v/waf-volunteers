using System.Text.Json.Serialization;

namespace Api.Database.Entities.Notices;

public class NoticeQuestion : Entity
{
    public string Title { get; set; }
    public bool AllowMultiple { get; set; }
    public bool AllowOther { get; set; }
    public string[] Answers { get; set; }

    [JsonIgnore]
    public Notice Notice { get; set; }

    public List<NoticeQuestionResponse> Responses { get; set; }
}
