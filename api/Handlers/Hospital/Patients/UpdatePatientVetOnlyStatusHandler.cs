using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Handlers.Hospital.Patients.Notes;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class UpdatePatientVetOnlyStatus : IRequest<IResult>
{
    public int PatientId { get; set; }
    public bool IsVetTeamOnly { get; set; }

    public UpdatePatientVetOnlyStatus WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class UpdatePatientVetOnlyStatusHandler : IRequestHandler<UpdatePatientVetOnlyStatus, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    private const string VetTeamOnlyInstructions = "Top up food & water. Clean cage if needed.";

    public UpdatePatientVetOnlyStatusHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(UpdatePatientVetOnlyStatus request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        if (patient.IsVetTeamOnly == request.IsVetTeamOnly) return Results.NoContent();

        var now = DateTime.UtcNow;

        if (request.IsVetTeamOnly)
        {
            var prescription = new PatientPrescriptionInstruction
            {
                Patient = patient,
                Instructions = VetTeamOnlyInstructions,
                Start = DateOnly.FromDateTime(now),
                End = DateOnly.FromDateTime(now.AddYears(1)),
                Frequency = "2 times per day"
            };
            _repository.Create(prescription);
        }
        else
        {
            var prescriptions = await _repository.GetAll<PatientPrescriptionInstruction>(
                x => x.Patient.Id == patient.Id && x.Instructions == VetTeamOnlyInstructions,
                action: x => x.Include(y => y.Patient));
            foreach (var prescription in prescriptions)
            {
                _repository.Delete(prescription);
            }
        }

        patient.IsVetTeamOnly = request.IsVetTeamOnly;
        patient.LastUpdatedDetails = now;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
