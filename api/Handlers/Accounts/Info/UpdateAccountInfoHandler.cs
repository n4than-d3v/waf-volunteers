using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;
using Newtonsoft.Json;
using static Api.Services.BeaconService.BeaconVolunteersFilterResults;

namespace Api.Handlers.Accounts.Info;

public class UpdateAccountInfo : IRequest<IResult>
{
    public int? Id { get; private set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public UpdateBeaconInfo? BeaconInfo { get; set; }

    public string[] Cars { get; set; }

    public UpdateAccountInfo WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateAccountHandler : IRequestHandler<UpdateAccountInfo, IResult>
{
    private const string Recipient = "office";

    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;
    private readonly IBeaconService _beaconService;
    private readonly IEmailService _emailService;

    public UpdateAccountHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext, IBeaconService beaconService, IEmailService emailService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
        _beaconService = beaconService;
        _emailService = emailService;
    }

    public async Task<IResult> Handle(UpdateAccountInfo request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(request.Id ?? _userContext.Id);
        if (user == null) return Results.BadRequest();

        var cars = (request.Cars ?? []).Select(car => _encryptionService.Encrypt(car.ToUpper(), user.Salt)).ToArray();

        if (user.BeaconId != null && request.BeaconInfo != null)
        {
            try
            {
                var previousJson = _encryptionService.Decrypt(user.BeaconInfo, user.Salt);
                var previousBeaconInfo = JsonConvert.DeserializeObject<UpdateBeaconInfo>(previousJson);

                static string GetPrimaryPhoneNumber(UpdateBeaconInfo info)
                {
                    if (info.phone_numbers == null) return string.Empty;
                    var primary = info.phone_numbers.SingleOrDefault(x => x.is_primary);
                    if (primary == null) return string.Empty;
                    return primary.number;
                }

                var previousPrimaryPhoneNumber = GetPrimaryPhoneNumber(previousBeaconInfo);
                var updatedPrimaryPhoneNumber = GetPrimaryPhoneNumber(request.BeaconInfo);

                if (previousPrimaryPhoneNumber != updatedPrimaryPhoneNumber)
                {
                    var email = Services.Email.Internal_PhoneNumberUpdated(
                        request.BeaconInfo.name.first, request.BeaconInfo.name.last, Recipient,
                        previousPrimaryPhoneNumber, updatedPrimaryPhoneNumber);
                    await _emailService.SendEmailAsync(email);
                }
            }
            catch
            {
            }

            var json = JsonConvert.SerializeObject(request.BeaconInfo);
            var beaconInfo = _encryptionService.Encrypt(json, user.Salt);
            string firstName = _encryptionService.Encrypt(request.BeaconInfo.name.first, user.Salt);
            if (!string.IsNullOrWhiteSpace(request.BeaconInfo.c_preferred_name))
            {
                firstName = _encryptionService.Encrypt(request.BeaconInfo.c_preferred_name, user.Salt);
            }
            string lastName = _encryptionService.Encrypt(request.BeaconInfo.name.last, user.Salt);
            user.UpdatePersonalDetails(firstName, lastName, user.Email, beaconInfo, cars);

            await _beaconService.UpdateActiveVolunteerAsync(user.BeaconId.Value, request.BeaconInfo);
        }
        else
        {
            var firstName = _encryptionService.Encrypt(request.FirstName, user.Salt);
            var lastName = _encryptionService.Encrypt(request.LastName, user.Salt);
            var email = _encryptionService.Encrypt(request.Email, user.Salt);
            user.UpdatePersonalDetails(firstName, lastName, email, cars);
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
