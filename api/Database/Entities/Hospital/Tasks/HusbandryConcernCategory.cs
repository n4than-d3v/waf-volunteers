
namespace Api.Database.Entities.Hospital.Tasks;

public class HusbandryConcernCategory : Entity
{
    public string Description { get; set; }

    public List<HusbandryConcernReason> Reasons { get; set; }
}
