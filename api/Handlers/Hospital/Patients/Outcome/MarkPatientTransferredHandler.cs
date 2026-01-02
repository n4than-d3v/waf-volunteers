using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class MarkPatientTransferred : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int TransferLocationId { get; set; }
}

public class MarkPatientTransferredHandler : IRequestHandler<MarkPatientTransferred, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public MarkPatientTransferredHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(MarkPatientTransferred request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var dispositioner = await _repository.Get<Account>(_userContext.Id);
        if (dispositioner == null) return Results.BadRequest();

        var transferLocation = await _repository.Get<TransferLocation>(request.TransferLocationId);
        if (transferLocation == null) return Results.BadRequest();

        patient.Disposition = Disposition.Transferred;
        patient.Dispositioned = DateTime.UtcNow;
        patient.Dispositioner = dispositioner;
        patient.Status = PatientStatus.Dispositioned;
        patient.TransferLocation = transferLocation;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
