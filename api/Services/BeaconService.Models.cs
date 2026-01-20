namespace Api.Services;

public partial class BeaconService
{
    #region Patient admissions

    public class BeaconPatientAdmissionsFilterResults
    {
        public int total { get; set; }
        public List<Result> results { get; set; }

        public class Result
        {
            public PatientEntity entity { get; set; }
            public List<Reference> references { get; set; }
        }

        public class PatientEntity
        {
            public int id { get; set; }
            public DateTime created_at { get; set; }
            public string c_id_number { get; set; }
            public List<int> c_person { get; set; }
            public List<string> c_animal { get; set; }
            public string c_other_animal { get; set; }
            public string c_specific_animal { get; set; }
            public string c_alternative_address { get; set; }
            public List<string> c_animal_found_at_different_address { get; set; }
            public List<string> c_reason_for_admission { get; set; }
            public List<string> c_arrival_cage_pod { get; set; }
            public bool c_rescue { get; set; }
        }

        public class Reference
        {
            public PersonEntity entity { get; set; }
        }

        public class PersonEntity
        {
            public int id { get; set; }
            public Name name { get; set; }
            public List<Email> emails { get; set; }
            public List<PhoneNumber> phone_numbers { get; set; }
            public List<Address> address { get; set; }
        }

        public class Name
        {
            public string full { get; set; }
            public string last { get; set; }
            public string first { get; set; }
            public string prefix { get; set; }
        }

        public class Email
        {
            public string email { get; set; }
            public bool is_primary { get; set; }
        }

        public class PhoneNumber
        {
            public string number { get; set; }
            public bool is_primary { get; set; }
        }

        public class Address
        {
            public string city { get; set; }
            public object notes { get; set; }
            public string region { get; set; }
            public string country { get; set; }
            public double? latitude { get; set; }
            public double? longitude { get; set; }
            public bool is_primary { get; set; }
            public string postal_code { get; set; }
            public string country_code { get; set; }
            public string address_line_one { get; set; }
            public string address_line_two { get; set; }
            public string address_line_three { get; set; }
        }
    }

    #endregion

    #region Volunteers

    public class BeaconVolunteersFilterRequest
    {
        public const string VolunteerType = "Volunteer";

        public const string ActiveStatus = "Active";
        public const string FormerStatus = "Former";

        public BeaconVolunteersFilterRequestCondition[] filter_conditions { get; set; }

        public static BeaconVolunteersFilterRequest ActiveVolunteers = new BeaconVolunteersFilterRequest
        {
            filter_conditions = [
                new BeaconVolunteersFilterRequestCondition {
                    field = "type",
                    @operator = "contains",
                    value = [ VolunteerType ]
                },
                new BeaconVolunteersFilterRequestCondition {
                    field = "volunteer_status",
                    @operator = "contains",
                    value = [ ActiveStatus ]
                }
            ]
        };

        public static BeaconVolunteersFilterRequest FormerVolunteers = new BeaconVolunteersFilterRequest
        {
            filter_conditions = [
                new BeaconVolunteersFilterRequestCondition {
                    field = "type",
                    @operator = "contains",
                    value = [ VolunteerType ]
                },
                new BeaconVolunteersFilterRequestCondition {
                    field = "volunteer_status",
                    @operator = "contains",
                    value = [ FormerStatus ]
                }
            ]
        };

        public class BeaconVolunteersFilterRequestCondition
        {
            public string field { get; set; }
            public string @operator { get; set; }
            public string[] value { get; set; }
        }
    }

    public class BeaconVolunteersFilterResults
    {
        public int total { get; set; }
        public List<Result> results { get; set; }

        public class UpdateBeaconInfo : EntityBase
        {
        }

        public class BeaconInfo : EntityBase
        {
            public int id { get; set; }
            public List<string> type { get; set; }
            public List<Email> emails { get; set; }
            public List<string> volunteer_status { get; set; }
            public List<string> volunteer_availability { get; set; }
            public List<string> volunteer_roles { get; set; }
            public DateTime? c_volunteer_end_date { get; set; }
        }

        public class EntityBase
        {
            public Name name { get; set; }
            public List<PhoneNumber> phone_numbers { get; set; }
            public string title { get; set; }
            public List<string> gender { get; set; }
            public List<Address> address { get; set; }
            public string volunteer_notes { get; set; }
            public string emergency_contact_name { get; set; }
            public List<EmergencyContactPhone> emergency_contact_phone { get; set; }
            public string emergency_contact_relationship { get; set; }
            public string c_emergency_contact_name_2 { get; set; }
            public string c_emergency_contact_phone_2 { get; set; }
            public string c_emergency_contact_relationship_2 { get; set; }
            public string c_preferred_name { get; set; }
            public bool c_first_aid_trained { get; set; }
            public DateTime? c_first_aid_expiry_date { get; set; }
        }

        public class Name
        {
            public string full { get; set; }
            public string last { get; set; }
            public string first { get; set; }
            public string prefix { get; set; }
        }

        public class Email
        {
            public string email { get; set; }
            public bool is_primary { get; set; }
        }

        public class PhoneNumber
        {
            public string number { get; set; }
            public bool is_primary { get; set; }
        }

        public class EmergencyContactPhone
        {
            public string number { get; set; }
            public bool is_primary { get; set; }
        }

        public class Address
        {
            public string city { get; set; }
            public string region { get; set; }
            public string country { get; set; }
            public bool is_primary { get; set; }
            public string postal_code { get; set; }
            public string country_code { get; set; }
            public string address_line_one { get; set; }
            public string address_line_two { get; set; }
            public string address_line_three { get; set; }
        }

        public class Result
        {
            public BeaconInfo entity { get; set; }
        }
    }

    #endregion
}
