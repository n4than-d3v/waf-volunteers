using Microsoft.EntityFrameworkCore;

namespace Api.Database.Entities;

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

    public Account(string username, string password, AccountStatus status, AccountRoles roles, string firstName, string lastName, string email, string phone, string addressLineOne, string addressLineTwo, string addressCity, string addressCounty, string addressPostcode, string pushSubscription, string salt)
    {
        Username = username;
        Password = password;
        Status = status;
        Roles = roles;
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

    #endregion
}

public enum AccountStatus
{
    Active,
    Inactive
}

[Flags]
public enum AccountRoles
{
    None = 1,
    Shift_AnimalHusbandry = 2,
    Shift_Reception = 4,
    Shift_TeamLeader = 8,
    Admin = 16
}
