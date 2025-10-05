namespace Api.Database.Entities.Rota;

public class Shift : Entity
{
    public DateOnly Date { get; set; }

    public DayOfWeek Day { get; set; }
    public TimeRange Time { get; set; }

    public List<ShiftParticipant> Participants { get; set; }
}
