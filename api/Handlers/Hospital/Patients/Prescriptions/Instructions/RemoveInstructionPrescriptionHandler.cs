using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Instructions;

public class RemoveInstructionPrescription : IRequest<IResult>
{
    public int PrescriptionInstructionId { get; set; }
}

public class RemoveInstructionPrescriptionHandler : IRequestHandler<RemoveInstructionPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveInstructionPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveInstructionPrescription request, CancellationToken cancellationToken)
    {
        var prescription = await _repository.Get<PatientPrescriptionInstruction>(request.PrescriptionInstructionId);
        if (prescription == null) return Results.BadRequest();

        _repository.Delete(prescription);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
