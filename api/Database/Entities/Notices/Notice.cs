using Api.Database.Entities.Account;

namespace Api.Database.Entities.Notices;

public class Notice : Entity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime Created { get; set; }
    public AccountRoles Roles { get; set; }

    public Notice()
    {
    }

    public Notice(string title, string content, AccountRoles roles) : this(title, content, DateTime.UtcNow, roles)
    {
    }

    public Notice(string title, string content, DateTime created, AccountRoles roles)
    {
        Title = title;
        Content = content;
        Created = created;
        Roles = roles;
        if (roles == AccountRoles.None)
        {
            Roles =
                AccountRoles.BEACON_ANIMAL_HUSBANDRY |
                AccountRoles.BEACON_RECEPTIONIST |
                AccountRoles.BEACON_TEAM_LEADER |
                AccountRoles.BEACON_VET |
                AccountRoles.BEACON_VET_NURSE |
                AccountRoles.BEACON_AUXILIARY |
                AccountRoles.BEACON_WORK_EXPERIENCE |
                AccountRoles.BEACON_ORPHAN_FEEDER |
                AccountRoles.BEACON_RESCUER |
                AccountRoles.BEACON_CENTRE_MAINTENANCE |
                AccountRoles.BEACON_OFFICE_ADMIN;
        }
    }

    #region Behaviours

    public bool ShouldShow(Account.Account account)
    {
        if (account.Status == AccountStatus.Inactive) return false;
        return (account.Roles & Roles) != AccountRoles.None;
        // return Roles.HasFlag(account.Roles) || account.Roles.HasFlag(Roles);
    }

    #endregion
}
