using Api.Database.Entities.Hospital.Patients;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Locations;

public class Pen : Entity
{
    [JsonIgnore]
    public Area Area { get; set; }

    public string Code { get; set; }
    public bool Deleted { get; set; }
    public PenCleanStatus CleanStatus { get; set; }
    public string? CustomBoardMessage { get; set; }

    [JsonIgnore]
    public List<Patient> Patients { get; set; }

    [NotMapped]
    public string Reference => $"{Area.Code}-{Code}";

    [NotMapped]
    public bool Empty => !(Patients?.Any(x =>
        x.Status != PatientStatus.Dispositioned &&
        x.Status != PatientStatus.ReceivingHomeCare) ?? false);
}

public enum PenCleanStatus
{
    None = 0,
    NeedsCleaning = 1,
    NeedsSettingUp = 2,
    ReadyToUse = 3
}