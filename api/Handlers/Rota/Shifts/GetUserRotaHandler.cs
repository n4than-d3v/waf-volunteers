using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Shifts;

public class GetUserRota : IRequest<IResult>
{
    public int? UserId { get; set; }
}

public class GetUserRotaHandler : IRequestHandler<GetUserRota, IResult>
{
    private const int RegularShiftsDaysInAdvance = 5 * 7; // 5 weeks
    private const int UrgentShiftsDaysInAdvance = 10; // 10 days

    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _context;

    public GetUserRotaHandler(IDatabaseRepository repository, IUserContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<IResult> Handle(GetUserRota request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;
        var now = DateOnly.FromDateTime(DateTime.UtcNow);

        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);

        var regularShifts = await _repository.GetAll<RegularShift>(
            x => x.Account.Id == userId, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));

        var yourAttendance = await _repository.GetAll<Attendance>(
            x => now <= x.Date && x.Account.Id == userId, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

        var totalAttendance = await _repository.GetAll<Attendance>(
            x => now <= x.Date, tracking: false,
            action: x => x.Include(y => y.Time).Include(y => y.Job));

        var times = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false,
            action: x => x.Include(y => y.Time).Include(y => y.Job));

        var nextShift = yourAttendance.Where(p => p.Confirmed).OrderBy(p => p.Date).FirstOrDefault();

        var rota = new List<RotaItem>();
        var urgentShifts = new List<UrgentShift>();

        var allowedJobIds = regularShifts.Select(x => x.Job.Id).Distinct().ToList();

        for (int i = 0; i <= RegularShiftsDaysInAdvance; i++)
        {
            var date = now.AddDays(i);
            var regularShiftsOnThisDay = regularShifts.Where(r => r.Day == date.DayOfWeek);
            if (!regularShiftsOnThisDay.Any()) continue;

            foreach (var regularShiftOnThisDay in regularShiftsOnThisDay.OrderBy(r => r.Time.Start))
            {
                var regularShiftAttendance = yourAttendance.FirstOrDefault(p =>
                        p.Date == date &&
                        p.Time.Id == regularShiftOnThisDay.Time.Id &&
                        p.Job.Id == regularShiftOnThisDay.Job.Id);

                rota.Add(new RotaItem
                {
                    Date = date,
                    Time = regularShiftOnThisDay.Time,
                    Job = regularShiftOnThisDay.Job,
                    Confirmed = regularShiftAttendance?.Confirmed,
                    MissingReason = regularShiftAttendance?.MissingReason,
                    CustomMissingReason = regularShiftAttendance?.CustomMissingReason,
                });
            }
        }

        for (int i = 0; i <= UrgentShiftsDaysInAdvance; i++)
        {
            var date = now.AddDays(i);

            foreach (var time in times)
            {
                var relevantRequirements = requirements.Where(x =>
                    x.Day == date.DayOfWeek &&
                    x.Time.Id == time.Id &&
                    allowedJobIds.Contains(x.Job.Id));
                if (!relevantRequirements.Any()) continue;

                foreach (var relevantRequirement in relevantRequirements)
                {
                    bool Attending(Attendance x) =>
                        x.Date == date &&
                        x.Time.Id == time.Id &&
                        x.Job.Id == relevantRequirement.Job.Id &&
                        x.Confirmed;

                    var attendance = totalAttendance.Count(Attending);
                    var isUserAttending = yourAttendance.Any(Attending);

                    if (attendance < relevantRequirement.Minimum || isUserAttending)
                    {
                        urgentShifts.Add(new UrgentShift
                        {
                            Date = date,
                            Job = relevantRequirement.Job,
                            Time = time,
                            Coming = attendance,
                            Required = relevantRequirement.Minimum,
                            Confirmed = isUserAttending ? true : null
                        });
                    }
                }
            }
        }

        return Results.Ok(new
        {
            regularShifts = regularShifts.Select(regularShift =>
            new
            {
                regularShift.Day,
                regularShift.Job,
                regularShift.Time
            }),
            nextShift,
            rota,
            urgentShifts,
            missingReasons
        });
    }

    public class RotaItem
    {
        public DateOnly Date { get; set; }
        public TimeRange Time { get; set; }
        public Job Job { get; set; }
        public bool? Confirmed { get; set; }
        public MissingReason? MissingReason { get; set; }
        public string? CustomMissingReason { get; set; }
    }

    public class UrgentShift
    {
        public DateOnly Date { get; set; }
        public TimeRange Time { get; set; }
        public Job Job { get; set; }
        public bool? Confirmed { get; set; }
        public int Coming { get; set; }
        public int Required { get; set; }
    }
}
