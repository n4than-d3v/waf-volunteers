using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.Assignments.Areas;

public class UpdateAssignableAreas : IRequest<IResult>
{
    public AssignableArea[] AssignableAreas { get; set; }

    public class AssignableArea
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }
}

public class UpdateAssignableAreasHandler : IRequestHandler<UpdateAssignableAreas, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateAssignableAreasHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateAssignableAreas request, CancellationToken cancellationToken)
    {
        var existingAssignableAreas = await _repository.GetAll<AssignableArea>(x => true);

        foreach (var assignableArea in existingAssignableAreas)
        {
            var updatedAssignableArea = request.AssignableAreas.FirstOrDefault(j => j.Id == assignableArea.Id);
            if (updatedAssignableArea != null)
            {
                // Update existing assignable area details
                assignableArea.Name = updatedAssignableArea.Name;
            }
            else
            {
                // Delete assignable areas that no longer exist
                _repository.Delete(assignableArea);
            }
        }

        foreach (var assignableArea in request.AssignableAreas.Where(j => j.Id == null))
        {
            // Create new assignable areas
            _repository.Create(new AssignableArea { Name = assignableArea.Name });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
