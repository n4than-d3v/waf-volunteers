namespace Api.Database.Entities.Rota;

public class VisitorClocking : Entity
{
    public string Name { get; set; }
    public DateOnly Date { get; set; }

    public string? Car { get; set; }
    public TimeOnly In { get; set; }
    public TimeOnly? Out { get; set; }
}
