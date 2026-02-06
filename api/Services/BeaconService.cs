using Api.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph.Models;
using static Api.Services.BeaconService;
using static Api.Services.BeaconService.BeaconVolunteersFilterResults;

namespace Api.Services;

public interface IBeaconService
{
    Task<bool> UpdateActiveVolunteerAsync(int beaconId, UpdateBeaconInfo beaconInfo);
    Task<BeaconVolunteersFilterResults> GetActiveVolunteersAsync();
    Task<BeaconVolunteersFilterResults> GetFormerVolunteersAsync();
    Task<BeaconPatientAdmissionsFilterResults> GetPatientAdmissionsAsync(DateTime after);
}

public partial class BeaconService : IBeaconService
{
    private static readonly DateTime _live = new(2026, 02, 09, 00, 00, 00);

    private readonly HttpClient _client;
    private readonly BeaconSettings _settings;

    public BeaconService(IOptions<BeaconSettings> settings)
    {
        _settings = settings.Value;
        _client = new()
        {
            BaseAddress = new Uri($"https://api.beaconcrm.org/v1/account/{_settings.AccountId}/")
        };
        _client.DefaultRequestHeaders.Add("Beacon-Application", "developer_api");
        _client.DefaultRequestHeaders.Authorization = new("Bearer", _settings.ApiKey);
    }

    public async Task<bool> UpdateActiveVolunteerAsync(int beaconId, UpdateBeaconInfo beaconInfo)
    {
        var payload = JsonContent.Create(beaconInfo);
        var response = await _client.PatchAsync($"entity/person/{beaconId}", payload);
        return response.IsSuccessStatusCode;
    }

    public async Task<BeaconVolunteersFilterResults> GetActiveVolunteersAsync()
    {
        var payload = JsonContent.Create(BeaconVolunteersFilterRequest.ActiveVolunteers);
        return await FilterVolunteersAsync(payload);
    }

    public async Task<BeaconVolunteersFilterResults> GetFormerVolunteersAsync()
    {
        var payload = JsonContent.Create(BeaconVolunteersFilterRequest.FormerVolunteers);
        return await FilterVolunteersAsync(payload);
    }

    private async Task<BeaconVolunteersFilterResults> FilterVolunteersAsync(JsonContent payload)
    {
        var allResults = new BeaconVolunteersFilterResults
        {
            total = 0,
            results = []
        };
        bool running = true;
        int page = 1;
        while (running)
        {
            var response = await _client.PostAsync($"entities/person/filter?page={page}&per_page=200&sort_by=created_at&sort_direction=asc", payload);
            var results = await response.Content.ReadFromJsonAsync<BeaconVolunteersFilterResults>();
            running = results.results.Count != 0;
            allResults.total += results.results.Count;
            allResults.results.AddRange(results.results);
            page++;
        }
        return allResults;
    }

    public async Task<BeaconPatientAdmissionsFilterResults> GetPatientAdmissionsAsync(DateTime after)
    {
        var allResults = new BeaconPatientAdmissionsFilterResults
        {
            total = 0,
            results = []
        };
        bool running = true;
        int page = 1;
        while (running)
        {
            var response = await _client.GetAsync($"entities/c_patient_admissions?page={page}&per_page=200&sort_by=created_at&sort_direction=desc");
            var results = await response.Content.ReadFromJsonAsync<BeaconPatientAdmissionsFilterResults>();
            var relevant = results.results.Where(x =>
                after <= x.entity.created_at &&
                _live <= x.entity.created_at && (
                (!string.IsNullOrWhiteSpace(x.entity.c_specific_animal)) ||
                (!string.IsNullOrWhiteSpace(x.entity.c_other_animal)) ||
                x.entity.c_animal.Any(y => y != "N/A"))
            ).ToList();
            running = !(results.results.Any(x => x.entity.created_at < after) || results.results.Count == 0);
            allResults.total += relevant.Count;
            allResults.results.AddRange(relevant);
            page++;
        }
        return allResults;
    }
}
