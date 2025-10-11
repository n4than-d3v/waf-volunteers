namespace Api.Configuration;

public class RotaSettings
{
    public int RegularShiftsDaysInAdvance { get; set; }
    public int UrgentShiftsDaysInAdvance { get; set; }
    public int NotifyUnconfirmedRegularShiftsDaysInAdvance { get; set; }
    public int NotifyUnconfirmedUrgentShiftsDaysInAdvance { get; set; }
}
