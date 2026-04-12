using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class AcceptHomeCare : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public DateTime Pickup { get; set; }

    public AcceptHomeCare WithId(int id)
    {
        HomeCareRequestId = id;
        return this;
    }
}

public class AcceptHomeCareHandler : IRequestHandler<AcceptHomeCare, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;

    public AcceptHomeCareHandler(
        IDatabaseRepository repository,
        IUserContext userContext,
        IEncryptionService encryptionService
    )
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(AcceptHomeCare request, CancellationToken cancellationToken)
    {
        var homeCareRequest = await _repository.Get<HomeCareRequest>(
            request.HomeCareRequestId,
            action: x => x.Include(y => y.Patient)
        );
        if (homeCareRequest == null)
            return Results.BadRequest();

        if (homeCareRequest.Responded.HasValue)
            return Results.BadRequest();

        var responder = await _repository.Get<Account>(_userContext.Id);
        if (responder == null)
            return Results.BadRequest();

        var patient = homeCareRequest.Patient;

        patient.LastUpdatedStatus = DateTime.UtcNow;
        patient.Status = PatientStatus.ReceivingHomeCare;
        var firstName = _encryptionService.Decrypt(responder.FirstName, responder.Salt);
        var lastName = _encryptionService.Decrypt(responder.LastName, responder.Salt);
        patient.CurrentHomeCarer = $"{firstName} {lastName}";

        homeCareRequest.Responder = responder;
        homeCareRequest.Responded = DateTime.UtcNow;
        homeCareRequest.Pickup = request.Pickup;

        await _repository.SaveChangesAsync();
        return Results.Accepted();
    }
}
