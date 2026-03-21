using Api.Database.Entities.Hospital.Patients.Exams;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Author = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients.HomeCare;

public class HomeCareMessage : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Author Author { get; set; }
    public DateTime Date { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public string Message { get; set; }

    public List<HomeCareMessageAttachment> Attachments { get; set; }

    [NotMapped]
    public bool Me { get; set; }
}
