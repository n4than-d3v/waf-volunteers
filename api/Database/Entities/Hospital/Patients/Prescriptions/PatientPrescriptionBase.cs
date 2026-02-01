using Api.Database.Entities.Hospital.Locations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public abstract class PatientPrescriptionBase<TAdministration> : Entity
    where TAdministration : PatientPrescriptionAdministrationBase
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public string Frequency { get; set; }

    public List<TAdministration> Administrations { get; set; }

    [NotMapped]
    public int ViewPatientId => Patient.Id;
    [NotMapped]
    public string Reference => Patient.Reference;
    [NotMapped]
    public string UniqueIdentifier => Patient.UniqueIdentifier;
    [NotMapped]
    public Species Species => Patient.Species;
    [NotMapped]
    public SpeciesVariant Variant => Patient.SpeciesVariant;
    [NotMapped]
    public Pen Pen => Patient.Pen;

    DateOnly _today = DateOnly.FromDateTime(DateTime.Now);
    internal void SetToday(DateOnly date)
    {
        _today = date;

    }

    /// <summary>
    /// Number of times a prescription must be successfully administered today
    /// </summary>
    [NotMapped]
    public int AdministerToday
    {
        get
        {
            // One time
            // Every x y
            // x times per y

            double everyHours = 0;

            int times = 0;

            if (Frequency.StartsWith("Every"))
            {
                var split = Frequency.Replace("Every ", "").Trim().Split(' ');
                int.TryParse(split[0], out int x);
                string y = split[1];
                if (y == "hours") everyHours = x;
                if (y == "days") everyHours = x * 24;
                if (y == "weeks") everyHours = x * 24 * 7;
            }

            if (Frequency.Contains("times per"))
            {
                var split = Frequency.Replace("times per ", "").Trim().Split(' ');
                int.TryParse(split[0], out int x);
                string y = split[1];
                if (y == "hour") everyHours = 1d / x;
                if (y == "day") everyHours = 24d / x;
                if (y == "week") everyHours = (24d * 7d) / x;
            }

            if (Frequency == "One time")
            {
                if (!Administrations.Any()) return 1;
                return AdministeredToday;
            }

            var start = new DateTime(Start, new TimeOnly(0, 0, 0));
            var end = new DateTime(End, new TimeOnly(23, 59, 59));

            var todayStart = new DateTime(_today, new TimeOnly(0, 0, 0));
            var todayEnd = new DateTime(_today, new TimeOnly(23, 59, 59));

            var current = start;
            while (current <= end)
            {
                if (todayStart <= current && current <= todayEnd)
                {
                    times++;
                }
                current = current.AddHours(everyHours);
            }

            return times;
        }
    }

    /// <summary>
    /// Number of times a prescription has been successfully administered today
    /// </summary>
    [NotMapped]
    public int AdministeredToday
    {
        get
        {
            var todayStart = new DateTime(_today, new TimeOnly(0, 0, 0));
            var todayEnd = new DateTime(_today, new TimeOnly(23, 59, 59));
            return Administrations.Count(x => x.Success && todayStart <= x.Administered && x.Administered <= todayEnd);
        }
    }
}
