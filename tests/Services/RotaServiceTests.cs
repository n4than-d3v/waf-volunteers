using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Services;

public class RotaServiceTests
{
    private readonly Mock<IDatabaseRepository> _repository;
    private readonly Mock<IEncryptionService> _encryptionService;
    private readonly Mock<IOptions<RotaSettings>> _settingsOptions;

    private readonly RotaSettings _settings;

    private readonly RotaService _rotaService;

    public RotaServiceTests()
    {
        _repository = new Mock<IDatabaseRepository>();
        _encryptionService = new Mock<IEncryptionService>();
        _settingsOptions = new Mock<IOptions<RotaSettings>>();
        _settings = new RotaSettings();

        _settingsOptions.Setup(x => x.Value).Returns(_settings);
        _rotaService = new RotaService(_repository.Object, _encryptionService.Object, _settingsOptions.Object);
    }

    private void Init(
        List<MissingReason>? missingReasons = null,
        List<RegularShift>? regularShifts = null,
        List<Attendance>? attendances = null,
        List<TimeRange>? timeRanges = null,
        List<Job>? jobs = null,
        List<Requirement>? requirements = null,
        DateOnly? start = null,
        DateOnly? end = null
    )
    {
        missingReasons ??= new List<MissingReason>();
        regularShifts ??= new List<RegularShift>();
        attendances ??= new List<Attendance>();
        timeRanges ??= new List<TimeRange>();
        jobs ??= new List<Job>();
        requirements ??= new List<Requirement>();
        start ??= DateOnly.FromDateTime(DateTime.UtcNow);
        end ??= start.Value.AddDays(7);

        _repository.Setup(x => x.GetAll<MissingReason>(x => true, false, It.IsAny<Func<DbSet<MissingReason>, IQueryable<MissingReason>>?>())).Returns(Task.FromResult((IReadOnlyList<MissingReason>)missingReasons));
        _repository.Setup(x => x.GetAll<RegularShift>(x => true, false, It.IsAny<Func<DbSet<RegularShift>, IQueryable<RegularShift>>?>())).Returns(Task.FromResult((IReadOnlyList<RegularShift>)regularShifts));
        _repository.Setup(x => x.GetAll<Attendance>(x => start <= x.Date && x.Date <= end, false, It.IsAny<Func<DbSet<Attendance>, IQueryable<Attendance>>?>())).Returns(Task.FromResult((IReadOnlyList<Attendance>)attendances));
        _repository.Setup(x => x.GetAll<TimeRange>(x => true, false, It.IsAny<Func<DbSet<TimeRange>, IQueryable<TimeRange>>?>())).Returns(Task.FromResult((IReadOnlyList<TimeRange>)timeRanges));
        _repository.Setup(x => x.GetAll<Job>(x => true, false, It.IsAny<Func<DbSet<Job>, IQueryable<Job>>?>())).Returns(Task.FromResult((IReadOnlyList<Job>)jobs));
        _repository.Setup(x => x.GetAll<Requirement>(x => true, false, It.IsAny<Func<DbSet<Requirement>, IQueryable<Requirement>>?>())).Returns(Task.FromResult((IReadOnlyList<Requirement>)requirements));
    }

    [Fact]
    public async Task Smoke()
    {
        DateOnly start = DateOnly.FromDateTime(DateTime.UtcNow);
        DateOnly end = start.AddDays(7);

        Init();

        await _rotaService.GetRotaAsync(start, end);
    }
}
