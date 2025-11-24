using Api.Configuration;
using Microsoft.Extensions.Options;
using static Api.Services.BeaconService;
using static Api.Services.BeaconService.BeaconFilterResults;

namespace Api.Services;

public interface IBeaconService
{
    Task<bool> UpdateActiveVolunteerAsync(int beaconId, UpdateBeaconInfo beaconInfo);
    Task<BeaconFilterResults> GetActiveVolunteersAsync();
    Task<BeaconFilterResults> GetFormerVolunteersAsync();
}

public partial class BeaconService : IBeaconService
{
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

    public async Task<BeaconFilterResults> GetActiveVolunteersAsync()
    {
        var payload = JsonContent.Create(BeaconFilterRequest.ActiveVolunteers);
        return await FilterVolunteersAsync(payload);
    }

    public async Task<BeaconFilterResults> GetFormerVolunteersAsync()
    {
        var payload = JsonContent.Create(BeaconFilterRequest.FormerVolunteers);
        return await FilterVolunteersAsync(payload);
    }

    private async Task<BeaconFilterResults> FilterVolunteersAsync(JsonContent payload)
    {
        var allResults = new BeaconFilterResults
        {
            total = 0,
            results = []
        };
        bool running = true;
        int page = 1;
        while (running)
        {
            var response = await _client.PostAsync($"entities/person/filter?page={page}&per_page=200&sort_by=created_at&sort_direction=asc", payload);
            var results = await response.Content.ReadFromJsonAsync<BeaconFilterResults>();
            running = results.results.Count != 0;
            allResults.total += results.total;
            allResults.results.AddRange(results.results);
            page++;
        }
        return allResults;
    }
}
