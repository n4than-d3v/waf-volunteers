using Api.Configuration;
using Api.Services;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Services;

public class BeaconServiceTests
{
    private readonly BeaconService _service;
    private readonly Mock<IOptions<BeaconSettings>> _settings;

    public BeaconServiceTests()
    {
        _settings = new Mock<IOptions<BeaconSettings>>();

        _settings.Setup(x => x.Value).Returns(new BeaconSettings
        {
        });

        _service = new BeaconService(_settings.Object);
    }

    [Fact]
    public async Task GetActiveVolunteersAsync()
    {
        await _service.GetActiveVolunteersAsync();
    }

    [Fact]
    public async Task GetPatientAdmissionsAsync()
    {
        await _service.GetPatientAdmissionsAsync(DateTime.Now.AddDays(-7));
    }
}
