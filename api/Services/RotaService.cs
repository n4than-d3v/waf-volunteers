using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using static Api.Services.UserRota.ShiftBase;

namespace Api.Services;

public interface IRotaService
{
    Task<IReadOnlyList<Day>> GetRotaAsync(DateOnly start, DateOnly end);
    Task<UserRota> GetVolunteerRotaAsync(DateOnly now, int userId);
    Task<IReadOnlyList<Report>> GetReportAsync(DateOnly start, DateOnly end);
}

public class RotaService : IRotaService
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    private readonly RotaSettings _settings;

    public RotaService(IDatabaseRepository repository, IEncryptionService encryptionService, IOptions<RotaSettings> settings)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _settings = settings.Value;
    }

    public async Task<IReadOnlyList<Report>> GetReportAsync(DateOnly start, DateOnly end)
    {
        var days = await GetRotaAsync(start, end);

        var clockings = await _repository.GetAll<AttendanceClocking>(
            x => start <= x.Attendance.Date && x.Attendance.Date <= end, tracking: false,
            action: x => x.Include(y => y.Attendance).ThenInclude(y => y.Account));

        return [.. days
            .SelectMany(d => d.Shifts)
            .SelectMany(s => s.Jobs)
            .SelectMany(j => j.Volunteers)
            .GroupBy(v => new { v.Id, v.FullName })
            .Select(g => {
                var report = new Report
                {
                    Id = g.Key.Id,
                    FullName = g.Key.FullName,
                    RegularUnresponded = g.Count(v => v.Type == AttendanceType.Regular && (v.Confirmed == null)),
                    RegularYes = g.Count(v => v.Type == AttendanceType.Regular && (v.Confirmed == true)),
                    RegularNo = g.Count(v => v.Type == AttendanceType.Regular && (v.Confirmed == false)),
                    RegularTotal = g.Count(v => v.Type == AttendanceType.Regular),
                    CameInRegular = clockings.Count(v => v.Attendance.Type == AttendanceType.Regular && v.Attendance.Account.Id == g.Key.Id),
                    UrgentYes = g.Count(v => (v.Type == AttendanceType.Urgent) && (v.Confirmed == true)),
                    UrgentNo = g.Count(v => (v.Type == AttendanceType.Urgent) && (v.Confirmed == false)),
                    CameInUrgent = clockings.Count(v => v.Attendance.Type == AttendanceType.Urgent && v.Attendance.Account.Id == g.Key.Id),
                    ExtraYes = g.Count(v => (v.Type == AttendanceType.Extra) && (v.Confirmed == true)),
                    ExtraNo = g.Count(v => (v.Type == AttendanceType.Extra) && (v.Confirmed == false)),
                    CameInExtra = clockings.Count(v => v.Attendance.Type == AttendanceType.Extra && v.Attendance.Account.Id == g.Key.Id)
                };

                report.RegularNoShows = report.RegularYes - report.CameInRegular;
                report.UrgentNoShows = report.UrgentYes - report.CameInUrgent;
                report.ExtraNoShows = report.ExtraYes - report.CameInExtra;

                return report;
            })
            .OrderBy(r => r.FullName)];
    }

    public async Task<IReadOnlyList<Day>> GetRotaAsync(DateOnly start, DateOnly end)
    {
        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);
        var regularShifts = await _repository.GetAll<RegularShift>(x => x.Account.Status == AccountStatus.Active, tracking: false, action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));
        var attendances = await _repository.GetAll<Attendance>(x => start <= x.Date && x.Date <= end, tracking: false, action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));
        var times = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        var jobs = await _repository.GetAll<Job>(x => true, tracking: false);
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false, action: x => x.Include(y => y.Time).Include(y => y.Job));
        var assignableShifts = await _repository.GetAll<AssignableShift>(x => true, tracking: false, action: x => x.Include(y => y.Time).Include(y => y.Job));
        var assignments = await _repository.GetAll<Assignment>(x => start <= x.Attendance.Date && x.Attendance.Date <= end, tracking: false, action: x => x.Include(y => y.Attendance).Include(y => y.Area));

        var days = new List<Day>();

        void UpdateDayShiftJobVolunteer(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer, Attendance confirmation)
        {
            volunteer.AttendanceId = confirmation.Id;
            volunteer.Confirmed = confirmation.Confirmed;
            volunteer.MissingReason = confirmation.MissingReason;
            volunteer.CustomMissingReason = confirmation.CustomMissingReason;
            volunteer.Type = confirmation.Type;

            var assignment = assignments.FirstOrDefault(x => x.Attendance.Id == confirmation.Id);
            volunteer.AreaId = assignment?.Area?.Id;
        }

        bool TryUpdateRegularDayShiftJobVolunteer(IReadOnlyList<Day.DayShift.DayShiftJob.DayShiftJobVolunteer> volunteers, Attendance confirmation)
        {
            var regular = volunteers.FirstOrDefault(x => x.Id == confirmation.Account.Id);
            if (regular == null) return false;

            UpdateDayShiftJobVolunteer(regular, confirmation);
            return true;
        }

        Day.DayShift.DayShiftJob.DayShiftJobVolunteer GetDayShiftJobVolunteer(Account account, AttendanceType type)
        {
            var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
            var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);

            return new Day.DayShift.DayShiftJob.DayShiftJobVolunteer
            {
                Id = account.Id,
                FirstName = firstName,
                LastName = lastName,
                FullName = $"{firstName} {lastName}",
                Confirmed = null,
                Type = type
            };
        }

        Day.DayShift.DayShiftJob GetDayShiftJob(DateOnly date, TimeRange time, Job job)
        {
            var requirement = requirements.FirstOrDefault(x => x.Day == date.DayOfWeek && x.Time.Id == time.Id && x.Job.Id == job.Id);
            var regulars = regularShifts.Where(x => date.IsOn(x.Day, x.Week) && x.Time.Id == time.Id && x.Job.Id == job.Id);
            var shiftAttendances = attendances.Where(x => x.Date == date && x.Time.Id == time.Id && x.Job.Id == job.Id);
            var isAssignable = assignableShifts.Any(x => date.IsOn(x.Day) && x.Time.Id == time.Id && x.Job.Id == job.Id);

            var volunteers = regulars.Select(x => GetDayShiftJobVolunteer(x.Account, AttendanceType.Regular)).ToList();

            foreach (var confirmation in shiftAttendances)
            {
                if (TryUpdateRegularDayShiftJobVolunteer(volunteers, confirmation)) continue;

                var volunteer = GetDayShiftJobVolunteer(confirmation.Account, confirmation.Type);
                UpdateDayShiftJobVolunteer(volunteer, confirmation);
                volunteers.Add(volunteer);
            }

            return new Day.DayShift.DayShiftJob
            {
                Job = job,
                Volunteers = volunteers,
                Required = requirement?.Minimum ?? 0,
                IsAssignable = isAssignable
            };
        }

        Day.DayShift GetDayShift(DateOnly date, TimeRange time)
        {
            var shift = new Day.DayShift
            {
                Time = time,
                Jobs = [.. jobs
                    .OrderBy(job => job.Id)
                    .Select(job => GetDayShiftJob(date, time, job))
                ]
            };

            var volunteers = shift.Jobs.SelectMany(x => x.Volunteers);
            foreach (var volunteer in volunteers)
            {
                var sameFirstName = volunteers.Where(x => x.FirstName == volunteer.FirstName);
                if (sameFirstName.Count() == 1)
                {
                    // There is only one on shift with this first name
                    volunteer.Name = volunteer.FirstName;
                }
                else
                {
                    // There is more than one on shift with this first name
                    bool nameSet = false;
                    for (int i = 1; i <= 5; i++)
                    {
                        if (sameFirstName.Count() == sameFirstName
                            .Select(x => $"{x.FirstName} {x.LastName[..i]}")
                            .Distinct()
                            .Count())
                        {
                            volunteer.Name = $"{volunteer.FirstName} {volunteer.LastName[..i]}";
                            nameSet = true;
                            break;
                        }
                    }
                    if (!nameSet)
                    {
                        volunteer.Name = $"{volunteer.FirstName} {volunteer.LastName}";
                    }
                }
            }

            return shift;
        }

        for (var date = start; date <= end; date = date.AddDays(1))
        {
            days.Add(new Day
            {
                Date = date,
                Week =
                    date.IsOn(DayOfWeek.Saturday)
                        ? (date.IsOn(DayOfWeek.Saturday, 1) ? 1 : 2)
                        : (date.IsOn(DayOfWeek.Sunday)
                            ? (date.IsOn(DayOfWeek.Sunday, 1) ? 1 : 2)
                            : null),
                Shifts = [.. times
                    .OrderBy(time => time.Id)
                    .Select(time => GetDayShift(date, time))
                ]
            });
        }

        return days;
    }

    public async Task<UserRota> GetVolunteerRotaAsync(DateOnly now, int userId)
    {
        var days = await GetRotaAsync(now, now.AddDays(Math.Max(_settings.RegularShiftsDaysInAdvance, _settings.UrgentShiftsDaysInAdvance)));
        var assignableAreas = await _repository.GetAll<AssignableArea>(x => true, tracking: false);
        var jobs = await _repository.GetAll<Job>(x => true, tracking: false);

        bool IsOtherComing(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => (volunteer.Confirmed == true) && (IsVolunteer(volunteer) == false);
        bool IsVolunteer(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => volunteer.Id == userId;
        bool IsVolunteerComing(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => IsVolunteer(volunteer) && volunteer.Confirmed == true;
        UserRota.Shift GetShift(Day day, Day.DayShift shift, Day.DayShift.DayShiftJob job, Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => new()
        {
            Date = day.Date,
            Time = shift.Time,
            Job = job.Job,
            Confirmed = volunteer.Confirmed,
            Type = volunteer.Type,
            MissingReason = volunteer.MissingReason,
            CustomMissingReason = volunteer.CustomMissingReason,
            Others = shift.Jobs
                .Where(j => j.Job.Id == job.Job.Id || job.Job.ShowOthersInJobIds.Contains(j.Job.Id))
                .SelectMany(j => j.Volunteers)
                .Where(IsOtherComing)
                .OrderBy(v => v.Name)
                .Select(v => new ShiftOther
                {
                    Name = v.Name,
                    Area = assignableAreas.FirstOrDefault(x => x.Id == v.AreaId)
                })
                .ToArray(),
            Area = assignableAreas.FirstOrDefault(x => x.Id == volunteer.AreaId)
        };
        UserRota.UrgentShift GetUrgentShift(Day day, Day.DayShift shift, Day.DayShift.DayShiftJob job)
        {
            var volunteer = job.Volunteers.FirstOrDefault(IsVolunteer);
            return new()
            {
                Date = day.Date,
                Time = shift.Time,
                Job = job.Job,
                Required = job.Required,
                Coming = job.Volunteers.Count(v => v.Confirmed == true),
                Confirmed = volunteer?.Confirmed,
                Type = volunteer?.Type ?? AttendanceType.Urgent,
                Others = shift.Jobs
                    .Where(j => j.Job.Id == job.Job.Id || job.Job.ShowOthersInJobIds.Contains(j.Job.Id))
                    .SelectMany(j => j.Volunteers)
                    .Where(IsOtherComing)
                    .OrderBy(v => v.Name)
                    .Select(v => new ShiftOther
                    {
                        Name = v.Name,
                        Area = assignableAreas.FirstOrDefault(x => x.Id == v.AreaId)
                    })
                    .ToArray(),
                Area = assignableAreas.FirstOrDefault(x => x.Id == volunteer?.AreaId)
            };
        }

        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);
        var userRegularShifts = await _repository.GetAll<RegularShift>(
            x => x.Account.Id == userId, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));
        var allowedJobIds = userRegularShifts
            .SelectMany(x =>
            {
                var list = new List<int>
                {
                    x.Job.Id
                };
                list.AddRange(x.Job.CanAlsoDoJobIds);
                return list;
            })
            .Distinct()
            .ToList();

        var maxDateForRegularShifts = now.AddDays(_settings.RegularShiftsDaysInAdvance);
        var regularShifts = days
            .OrderBy(d => d.Date)
            .Where(d => d.Date <= maxDateForRegularShifts)
            .SelectMany(d => d.Shifts.SelectMany(s => s.Jobs.SelectMany(j => j.Volunteers
                .Where(v => IsVolunteer(v) && v.Type == AttendanceType.Regular)
                .Select(v => GetShift(d, s, j, v)))))
            .ToList();

        var extraShifts = days
            .OrderBy(d => d.Date)
            .Where(d => d.Date <= maxDateForRegularShifts)
            .SelectMany(d => d.Shifts.SelectMany(s => s.Jobs.SelectMany(j => j.Volunteers
                .Where(v => IsVolunteer(v) && v.Type == AttendanceType.Extra)
                .Select(v => GetShift(d, s, j, v)))))
            .ToList();

        var maxDateForUrgentShifts = now.AddDays(_settings.UrgentShiftsDaysInAdvance);
        var urgentShifts = days
            .OrderBy(d => d.Date)
            .Where(d => d.Date <= maxDateForUrgentShifts)
            .SelectMany(d => d.Shifts.SelectMany(s => s.Jobs
                .Where(j => allowedJobIds.Contains(j.Job.Id) && ((j.Enough == false) || j.Volunteers.Any(v => IsVolunteerComing(v) && v.Type == AttendanceType.Urgent)))
                .Select(j => GetUrgentShift(d, s, j))))
            .ToList();

        var nextShift = days
            .OrderBy(d => d.Date)
            .SelectMany(d => d.Shifts
                .OrderBy(s => s.Time.Start)
                .SelectMany(s => s.Jobs.SelectMany(j => j.Volunteers.Where(IsVolunteerComing).Select(v => GetShift(d, s, j, v)))))
            .FirstOrDefault();

        return new()
        {
            Rota = regularShifts,
            UrgentShifts = urgentShifts,
            ExtraShifts = extraShifts,
            RegularShifts = userRegularShifts.Select(x => new UserRota.RegularShift { Day = x.Day, Job = x.Job, Time = x.Time, }).ToList(),
            MissingReasons = [.. missingReasons.OrderBy(x => x.Id)],
            NextShift = nextShift,
            AllowedJobs = jobs.Where(job => allowedJobIds.Contains(job.Id)).ToList()
        };
    }
}

#region Admin

public class Report
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public int RegularUnresponded { get; set; }
    public int RegularYes { get; set; }
    public int RegularNo { get; set; }
    public int RegularTotal { get; set; }
    public int CameInRegular { get; set; }
    public int RegularNoShows { get; set; }
    public int UrgentYes { get; set; }
    public int UrgentNo { get; set; }
    public int CameInUrgent { get; set; }
    public int UrgentNoShows { get; set; }
    public int ExtraYes { get; set; }
    public int ExtraNo { get; set; }
    public int CameInExtra { get; set; }
    public int ExtraNoShows { get; set; }
}

public class Day
{
    public DateOnly Date { get; set; }
    public int? Week { get; set; }
    public IReadOnlyList<DayShift> Shifts { get; set; }

    public class DayShift
    {
        public TimeRange Time { get; set; }
        public IReadOnlyList<DayShiftJob> Jobs { get; set; }
        public bool ShowOnRota => Jobs.Any(x => x.ShowOnRota);

        public class DayShiftJob
        {
            public Job Job { get; set; }
            public IReadOnlyList<DayShiftJobVolunteer> Volunteers { get; set; }
            public int Required { get; set; }
            public int Unconfirmed => Volunteers.Count(x => x.Confirmed == null);
            public int NotComing => Volunteers.Count(x => x.Confirmed == false);
            public int Coming => Volunteers.Count(x => x.Confirmed == true);
            public bool Enough => Required <= Coming;
            public bool IsAssignable { get; set; }
            public bool ShowOnRota => (Coming + NotComing + Unconfirmed + Required) != 0;

            public class DayShiftJobVolunteer
            {
                public int Id { get; set; }
                public string Name { get; set; }
                public string FullName { get; set; }
                internal string FirstName { get; set; }
                internal string LastName { get; set; }
                public int? AttendanceId { get; set; }
                public bool? Confirmed { get; set; }
                public MissingReason? MissingReason { get; set; }
                public string? CustomMissingReason { get; set; }
                public int? AreaId { get; set; }
                public AttendanceType Type { get; set; }
            }
        }
    }
}

#endregion

#region User

public class UserRota
{
    public IReadOnlyList<UserRota.Shift> Rota { get; set; }
    public IReadOnlyList<UserRota.UrgentShift> UrgentShifts { get; set; }
    public List<Shift> ExtraShifts { get; set; }

    public UserRota.Shift? NextShift { get; set; }
    public IReadOnlyList<UserRota.RegularShift> RegularShifts { get; set; }
    public IReadOnlyList<MissingReason> MissingReasons { get; set; }
    public List<Job> AllowedJobs { get; set; }

    public class RegularShift
    {
        public DayOfWeek Day { get; set; }
        public Job Job { get; set; }
        public TimeRange Time { get; set; }
    }

    public abstract class ShiftBase
    {
        public DateOnly Date { get; set; }
        public TimeRange Time { get; set; }
        public Job Job { get; set; }
        public bool? Confirmed { get; set; }
        public AttendanceType Type { get; set; }
        public IReadOnlyList<ShiftOther> Others { get; set; }
        public AssignableArea? Area { get; set; }

        public class ShiftOther
        {
            public string Name { get; set; }
            public AssignableArea? Area { get; set; }
        }
    }

    public class UrgentShift : ShiftBase
    {
        public int Coming { get; set; }
        public int Required { get; set; }
    }

    public class Shift : ShiftBase
    {
        public MissingReason? MissingReason { get; set; }
        public string? CustomMissingReason { get; set; }
    }
}

#endregion