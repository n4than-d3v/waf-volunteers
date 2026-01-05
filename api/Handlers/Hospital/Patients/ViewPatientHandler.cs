using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatient : IRequest<IResult>
{
    public int Id { get; set; }
}

public class ViewPatientHandler : IRequestHandler<ViewPatient, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewPatientHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewPatient request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.Id, tracking: false, x => x
            .AsSplitQuery()
            .IncludeAdmission()
            .IncludeBasicDetails()
            .IncludeHusbandry()
            .IncludeExams()
            .IncludeRechecks()
            .IncludePrescriptions()
            .IncludeNotes()
            .IncludeHomeCare()
            .IncludeOutcome());
        if (patient == null) return Results.NotFound();

        patient.DecryptProperties(_encryptionService);

        return Results.Ok(patient);
    }
}

public static class ViewPatientExtensions
{
    public static void DecryptProperties(this Patient patient, IEncryptionService encryptionService)
    {
        // Doesn't actually update the values, just for the sake of the DTO

        if (!string.IsNullOrWhiteSpace(patient.FoundAt))
            patient.FoundAt = encryptionService.Decrypt(patient.FoundAt, patient.Salt);

        if (patient.Admitter != null)
        {
            var admitter = patient.Admitter;
            if (!string.IsNullOrWhiteSpace(admitter.FullName))
                admitter.FullName = encryptionService.Decrypt(admitter.FullName, admitter.Salt);
            if (!string.IsNullOrWhiteSpace(admitter.Email))
                admitter.Email = encryptionService.Decrypt(admitter.Email, admitter.Salt);
            if (!string.IsNullOrWhiteSpace(admitter.Address))
                admitter.Address = encryptionService.Decrypt(admitter.Address, admitter.Salt);
            if (!string.IsNullOrWhiteSpace(admitter.Telephone))
                admitter.Telephone = encryptionService.Decrypt(admitter.Telephone, admitter.Salt);
        }
    }

    public static IQueryable<Patient> IncludeAdmission(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.Admitter)
            .Include(y => y.SuspectedSpecies)
            .Include(y => y.InitialLocation)
            .Include(y => y.AdmissionReasons);
    }

    public static IQueryable<Patient> IncludeBasicDetails(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.Species)
            .Include(y => y.SpeciesVariant)
            .Include(y => y.Pen).ThenInclude(y => y.Area);
    }

    public static IQueryable<Patient> IncludeHusbandry(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.Diets)
            .Include(y => y.Tags);
    }

    public static IQueryable<Patient> IncludeExams(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.Exams).ThenInclude(e => e.Examiner)
            .Include(y => y.Exams).ThenInclude(e => e.Species)
            .Include(y => y.Exams).ThenInclude(e => e.SpeciesAge)
            .Include(y => y.Exams).ThenInclude(e => e.TreatmentInstructions)
            .Include(y => y.Exams).ThenInclude(e => e.TreatmentMedications).ThenInclude(m => m.Medication).ThenInclude(m => m.ActiveSubstances)
            .Include(y => y.Exams).ThenInclude(e => e.TreatmentMedications).ThenInclude(m => m.Medication).ThenInclude(m => m.PharmaceuticalForm)
            .Include(y => y.Exams).ThenInclude(e => e.TreatmentMedications).ThenInclude(m => m.Medication).ThenInclude(m => m.TargetSpecies)
            .Include(y => y.Exams).ThenInclude(e => e.TreatmentMedications).ThenInclude(m => m.Medication).ThenInclude(m => m.TherapeuticGroup);
    }

    public static IQueryable<Patient> IncludePrescriptions(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.PrescriptionInstructions).ThenInclude(p => p.Administrations).ThenInclude(a => a.Administrator)
            .Include(y => y.PrescriptionMedications).ThenInclude(p => p.Administrations).ThenInclude(a => a.Administrator)
            .Include(y => y.PrescriptionMedications).ThenInclude(p => p.Medication).ThenInclude(m => m.ActiveSubstances)
            .Include(y => y.PrescriptionMedications).ThenInclude(p => p.Medication).ThenInclude(m => m.PharmaceuticalForm)
            .Include(y => y.PrescriptionMedications).ThenInclude(p => p.Medication).ThenInclude(m => m.TargetSpecies)
            .Include(y => y.PrescriptionMedications).ThenInclude(p => p.Medication).ThenInclude(m => m.TherapeuticGroup);
    }

    public static IQueryable<Patient> IncludeRechecks(this IQueryable<Patient> x)
    {
        return x.Include(y => y.Rechecks).ThenInclude(r => r.Rechecker);
    }

    public static IQueryable<Patient> IncludeNotes(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.Notes).ThenInclude(n => n.Noter)
            .Include(y => y.Movements).ThenInclude(m => m.From)
            .Include(y => y.Movements).ThenInclude(m => m.To);
    }

    public static IQueryable<Patient> IncludeHomeCare(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.HomeCareRequests).ThenInclude(r => r.Requester)
            .Include(y => y.HomeCareRequests).ThenInclude(r => r.Responder)
            .Include(y => y.HomeCareMessages).ThenInclude(m => m.Author);
    }

    public static IQueryable<Patient> IncludeOutcome(this IQueryable<Patient> x)
    {
        return x
            .Include(y => y.DispositionReason)
            .Include(y => y.ReleaseType)
            .Include(y => y.TransferLocation)
            .Include(y => y.Dispositioner);
    }

}
