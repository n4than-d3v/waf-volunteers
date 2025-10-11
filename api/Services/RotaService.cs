﻿using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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

        return [.. days
            .SelectMany(d => d.Shifts)
            .SelectMany(s => s.Jobs)
            .SelectMany(j => j.Volunteers)
            .GroupBy(v => new { v.Id, v.FullName })
            .Select(g => new Report
            {
                Id = g.Key.Id,
                FullName = g.Key.FullName,
                RegularUnresponded = g.Count(v => v.IsRegularShift && (v.Confirmed == null)),
                RegularYes = g.Count(v => v.IsRegularShift && (v.Confirmed == true)),
                RegularNo = g.Count(v => v.IsRegularShift && (v.Confirmed == false)),
                UrgentYes = g.Count(v => (v.IsRegularShift == false) && (v.Confirmed == true))
            })
            .OrderBy(r => r.FullName)];
    }

    public async Task<IReadOnlyList<Day>> GetRotaAsync(DateOnly start, DateOnly end)
    {
        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);
        var regularShifts = await _repository.GetAll<RegularShift>(x => true, tracking: false, action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));
        var attendances = await _repository.GetAll<Attendance>(x => start <= x.Date && x.Date <= end, tracking: false, action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job).Include(y => y.MissingReason));
        var times = await _repository.GetAll<TimeRange>(x => true, tracking: false);
        var jobs = await _repository.GetAll<Job>(x => true, tracking: false);
        var requirements = await _repository.GetAll<Requirement>(x => true, tracking: false, action: x => x.Include(y => y.Time).Include(y => y.Job));

        var days = new List<Day>();

        void UpdateDayShiftJobVolunteer(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer, Attendance confirmation)
        {
            volunteer.Confirmed = confirmation.Confirmed;
            volunteer.MissingReason = confirmation.MissingReason;
            volunteer.CustomMissingReason = confirmation.CustomMissingReason;
        }

        bool TryUpdateRegularDayShiftJobVolunteer(IReadOnlyList<Day.DayShift.DayShiftJob.DayShiftJobVolunteer> volunteers, Attendance confirmation)
        {
            var regular = volunteers.FirstOrDefault(x => x.Id == confirmation.Account.Id);
            if (regular == null) return false;

            UpdateDayShiftJobVolunteer(regular, confirmation);
            return true;
        }

        Day.DayShift.DayShiftJob.DayShiftJobVolunteer GetDayShiftJobVolunteer(Account account, bool isRegular)
        {
            var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
            var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);

            return new Day.DayShift.DayShiftJob.DayShiftJobVolunteer
            {
                Id = account.Id,
                Name = firstName,
                FullName = $"{firstName} {lastName}",
                IsRegularShift = isRegular,
                Confirmed = null
            };
        }

        Day.DayShift.DayShiftJob GetDayShiftJob(DateOnly date, TimeRange time, Job job)
        {
            var requirement = requirements.FirstOrDefault(x => x.Day == date.DayOfWeek && x.Time.Id == time.Id && x.Job.Id == job.Id);
            var regulars = regularShifts.Where(x => x.Day == date.DayOfWeek && x.Time.Id == time.Id && x.Job.Id == job.Id);
            var shiftAttendances = attendances.Where(x => x.Date == date && x.Time.Id == time.Id && x.Job.Id == job.Id);

            var volunteers = regulars.Select(x => GetDayShiftJobVolunteer(x.Account, true)).ToList();

            foreach (var confirmation in shiftAttendances)
            {
                if (TryUpdateRegularDayShiftJobVolunteer(volunteers, confirmation)) continue;

                var volunteer = GetDayShiftJobVolunteer(confirmation.Account, false);
                UpdateDayShiftJobVolunteer(volunteer, confirmation);
                volunteers.Add(volunteer);
            }

            return new Day.DayShift.DayShiftJob { Job = job, Volunteers = volunteers, Required = requirement?.Minimum ?? 0 };
        }

        Day.DayShift GetDayShift(DateOnly date, TimeRange time) => new()
        {
            Time = time,
            Jobs = [.. jobs.Select(job => GetDayShiftJob(date, time, job))]
        };

        for (var date = start; date <= end; date = date.AddDays(1))
        {
            days.Add(new Day
            {
                Date = date,
                Shifts = [.. times.Select(time => GetDayShift(date, time))]
            });
        }

        return days;
    }

    public async Task<UserRota> GetVolunteerRotaAsync(DateOnly now, int userId)
    {
        var days = await GetRotaAsync(now, now.AddDays(Math.Max(_settings.RegularShiftsDaysInAdvance, _settings.UrgentShiftsDaysInAdvance)));

        bool IsOtherComing(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => (volunteer.Confirmed == true) && (IsVolunteer(volunteer) == false);
        bool IsVolunteer(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => volunteer.Id == userId;
        bool IsVolunteerComing(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => IsVolunteer(volunteer) && volunteer.Confirmed == true;
        bool IsVolunteerRegularShift(Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => IsVolunteer(volunteer) && volunteer.IsRegularShift;
        UserRota.Shift GetShift(Day day, Day.DayShift shift, Day.DayShift.DayShiftJob job, Day.DayShift.DayShiftJob.DayShiftJobVolunteer volunteer) => new()
        {
            Date = day.Date,
            Time = shift.Time,
            Job = job.Job,
            Confirmed = volunteer.Confirmed,
            MissingReason = volunteer.MissingReason,
            CustomMissingReason = volunteer.CustomMissingReason,
            Others = job.Volunteers.Where(IsOtherComing).OrderBy(v => v.Name).Select(v => v.Name).ToArray()
        };
        UserRota.UrgentShift GetUrgentShift(Day day, Day.DayShift shift, Day.DayShift.DayShiftJob job) => new()
        {
            Date = day.Date,
            Time = shift.Time,
            Job = job.Job,
            Required = job.Required,
            Coming = job.Volunteers.Count(v => v.Confirmed == true),
            Confirmed = job.Volunteers.FirstOrDefault(IsVolunteer)?.Confirmed,
            Others = job.Volunteers.Where(IsOtherComing).OrderBy(v => v.Name).Select(v => v.Name).ToArray()
        };

        var missingReasons = await _repository.GetAll<MissingReason>(x => true, tracking: false);
        var userRegularShifts = await _repository.GetAll<RegularShift>(
            x => x.Account.Id == userId, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));
        var allowedJobIds = userRegularShifts.Select(x => x.Job.Id).Distinct().ToList();

        var maxDateForRegularShifts = now.AddDays(_settings.RegularShiftsDaysInAdvance);
        var regularShifts = days
            .OrderBy(d => d.Date)
            .Where(d => d.Date <= maxDateForRegularShifts)
            .SelectMany(d => d.Shifts.SelectMany(s => s.Jobs.SelectMany(j => j.Volunteers
                .Where(IsVolunteerRegularShift)
                .Select(v => GetShift(d, s, j, v)))))
            .ToList();

        var maxDateForUrgentShifts = now.AddDays(_settings.UrgentShiftsDaysInAdvance);
        var urgentShifts = days
            .OrderBy(d => d.Date)
            .Where(d => d.Date <= maxDateForUrgentShifts)
            .SelectMany(d => d.Shifts.SelectMany(s => s.Jobs
                .Where(j => allowedJobIds.Contains(j.Job.Id) && ((j.Enough == false) || j.Volunteers.Any(v => IsVolunteerComing(v) && !IsVolunteerRegularShift(v))))
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
            RegularShifts = userRegularShifts.Select(x => new UserRota.RegularShift { Day = x.Day, Job = x.Job, Time = x.Time, }).ToList(),
            MissingReasons = missingReasons,
            NextShift = nextShift
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
    public int UrgentYes { get; set; }
}

public class Day
{
    public DateOnly Date { get; set; }
    public IReadOnlyList<DayShift> Shifts { get; set; }

    public class DayShift
    {
        public TimeRange Time { get; set; }
        public IReadOnlyList<DayShiftJob> Jobs { get; set; }

        public class DayShiftJob
        {
            public Job Job { get; set; }
            public IReadOnlyList<DayShiftJobVolunteer> Volunteers { get; set; }
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

#endregion

#region User

public class UserRota
{
    public IReadOnlyList<UserRota.RegularShift> RegularShifts { get; set; }
    public UserRota.Shift? NextShift { get; set; }
    public IReadOnlyList<UserRota.Shift> Rota { get; set; }
    public IReadOnlyList<UserRota.UrgentShift> UrgentShifts { get; set; }
    public IReadOnlyList<MissingReason> MissingReasons { get; set; }

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
        public IReadOnlyList<string> Others { get; set; }
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