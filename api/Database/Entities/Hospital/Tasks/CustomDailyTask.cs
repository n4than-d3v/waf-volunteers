
namespace Api.Database.Entities.Hospital.Tasks;

public class CustomDailyTask : Entity
{
    public string Location { get; set; }
    public string Message { get; set; }
    public DateTime? LastDone { get; set; }
}