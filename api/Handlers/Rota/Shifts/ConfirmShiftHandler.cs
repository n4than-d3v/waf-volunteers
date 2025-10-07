using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Shifts;

public class ConfirmShift : IRequest<IResult>
{
    public int? UserId { get; private set; }

    public DateOnly Date { get; set; }
    public int TimeId { get; set; }
    public int JobId { get; set; }

    public ConfirmShift WithId(int id)
    {
        UserId = id;
        return this;
    }
}

public class ConfirmShiftHandler : IRequestHandler<ConfirmShift, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _context;

    public ConfirmShiftHandler(IDatabaseRepository repository, IUserContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<IResult> Handle(ConfirmShift request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;

        var time = await _repository.Get<TimeRange>(request.TimeId);
        var job = await _repository.Get<Job>(request.JobId);
        var account = await _repository.Get<Account>(userId);

        var attendance = await _repository.Get<Attendance>(
            x => x.Date == request.Date && x.Time.Id == request.TimeId && x.Job.Id == request.JobId && x.Account.Id == userId,
            action: x => x.Include(y => y.Time).Include(y => y.Job).Include(y => y.Account));
        if (attendance == null)
        {
            _repository.Create(new Attendance
            {
                Date = request.Date,
                Time = time,
                Job = job,
                Account = account,
                Confirmed = true
            });
        }
        else
        {
            attendance.Confirmed = true;
            attendance.MissingReason = null;
            attendance.CustomMissingReason = null;
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
