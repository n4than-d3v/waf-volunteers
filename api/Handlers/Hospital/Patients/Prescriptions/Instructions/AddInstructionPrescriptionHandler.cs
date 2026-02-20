using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Instructions;

public class AddInstructionPrescription : IRequest<IResult>
{
    public int PatientId { get; set; }
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public string Instructions { get; set; }
    public string Frequency { get; set; }

    public AddInstructionPrescription WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class AddInstructionPrescriptionHandler : IRequestHandler<AddInstructionPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddInstructionPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddInstructionPrescription request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        patient.LastUpdatedDetails = DateTime.UtcNow;

        var prescription = new PatientPrescriptionInstruction
        {
            Patient = patient,
            Start = request.Start,
            End = request.End,
            Instructions = request.Instructions,
            Frequency = request.Frequency
        };

        _repository.Create(prescription);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
