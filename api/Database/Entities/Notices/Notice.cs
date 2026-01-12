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
