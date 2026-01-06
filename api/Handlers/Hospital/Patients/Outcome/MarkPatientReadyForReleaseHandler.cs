using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class MarkPatientReadyForRelease : IRequest<IResult>
{
    public int PatientId { get; set; }

    public MarkPatientReadyForRelease WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MarkPatientReadyForReleaseHandler : IRequestHandler<MarkPatientReadyForRelease, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IEmailService _emailService;

    public MarkPatientReadyForReleaseHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IEmailService emailService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _emailService = emailService;
    }

    public async Task<IResult> Handle(MarkPatientReadyForRelease request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId,
            action: x => x.IncludeAdmission().IncludeBasicDetails());
        if (patient == null) return Results.BadRequest();

        patient.Status = PatientStatus.ReadyForRelease;

        await _repository.SaveChangesAsync();

        if (patient.Admitter == null) return Results.NoContent();
        var admitter = patient.Admitter;
        if (string.IsNullOrWhiteSpace(admitter.Email)) return Results.NoContent();

        var admitterFullName = _encryptionService.Decrypt(admitter.FullName, admitter.Salt);
        var admitterEmail = _encryptionService.Decrypt(admitter.Email, admitter.Salt);
        var email = Email.External_PatientUpdate_ReadyForCollection(admitterFullName, admitterEmail, patient.Species?.Name ?? "Unknown", patient.Admitted);
        await _emailService.SendEmailAsync(email);

        return Results.NoContent();
    }
}
