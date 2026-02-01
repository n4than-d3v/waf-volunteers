using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Instructions;

public class UpdateInstructionPrescription : IRequest<IResult>
{
    public int Id { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
    public string Instructions { get; set; }
    public string Frequency { get; set; }

    public UpdateInstructionPrescription WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateInstructionPrescriptionHandler : IRequestHandler<UpdateInstructionPrescription, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateInstructionPrescriptionHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateInstructionPrescription request, CancellationToken cancellationToken)
    {
        var prescription = await _repository.Get<PatientPrescriptionInstruction>(request.Id);
        if (prescription == null) return Results.BadRequest();

        prescription.Start = request.Start;
        prescription.End = request.End;
        prescription.Instructions = request.Instructions;
        prescription.Frequency = request.Frequency;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
