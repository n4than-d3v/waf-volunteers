using Api.Database.Entities.Account;

namespace Api.Database.Entities.Rota;

public class Job : Entity
{
    public string Name { get; set; }

    public AccountRoles BeaconAssociatedRole { get; set; }
}
