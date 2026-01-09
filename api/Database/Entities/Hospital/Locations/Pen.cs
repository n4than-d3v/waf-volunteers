using Api.Database.Entities.Hospital.Patients;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Locations;

public class Pen : Entity
{
    [JsonIgnore]
    public Area Area { get; set; }

    public string Code { get; set; }

    [JsonIgnore]
    public List<Patient> Patients { get; set; }

    [NotMapped]
    public string Reference => $"{Area.Code}-{Code}";

    [NotMapped]
    public bool Empty => !(Patients?.Any(x =>
        x.Status != PatientStatus.Dispositioned &&
        x.Status != PatientStatus.ReceivingHomeCare) ?? false);
}
