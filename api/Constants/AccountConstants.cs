using Api.Database.Entities;

namespace Api.Constants;

public static class AccountConstants
{
    public static class Claims
    {
        public const string Id = "Id";
        public const string Email = "Email";
        public const string FirstName = "FirstName";
        public const string LastName = "LastName";
        public const string Roles = "Roles";
    }

    public static class Roles
    {
        public const string None = "None";
        public const string Shift_AnimalHusbandry = "Shift_AnimalHusbandry";
        public const string Shift_Reception = "Shift_Reception";
        public const string Shift_TeamLeader = "Shift_TeamLeader";
        public const string Admin = "Admin";
    }
}
