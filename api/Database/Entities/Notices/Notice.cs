using Api.Database.Entities.Account;

namespace Api.Database.Entities.Notices;

public class Notice : Entity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime Created { get; set; }
    public AccountRoles Roles { get; set; }
    public DateTime SendAt { get; set; }
    public bool Sent { get; set; }

    public Notice()
    {
    }

    public Notice(string title, string content, AccountRoles roles, DateTime sendAt) : this(title, content, DateTime.UtcNow, roles, sendAt, false)
    {
    }

    public Notice(string title, string content, DateTime created, AccountRoles roles, DateTime sendAt, bool sent)
    {
        Title = title;
        Content = content;
        Created = created;
        Roles = roles;
        SendAt = sendAt;
        Sent = sent;
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
                AccountRoles.BEACON_OFFICE_ADMIN |
                AccountRoles.BEACON_HOUSE_KEEPER;
        }
    }

    #region Behaviours

    public bool ShouldShow(Account.Account account)
    {
        if (!Sent) return false;
        if (account.Status == AccountStatus.Inactive) return false;
        return (account.Roles & Roles) != AccountRoles.None;
        // return Roles.HasFlag(account.Roles) || account.Roles.HasFlag(Roles);
    }

    #endregion
}
