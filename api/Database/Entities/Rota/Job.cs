using Api.Database.Entities.Account;

namespace Api.Database.Entities.Rota;

public class Job : Entity
{
    public string Name { get; set; }

    public AccountRoles BeaconAssociatedRole { get; set; }

    /// <summary>
    /// Specifically for team leaders, allowing them to view animal husbandry and receptionists on shift
    /// </summary>
    public bool ShowOthersInOtherJobsOnShift { get; set; }
}
