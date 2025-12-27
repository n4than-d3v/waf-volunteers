using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.RegularShifts;

public class GetRegularShifts : IRequest<IResult>
{
    public int? UserId { get; set; }
}

public class GetRegularShiftsHandler : IRequestHandler<GetRegularShifts, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _context;

    public GetRegularShiftsHandler(IDatabaseRepository repository, IUserContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<IResult> Handle(GetRegularShifts request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;

        var regularShifts = await _repository.GetAll<RegularShift>(x => x.Account.Id == userId,
            tracking: false,
            action: x => x
                .Include(y => y.Account)
                .Include(y => y.Time)
                .Include(y => y.Job));

        return Results.Ok(regularShifts);
    }
}
