namespace Api.Database.Entities.Rota;

public class WorkExperience : Entity
{
    public string Name { get; set; }
    public List<WorkExperienceDate> Dates { get; set; }
}
