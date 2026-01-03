using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Hospital.HomeCare;

public class RequireHomeCare : IRequest<IResult>
{
    public int PatientId { get; set; }
    public string Notes { get; set; }

    public RequireHomeCare WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class RequireHomeCareHandler : IRequestHandler<RequireHomeCare, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public RequireHomeCareHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(RequireHomeCare request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var requester = await _repository.Get<Account>(_userContext.Id);
        if (requester == null) return Results.BadRequest();

        patient.Status = PatientStatus.PendingHomeCare;

        var homeCareRequest = new HomeCareRequest
        {
            Patient = patient,
            Requester = requester,
            Requested = DateTime.UtcNow,
            Notes = request.Notes
        };

        _repository.Create(homeCareRequest);
        await _repository.SaveChangesAsync();

        string species = patient.Species?.Name ?? patient.SuspectedSpecies?.Description ?? "Unknown";
        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        foreach (var account in accounts)
        {
            if (!account.Roles.HasFlag(AccountRoles.BEACON_ORPHAN_FEEDER)) continue;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                await _pushService.Send(push, new PushNotification
                {
                    Title = "Home care required",
                    Body = $"{species} requires home care. Can you please help?"
                });
            }
        }

        return Results.Created();
    }
}
