namespace Api.Database.Entities.Rota;

public class WorkExperienceDate : Entity
{
    public WorkExperience WorkExperience { get; set; }

    public DateOnly Date { get; set; }
    public string Notes { get; set; }
}
