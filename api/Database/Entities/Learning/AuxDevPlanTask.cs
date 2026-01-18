namespace Api.Database.Entities.Learning;

public class AuxDevPlanTask : Entity
{
    public string Name { get; set; }
    public string Explanation { get; set; }
    public string[] YouTube { get; set; }

    public List<AuxDevPlanTaskWitness> Witnesses { get; set; }
}
