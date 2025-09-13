using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Database.Entities;

[Index(nameof(Username), IsUnique = true)]
public class Account : Entity
{
    #region Sign in details

    public string Username { get; private set; }
    public string Password { get; private set; }

    #endregion

    #region Encrypted properties

    #region Personal details

    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public string AddressLineOne { get; private set; }
    public string? AddressLineTwo { get; private set; }
    public string AddressCity { get; private set; }
    public string? AddressCounty { get; private set; }
    public string AddressPostcode { get; private set; }

    #endregion

    public string PushSubscription { get; private set; }

    #endregion

    public string Salt { get; private set; }

    #region Constructors

    public Account() { }

    public Account(string username, string password, string firstName, string lastName, string email, string phone, string addressLineOne, string addressLineTwo, string addressCity, string addressCounty, string addressPostcode, string pushSubscription, string salt)
    {
        Username = username;
        Password = password;
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
