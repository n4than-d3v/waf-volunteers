using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class MarkPatientDead : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int[] DispositionReasonIds { get; set; }

    public bool PutToSleep { get; set; }
    public bool OnArrival { get; set; }

    public MarkPatientDead WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MarkPatientDeadHandler : IRequestHandler<MarkPatientDead, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;
    private readonly IEmailService _emailService;
    private readonly IBeaconService _beaconService;

    public MarkPatientDeadHandler(IDatabaseRepository repository, IUserContext userContext,
        IEncryptionService encryptionService, IEmailService emailService, IBeaconService beaconService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
        _emailService = emailService;
        _beaconService = beaconService;
    }

    public async Task<IResult> Handle(MarkPatientDead request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId,
            action: x => x.IncludeAdmission().IncludeBasicDetails());
        if (patient == null) return Results.BadRequest();

        var dispositioner = await _repository.Get<Account>(_userContext.Id);
        if (dispositioner == null) return Results.BadRequest();

        var dispositionReasons = new List<DispositionReason>();
        var dispositionReasonIds = (request.DispositionReasonIds ?? []).Where(x => x != default);
        foreach (var dispositionReasonId in dispositionReasonIds)
        {
            var dispositionReason = await _repository.Get<DispositionReason>(dispositionReasonId);
            if (dispositionReason == null) return Results.BadRequest();
            dispositionReasons.Add(dispositionReason);
        }

        if (!dispositionReasons.Any())
        {
            var dispositionReason = await _repository.Get<DispositionReason>(x => x.Description == "Unknown");
            dispositionReasons.Add(dispositionReason!);
        }

        patient.Dispositioned = DateTime.UtcNow;
        patient.Dispositioner = dispositioner;
        patient.DispositionReasons = dispositionReasons;
        patient.Status = PatientStatus.Dispositioned;
        patient.LastUpdatedDetails = DateTime.UtcNow;

        bool before24Hrs = patient.Dispositioned <= patient.Admitted.AddHours(24);

        if (request.PutToSleep)
        {
            patient.Disposition = before24Hrs ? Disposition.PtsBefore24Hrs : Disposition.PtsAfter24Hrs;
        }
        else if (request.OnArrival)
        {
            patient.Disposition = Disposition.DeadOnArrival;
        }
        else
        {
            patient.Disposition = before24Hrs ? Disposition.DiedBefore24Hrs : Disposition.DiedAfter24Hrs;
        }

        await _repository.SaveChangesAsync();

        if (patient.BeaconId != 0)
        {
            await _beaconService.UpdatePatientDispositionAsync(patient.BeaconId, request.PutToSleep
                ? BeaconService.BeaconDisposition.PTS : BeaconService.BeaconDisposition.Died);
        }

        if (patient.Admitter == null) return Results.NoContent();
        var admitter = patient.Admitter;
        if (string.IsNullOrWhiteSpace(admitter.Email)) return Results.NoContent();

        var admitterFullName = _encryptionService.Decrypt(admitter.FullName, admitter.Salt);
        var admitterEmail = _encryptionService.Decrypt(admitter.Email, admitter.Salt);

        var communication = dispositionReasons.First().Communication
            .Replace("%NAME%", admitterFullName)
            .Replace("%SPECIES%", patient.Species?.Name ?? "Unknown")
            .Replace("%ADMITTED%", $"{patient.Admitted:dddd d MMMM}");

        var email = Email.External_PatientUpdate_Death(admitterFullName, admitterEmail, communication);
        await _emailService.SendEmailAsync(email);

        return Results.NoContent();
    }
}
