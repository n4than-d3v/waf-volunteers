using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.Prescriptions;

namespace Api.Handlers.Hospital.Patients.Prescriptions.Instructions;

public class RemoveInstructionPrescriptionAdministration : IRequest<IResult>
{
    public int AdministrationId { get; set; }
}

public class RemoveInstructionPrescriptionAdministrationHandler : IRequestHandler<RemoveInstructionPrescriptionAdministration, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveInstructionPrescriptionAdministrationHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveInstructionPrescriptionAdministration request, CancellationToken cancellationToken)
    {
        var administration = await _repository.Get<PatientPrescriptionInstructionAdministration>(request.AdministrationId);
        if (administration == null) return Results.BadRequest();

        _repository.Delete(administration);
        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
