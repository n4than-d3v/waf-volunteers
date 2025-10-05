namespace Api.Database.Entities.Rota;

public class ShiftParticipant : Entity
{
    public Shift Shift { get; set; }
    public Account.Account Account { get; set; }
    public Job Job { get; set; }
    public bool Confirmed { get; set; }

    public MissingReason? MissingReason { get; set; }
    public string? CustomMissingReason { get; set; }
}
