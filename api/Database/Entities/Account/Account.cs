using Microsoft.EntityFrameworkCore;

namespace Api.Database.Entities.Account;

[Index(nameof(Username), IsUnique = true)]
public class Account : Entity
{
    #region Sign in details

    public string Username { get; private set; }
    public string Password { get; private set; }
    public AccountStatus Status { get; private set; }
    public AccountRoles Roles { get; private set; }

    #endregion

    #region Encrypted properties

    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }

    public int? BeaconId { get; private set; }
    public string BeaconInfo { get; private set; }

    public string[] Cars { get; private set; }

    public string PushSubscription { get; private set; }

    #endregion

    public string Salt { get; private set; }

    #region Constructors

    public Account() { }

    public Account(string username, string password, AccountStatus status, AccountRoles roles, string firstName, string lastName, string email, string pushSubscription, string salt)
    {
        Username = username;
        Password = password;
        Status = status;
        Roles = roles;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        BeaconId = null;
        BeaconInfo = string.Empty;
        Cars = [];
        PushSubscription = pushSubscription;
        Salt = salt;
    }

    public Account(string username, string password, AccountStatus status, AccountRoles roles, string firstName, string lastName, string email, int? beaconId, string beaconInfo, string[] cars, string pushSubscription, string salt)
    {
        Username = username;
        Password = password;
        Status = status;
        Roles = roles;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        BeaconId = beaconId;
        BeaconInfo = beaconInfo;
        Cars = cars;
        PushSubscription = pushSubscription;
        Salt = salt;
    }

    #endregion

    #region Behaviours

    public void ResetPassword(string password)
    {
        Password = password;
    }

    public void UpdateBeaconId(int beaconId)
    {
        BeaconId = beaconId;
    }

    public void UpdatePersonalDetails(string firstName, string lastName, string email, string beaconInfo, string[] cars)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        BeaconInfo = beaconInfo;
        Cars = cars;
    }

    public void UpdatePersonalDetails(string firstName, string lastName, string email, string[] cars)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Cars = cars;
    }

    public void Subscribe(string pushSubscription)
    {
        PushSubscription = pushSubscription;
    }

    public void UpdateRoles(AccountRoles roles)
    {
        Roles = roles;
    }

    public void UpdateStatus(AccountStatus status)
    {
        Status = status;
    }

    #endregion
}

public enum AccountStatus
{
    Active = 0,
    Inactive = 1
}

[Flags]
public enum AccountRoles
{
    Volunteer = 1,
    Reception = 2,
    TeamLeader = 4,
    Vet = 8,
    Admin = 16,
    Clocking = 32
}
