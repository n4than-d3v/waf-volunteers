using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Handlers.Accounts.Reset;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Api.Handlers.Accounts.Beacon;

public class BeaconSync : IRequest<IResult>
{
}

public class BeaconSyncHandler : IRequestHandler<BeaconSync, IResult>
{
    private readonly IMediator _mediator;
    private readonly IDatabaseRepository _repository;
    private readonly IBeaconService _beaconService;
    private readonly IEncryptionService _encryptionService;

    public BeaconSyncHandler(IMediator mediator, IDatabaseRepository repository, IBeaconService beaconService, IEncryptionService encryptionService)
    {
        _mediator = mediator;
        _repository = repository;
        _beaconService = beaconService;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(BeaconSync request, CancellationToken cancellationToken)
    {
        var activeVolunteers = await _beaconService.GetActiveVolunteersAsync();
        var formerVolunteers = await _beaconService.GetFormerVolunteersAsync();

        var accounts = await _repository.GetAll<Account>(x => true);
        var times = await _repository.GetAll<TimeRange>(x => true);
        var jobs = await _repository.GetAll<Job>(x => true);

        var newlyCreatedAccountUsernames = new List<string>();

        // Ensure all former volunteers are marked as inactive
        foreach (var formerVolunteer in formerVolunteers.results)
        {
            var account = accounts.FirstOrDefault(x => x.BeaconId == formerVolunteer.entity.id);
            account?.UpdateStatus(AccountStatus.Inactive);
        }

        // Ensure all active volunteers have an account created
        foreach (var activeVolunteer in activeVolunteers.results)
        {
            var account = accounts.FirstOrDefault(x => x.BeaconId == activeVolunteer.entity.id);
            if (account != null) continue;

            var primaryEmail = activeVolunteer.entity.emails.FirstOrDefault(x => x.is_primary);
            if (primaryEmail == null) continue;

            account = accounts.FirstOrDefault(x => _encryptionService.Decrypt(x.Email, x.Salt) == primaryEmail.email);
            if (account != null) continue;

            int lettersOfFirstName = 1;

            string username = (activeVolunteer.entity.name.first[0] + activeVolunteer.entity.name.last)
                .ToLower().Replace("-", "").Replace("'", "").Replace(" ", "");

            int tries = 1;
            while (true)
            {
                var existingUser = accounts.FirstOrDefault(x => x.Username == username);
                if (existingUser == null && !newlyCreatedAccountUsernames.Contains(username)) break;
                username = (activeVolunteer.entity.name.first[..lettersOfFirstName] + activeVolunteer.entity.name.last)
                    .ToLower().Replace("-", "").Replace("'", "").Replace(" ", "");
                if (lettersOfFirstName >= activeVolunteer.entity.name.first.Length)
                {
                    tries++;
                    username = (activeVolunteer.entity.name.first[0] + activeVolunteer.entity.name.last + tries)
                        .ToLower().Replace("-", "").Replace("'", "").Replace(" ", "");
                }
                else
                {
                    lettersOfFirstName++;
                }
            }

            newlyCreatedAccountUsernames.Add(username);

            var salt = _encryptionService.GenerateSalt();

            account = new Account(
                username,
                password: "-",
                AccountStatus.Active,
                AccountRoles.None,
                _encryptionService.Encrypt(string.Empty, salt),
                _encryptionService.Encrypt(string.Empty, salt),
                _encryptionService.Encrypt(string.Empty, salt),
                activeVolunteer.entity.id,
                _encryptionService.Encrypt(string.Empty, salt),
                [],
                _encryptionService.Encrypt(string.Empty, salt),
                salt
            );

            _repository.Create(account);
        }

        await _repository.SaveChangesAsync();
        accounts = await _repository.GetAll<Account>(x => true);
        var regularShifts = await _repository.GetAll<RegularShift>(x => true,
            action: x => x.Include(y => y.Account).Include(y => y.Time).Include(y => y.Job));

        foreach (var activeVolunteer in activeVolunteers.results)
        {
            var account = accounts.FirstOrDefault(x => x.BeaconId == activeVolunteer.entity.id);

            var primaryEmail = activeVolunteer.entity.emails.FirstOrDefault(x => x.is_primary);
            if (primaryEmail == null) continue;

            if (account == null)
            {
                account = accounts.FirstOrDefault(x => _encryptionService.Decrypt(x.Email, x.Salt) == primaryEmail.email);
                if (account == null) continue;

                account.UpdateBeaconId(activeVolunteer.entity.id);
            }

            // Ensure all active volunteers have the latest updateable info
            var firstName = _encryptionService.Encrypt(activeVolunteer.entity.name.first, account.Salt);
            if (!string.IsNullOrWhiteSpace(activeVolunteer.entity.c_preferred_name))
            {
                firstName = _encryptionService.Encrypt(activeVolunteer.entity.c_preferred_name, account.Salt);
            }
            var lastName = _encryptionService.Encrypt(activeVolunteer.entity.name.last, account.Salt);
            var email = _encryptionService.Encrypt(primaryEmail.email, account.Salt);

            var json = JsonConvert.SerializeObject(activeVolunteer.entity);
            var beaconInfo = _encryptionService.Encrypt(json, account.Salt);
            account.UpdateStatus(AccountStatus.Active);
            account.UpdatePersonalDetails(firstName, lastName, email, beaconInfo, account.Cars);

            AccountRoles roles = 0;

            activeVolunteer.entity.volunteer_roles.ForEach(role =>
            {
                roles |= (AccountRoles)Enum.Parse(typeof(AccountRoles), $"BEACON_{role.Replace(" ", "_").ToUpper()}");
            });

            var job = jobs.OrderByDescending(x => x.Id).FirstOrDefault(x => roles.HasFlag(x.BeaconAssociatedRole));

            account.UpdateRoles(roles);

            if (job == null) continue;

            // Do not manage regular shifts for existing accounts
            if (!newlyCreatedAccountUsernames.Contains(account.Username)) continue;

            var availability = activeVolunteer.entity.volunteer_availability;
            List<RegularShift> checkedRegularShifts = [];
            foreach (var shift in availability)
            {
                var split = shift.Split(' ');
                string dayString, weekString = null, timeString;
                if (split.Length == 2)
                {
                    dayString = split[0];
                    timeString = split[1];

                }
                else if (split.Length == 3)
                {
                    dayString = split[0];
                    weekString = split[1];
                    timeString = split[2];
                }
                else
                {
                    continue;
                }

                DayOfWeek day = (DayOfWeek)Enum.Parse(typeof(DayOfWeek), dayString);
                TimeRange time = times.FirstOrDefault(x => x.BeaconName == timeString);
                if (time == null) continue;

                int? week = null;
                if (weekString != null)
                {
                    if (int.TryParse(weekString, out int tempWeek))
                    {
                        week = tempWeek;
                    }
                    else
                    {
                        continue;
                    }
                }

                var existingRegularShift = regularShifts.FirstOrDefault(x => x.Account.Id == account.Id && x.Day == day && x.Time.Id == time.Id && x.Job.Id == job.Id);
                if (existingRegularShift == null)
                {
                    existingRegularShift = new RegularShift
                    {
                        Account = account,
                        Day = day,
                        Week = week,
                        Job = job,
                        Time = time
                    };
                    _repository.Create(existingRegularShift);
                }
                checkedRegularShifts.Add(existingRegularShift);
            }

            var deleteRegularShifts = regularShifts.Where(x => x.Account.Id == account.Id && !checkedRegularShifts.Contains(x));
            foreach (var deleteRegularShift in deleteRegularShifts)
            {
                _repository.Delete(deleteRegularShift);
            }
        }

        foreach (var newlyCreatedAccountUsername in newlyCreatedAccountUsernames)
        {
            /*
            await _mediator.Send(new RequestPasswordReset
            {
                Username = newlyCreatedAccountUsername,
                IsAccountNewlyCreated = true
            }, cancellationToken);
            */
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
