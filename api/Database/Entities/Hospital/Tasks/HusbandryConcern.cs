
using Api.Database.Entities.Hospital.Locations;

namespace Api.Database.Entities.Hospital.Tasks;

public class HusbandryConcern : Entity
{
    public Pen Pen { get; set; }
    public HusbandryConcernReason Reason { get; set; }
    public DateTime Raised { get; set; }
    public bool Checked { get; set; }
}