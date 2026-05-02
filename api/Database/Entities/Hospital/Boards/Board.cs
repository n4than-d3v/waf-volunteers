namespace Api.Database.Entities.Hospital.Boards;

public class Board : Entity
{
    public string Name { get; set; }

    public bool ForBirds { get; set; }
    public bool SumUp { get; set; }

    public List<BoardArea> Areas { get; set; }
    public List<BoardMessage> Messages { get; set; }
    public List<BoardCustomPen> CustomPens { get; set; }
}
