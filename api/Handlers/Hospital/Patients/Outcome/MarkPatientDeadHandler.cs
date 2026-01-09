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
    public int DispositionReasonId { get; set; }

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

    public MarkPatientDeadHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService, IEmailService emailService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
        _emailService = emailService;
    }

    public async Task<IResult> Handle(MarkPatientDead request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId,
            action: x => x.IncludeAdmission().IncludeBasicDetails());
        if (patient == null) return Results.BadRequest();

        var dispositioner = await _repository.Get<Account>(_userContext.Id);
        if (dispositioner == null) return Results.BadRequest();

        var dispositionReason = await _repository.Get<DispositionReason>(request.DispositionReasonId);
        if (dispositionReason == null) return Results.BadRequest();

        patient.Dispositioned = DateTime.UtcNow;
        patient.Dispositioner = dispositioner;
        patient.DispositionReason = dispositionReason;
        patient.Status = PatientStatus.Dispositioned;

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

        if (patient.Admitter == null) return Results.NoContent();
        var admitter = patient.Admitter;
        if (string.IsNullOrWhiteSpace(admitter.Email)) return Results.NoContent();

        var admitterFullName = _encryptionService.Decrypt(admitter.FullName, admitter.Salt);
        var admitterEmail = _encryptionService.Decrypt(admitter.Email, admitter.Salt);

        var communication = dispositionReason.Communication
            .Replace("%NAME%", admitterFullName)
            .Replace("%SPECIES%", patient.Species?.Name ?? "Unknown")
            .Replace("%ADMITTED%", $"{patient.Admitted:dddd d MMMM}");

        var email = Email.External_PatientUpdate_Death(admitterFullName, admitterEmail, communication);
        await _emailService.SendEmailAsync(email);

        return Results.NoContent();
    }
}
