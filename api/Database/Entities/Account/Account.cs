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

    public DateOnly CreationDate { get; private set; }

    #region Encrypted properties

    #region Personal details

    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public string AddressLineOne { get; private set; }
    public string AddressLineTwo { get; private set; }
    public string AddressCity { get; private set; }
    public string AddressCounty { get; private set; }
    public string AddressPostcode { get; private set; }

    #endregion

    public string PushSubscription { get; private set; }

    #endregion

    public string Salt { get; private set; }

    #region Constructors

    public Account() { }

    public Account(string username, string password, AccountStatus status, AccountRoles roles, DateOnly creationDate, string firstName, string lastName, string email, string phone, string addressLineOne, string addressLineTwo, string addressCity, string addressCounty, string addressPostcode, string pushSubscription, string salt)
    {
        Username = username;
        Password = password;
        Status = status;
        Roles = roles;
        CreationDate = creationDate;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        AddressLineOne = addressLineOne;
        AddressLineTwo = addressLineTwo;
        AddressCity = addressCity;
        AddressCounty = addressCounty;
        AddressPostcode = addressPostcode;
        PushSubscription = pushSubscription;
        Salt = salt;
    }

    #endregion

    #region Behaviours

    public void ResetPassword(string password)
    {
        Password = password;
    }

    public void UpdatePersonalDetails(string firstName, string lastName, string email, string phone, string addressLineOne, string addressLineTwo, string addressCity, string addressCounty, string addressPostcode)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        AddressLineOne = addressLineOne;
        AddressLineTwo = addressLineTwo;
        AddressCity = addressCity;
        AddressCounty = addressCounty;
        AddressPostcode = addressPostcode;
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
    Admin = 16
}
