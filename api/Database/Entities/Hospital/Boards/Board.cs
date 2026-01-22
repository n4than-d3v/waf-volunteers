namespace Api.Database.Entities.Hospital.Boards;

public class Board : Entity
{
    public string Name { get; set; }

    public List<BoardArea> Areas { get; set; }
    public List<BoardMessage> Messages { get; set; }
}
