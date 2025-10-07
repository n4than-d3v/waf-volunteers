using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota;

public class ViewRota : IRequest<IResult>
{
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
}

public class ViewRotaHandler : IRequestHandler<ViewRota, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewRotaHandler(IDatabaseRepository databaseRepository, IEncryptionService encryptionService)
    {
        _repository = databaseRepository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewRota request, CancellationToken cancellationToken)
    {
        if (request.End <= request.Start) return Results.BadRequest();

        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);

        var regularShifts = await _repository.GetAll<RegularShift>(
            x => true, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));

        var totalAttendance = await _repository.GetAll<Attendance>(
            x => request.Start <= x.Date && x.Date <= request.End, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));

        var times = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        var jobs = await _repository.GetAll<Job>(x => true, tracking: false);
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false,
            action: x => x.Include(y => y.Time).Include(y => y.Job));

        var days = new List<Day>();

        for (var date = request.Start; date <= request.End; date = date.AddDays(1))
        {
            var day = new Day
            {
                Date = date,
                Shifts = []
            };
            days.Add(day);

            foreach (var time in times)
            {
                var shift = new Day.DayShift
                {
                    Time = time,
                    Jobs = []
                };
                day.Shifts.Add(shift);

                foreach (var job in jobs)
                {
                    var requirement = requirements.FirstOrDefault(x =>
                        x.Day == date.DayOfWeek &&
                        x.Time.Id == time.Id &&
                        x.Job.Id == job.Id);

                    var minimum = requirement?.Minimum ?? 0;

                    var dayShiftJob = new Day.DayShift.DayShiftJob
                    {
                        Job = job,
                        Volunteers = [],
                        Required = minimum
                    };
                    shift.Jobs.Add(dayShiftJob);

                    foreach (var regular in regularShifts.Where(x => x.Day == date.DayOfWeek && x.Time.Id == time.Id && x.Job.Id == job.Id))
                    {
                        var account = regular.Account;
                        var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
                        var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
                        dayShiftJob.Volunteers.Add(new Day.DayShift.DayShiftJob.DayShiftJobVolunteer
                        {
                            Id = account.Id,
                            Name = firstName,
                            FullName = $"{firstName} {lastName}",
                            IsRegularShift = true,
                            Confirmed = null
                        });
                    }

                    foreach (var confirmation in totalAttendance.Where(x => x.Date == date && x.Time.Id == time.Id && x.Job.Id == job.Id))
                    {
                        var regular = dayShiftJob.Volunteers.FirstOrDefault(x => x.Id == confirmation.Account.Id);
                        if (regular != null)
                        {
                            regular.Confirmed = confirmation.Confirmed;
                            regular.MissingReason = confirmation.MissingReason;
                            regular.CustomMissingReason = confirmation.CustomMissingReason;
                        }
                        else
                        {
                            var account = confirmation.Account;
                            var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
                            var lastName = _encryptionService.Decrypt(account.LastName, account.Salt); dayShiftJob.Volunteers.Add(new Day.DayShift.DayShiftJob.DayShiftJobVolunteer
                            {
                                Id = account.Id,
                                Name = firstName,
                                FullName = $"{firstName} {lastName}",
                                IsRegularShift = false,
                                Confirmed = confirmation.Confirmed,
                                MissingReason = confirmation.MissingReason,
                                CustomMissingReason = confirmation.CustomMissingReason
                            });
                        }
                    }
                }

            }
        }

        return Results.Ok(days);
    }

    public class Day
    {
        public DateOnly Date { get; set; }
        public List<DayShift> Shifts { get; set; }

        public class DayShift
        {
            public TimeRange Time { get; set; }
            public List<DayShiftJob> Jobs { get; set; }

            public class DayShiftJob
            {
                public Job Job { get; set; }
                public List<DayShiftJobVolunteer> Volunteers { get; set; }
                public int Required { get; set; }
                public bool Enough => Required <= Volunteers.Count(x => x.Confirmed ?? false);

                public class DayShiftJobVolunteer
                {
                    public int Id { get; set; }
                    public string Name { get; set; }
                    public string FullName { get; set; }
                    public bool IsRegularShift { get; set; }
                    public bool? Confirmed { get; set; }
                    public MissingReason? MissingReason { get; set; }
                    public string? CustomMissingReason { get; set; }
                }
            }
        }
    }
}
