using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Misc.MissingReasons;

public class UpdateMissingReasons : IRequest<IResult>
{
    public MissingReason[] MissingReasons { get; set; }

    public class MissingReason
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }
}

public class UpdateMissingReasonsHandler : IRequestHandler<UpdateMissingReasons, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateMissingReasonsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateMissingReasons request, CancellationToken cancellationToken)
    {
        var existingMissingReasons = await _repository.GetAll<MissingReason>(x => true);

        foreach (var missingReason in existingMissingReasons)
        {
            var updatedMissingReason = request.MissingReasons.FirstOrDefault(j => j.Id == missingReason.Id);
            if (updatedMissingReason != null)
            {
                // Update existing reason details
                missingReason.Name = updatedMissingReason.Name;
            }
            else
            {
                // Delete reasons that no longer exist
                _repository.Delete(missingReason);
            }
        }

        foreach (var missingReason in request.MissingReasons.Where(j => j.Id == null))
        {
            // Create new reasons
            _repository.Create(new MissingReason { Name = missingReason.Name });
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
