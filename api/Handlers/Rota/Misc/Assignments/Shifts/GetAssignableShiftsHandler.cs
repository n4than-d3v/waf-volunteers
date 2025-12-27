using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Misc.Assignments.Shifts;

public class GetAssignableShifts : IRequest<IResult>
{
}

public class GetAssignableShiftsHandler : IRequestHandler<GetAssignableShifts, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetAssignableShiftsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetAssignableShifts request, CancellationToken cancellationToken)
    {
        var assignableShifts = await _repository.GetAll<AssignableShift>(x => true,
            tracking: false,
            action: x => x
                .Include(y => y.Time)
                .Include(y => y.Job));

        return Results.Ok(assignableShifts);
    }
}
