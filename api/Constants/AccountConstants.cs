using Api.Database.Entities;

namespace Api.Constants;

public static class AccountConstants
{
    public static class Claims
    {
        public const string Id = "id";
        public const string Email = "email";
        public const string FirstName = "firstName";
        public const string LastName = "lastName";
        public const string Roles = "roles";
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
