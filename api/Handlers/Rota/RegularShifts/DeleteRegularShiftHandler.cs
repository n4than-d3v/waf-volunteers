using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.RegularShifts;

public class DeleteRegularShift : IRequest<IResult>
{
    public int UserId { get; set; }
    public int ShiftId { get; set; }
}

public class DeleteRegularShiftHandler : IRequestHandler<DeleteRegularShift, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DeleteRegularShiftHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DeleteRegularShift request, CancellationToken cancellationToken)
    {
        var existing = await _repository.Get<RegularShift>(request.ShiftId, action: x => x.Include(y => y.Account));
        if (existing == null) return Results.NotFound();
        if (existing.Account.Id != request.UserId) return Results.BadRequest();

        _repository.Delete<RegularShift>(existing);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
