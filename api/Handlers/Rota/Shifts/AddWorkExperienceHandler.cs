using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class AddWorkExperience : IRequest<IResult>
{
    public string Name { get; set; }
    public List<DateNotes> Dates { get; set; }

    public class DateNotes
    {
        public DateOnly Date { get; set; }
        public string Notes { get; set; }
    }
}

public class AddWorkExperienceHandler : IRequestHandler<AddWorkExperience, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddWorkExperienceHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddWorkExperience request, CancellationToken cancellationToken)
    {
        var workExperience = new WorkExperience
        {
            Name = request.Name,
            Dates = []
        };

        foreach (var date in request.Dates)
        {
            workExperience.Dates.Add(new WorkExperienceDate
            {
                WorkExperience = workExperience,
                Date = date.Date,
                Notes = date.Notes
            });
        }

        _repository.Create(workExperience);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
