using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Shifts;

public class RemoveWorkExperience : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemoveWorkExperienceHandler : IRequestHandler<RemoveWorkExperience, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveWorkExperienceHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveWorkExperience request, CancellationToken cancellationToken)
    {
        var workExperienceDate = await _repository.Get<WorkExperienceDate>(request.Id,
            action: x => x.Include(y => y.WorkExperience).ThenInclude(y => y.Dates));
        if (workExperienceDate == null) return Results.BadRequest();

        if (workExperienceDate.WorkExperience.Dates.Count == 1)
        {
            _repository.Delete(workExperienceDate.WorkExperience);
        }

        _repository.Delete(workExperienceDate);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
