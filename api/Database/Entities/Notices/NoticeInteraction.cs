namespace Api.Database.Entities.Notices;
using Account = Account.Account;

public class NoticeInteraction : Entity
{
    public Notice Notice { get; set; }
    public Account Account { get; set; }
    public DateTime Opened { get; set; }
    public DateTime? Closed { get; set; }
}
