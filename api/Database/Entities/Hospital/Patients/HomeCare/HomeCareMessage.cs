using System.Text.Json.Serialization;
using Author = Api.Database.Entities.Account.Account;


namespace Api.Database.Entities.Hospital.Patients.HomeCare;

public class HomeCareMessage : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Author Author { get; set; }
    public DateTime Date { get; set; }
    public string Message { get; set; }
}
