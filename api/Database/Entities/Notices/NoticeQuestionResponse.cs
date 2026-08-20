using System.Text.Json.Serialization;
using Responder = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Notices;

public class NoticeQuestionResponse : Entity
{
    [JsonIgnore]
    public NoticeQuestion Question { get; set; }
    [JsonIgnore]
    public Responder Responder { get; set; }
    public DateTime Responded { get; set; }
    public string[] Answers { get; set; }

    public int ViewQuestionId => Question?.Id ?? 0;
}
