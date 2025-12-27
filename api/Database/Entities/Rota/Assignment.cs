namespace Api.Database.Entities.Rota;

public class Assignment : Entity
{
    public Attendance Attendance { get; set; }
    public AssignableArea Area { get; set; }
}
