using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Admission;

public class CheckPatientAdmissions : IRequest<IResult>
{
    public DateTime Since { get; set; }
}

public class CheckPatientAdmissionsHandler : IRequestHandler<CheckPatientAdmissions, IResult>
{
    private readonly IBeaconService _beaconService;
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public CheckPatientAdmissionsHandler(IBeaconService beaconService, IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _beaconService = beaconService;
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(CheckPatientAdmissions request, CancellationToken cancellationToken)
    {
        try
        {
            var beaconAdmissions = await _beaconService.GetPatientAdmissionsAsync(request.Since);
            var beaconAdmissionsIds = beaconAdmissions.results.Select(x => x.entity.id).ToList();

            var patients = await _repository.GetAll<Patient>(x => beaconAdmissionsIds.Contains(x.BeaconId), tracking: false);

            if (beaconAdmissionsIds.Count == patients.Count) return Results.NoContent();

            var year = DateTime.UtcNow.Year;
            var admittedThisYear = patients.Count(x => x.Admitted.Year == year);

            foreach (var admission in beaconAdmissions.results)
            {
                var patient = patients.FirstOrDefault(x => x.BeaconId == admission.entity.id);
                if (patient != null) continue;

                Admitter? admitter = null;
                if (admission.entity.c_person.Count == 1)
                {
                    var personId = admission.entity.c_person.Single();
                    var person = admission.references.Single(x => x.entity.id == personId);
                    admitter = await _repository.Get<Admitter>(x => x.BeaconId == personId);
                    if (admitter == null)
                    {
                        var admitterSalt = _encryptionService.GenerateSalt();
                        admitter = new Admitter
                        {
                            BeaconId = personId,
                            FullName = _encryptionService.Encrypt(person.entity.name.full, admitterSalt),
                            Address = _encryptionService.Encrypt("", admitterSalt),
                            Email = _encryptionService.Encrypt("", admitterSalt),
                            Telephone = _encryptionService.Encrypt("", admitterSalt),
                            Salt = admitterSalt
                        };
                        var address = person.entity.address.FirstOrDefault(x => x.is_primary);
                        if (address != null)
                        {
                            var addressArray = new string[] { address.address_line_one, address.address_line_two, address.address_line_three, address.city, address.region };
                            var addressString = string.Join(", ", addressArray.Where(x => !string.IsNullOrWhiteSpace(x)));
                            admitter.Address = _encryptionService.Encrypt(addressString, admitterSalt);
                        }
                        var email = person.entity.emails.FirstOrDefault(x => x.is_primary);
                        if (email != null)
                        {
                            admitter.Email = _encryptionService.Encrypt(email.email, admitterSalt);
                        }
                        var telephone = person.entity.phone_numbers.FirstOrDefault(x => x.is_primary);
                        if (telephone != null)
                        {
                            admitter.Telephone = _encryptionService.Encrypt(telephone.number, admitterSalt);
                        }
                    }
                }

                var beaconInitialLocation = "BeaconPropReq";
                var initialLocation = await _repository.Get<InitialLocation>(x => x.Description == beaconInitialLocation);
                initialLocation ??= new InitialLocation { Description = beaconInitialLocation };

                var beaconSuspectedSpecies = admission.entity.c_animal.FirstOrDefault() ?? admission.entity.c_specific_animal ?? admission.entity.c_other_animal;
                var suspectedSpecies = await _repository.Get<SuspectedSpecies>(x => x.Description == beaconSuspectedSpecies);
                suspectedSpecies ??= new SuspectedSpecies { Description = beaconSuspectedSpecies };

                var patientAdmissionReasons = new List<AdmissionReason>();
                var admissionReasons = await _repository.GetAll<AdmissionReason>(x => true);
                foreach (var beaconAdmissionReason in admission.entity.c_reason_for_admission)
                {
                    var admissionReason = admissionReasons.SingleOrDefault(x => x.Description == beaconAdmissionReason);
                    admissionReason ??= new AdmissionReason { Description = beaconAdmissionReason };
                    patientAdmissionReasons.Add(admissionReason);
                }

                var reference = $"{year - 2000}-{++admittedThisYear}";

                var foundAt = admission.entity.c_animal_found_at_different_address.Any(x => x == "Yes") ? (admission.entity.c_alternative_address ?? "Unknown") : "Address";
                var patientSalt = _encryptionService.GenerateSalt();

                patient = new Patient
                {
                    BeaconId = admission.entity.id,
                    Admitted = admission.entity.created_at,
                    Admitter = admitter,
                    FoundAt = _encryptionService.Encrypt(foundAt, patientSalt),
                    InitialLocation = initialLocation,
                    SuspectedSpecies = suspectedSpecies,
                    AdmissionReasons = patientAdmissionReasons,
                    Reference = reference,
                    Status = PatientStatus.PendingInitialExam,
                    Salt = patientSalt
                };

                _repository.Create(patient);
                await _repository.SaveChangesAsync();
            }

            return Results.Created();
        }
        catch (Exception e)
        {
            return Results.Problem();
        }
    }
}
