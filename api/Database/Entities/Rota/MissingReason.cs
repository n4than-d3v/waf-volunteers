namespace Api.Database.Entities.Rota;

public class MissingReason : Entity
{
    public string Name { get; set; }

    public bool Deleted { get; set; } = false;
}
