namespace Api.Database.Entities.Learning.Husbandry;

public class HusbandryLearningCategory : Entity
{
    public string Name { get; set; }
    public string? YouTube { get; set; }

    public HusbandryLearningCategory? Parent { get; set; }
    public List<HusbandryLearningCategory> Children { get; set; }
}
