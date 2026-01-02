using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Medications;

public class PerformMedicationPrescription : IRequest<IResult>
{
    public int PrescriptionId { get; set; }
    public bool Success { get; set; }
    public string Comments { get; set; }
}

public class PerformMedicationPrescriptionHandler : IRequestHandler<PerformMedicationPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public PerformMedicationPrescriptionHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(PerformMedicationPrescription request, CancellationToken cancellationToken)
    {
        var prescription = await _repository.Get<PatientPrescriptionMedication>(request.PrescriptionId);
        if (prescription == null) return Results.BadRequest();

        var administrator = await _repository.Get<Account>(_userContext.Id);
        if (administrator == null) return Results.BadRequest();

        var administration = new PatientPrescriptionMedicationAdministration
        {
            PatientPrescriptionMedication = prescription,
            Administered = DateTime.UtcNow,
            Administrator = administrator,
            Comments = request.Comments,
            Success = request.Success
        };

        _repository.Create(administration);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
