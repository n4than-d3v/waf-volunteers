using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewHomeCareMessages : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
}

public class ViewHomeCareMessagesHandler : IRequestHandler<ViewHomeCareMessages, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;

    public ViewHomeCareMessagesHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewHomeCareMessages request, CancellationToken cancellationToken)
    {
        var activeHomeCareRequest = await _repository.Get<HomeCareRequest>(request.HomeCareRequestId, tracking: false,
            action: x => x.Include(y => y.Patient).Include(y => y.Requester).Include(y => y.Responder));
        if (activeHomeCareRequest == null) return Results.BadRequest();

        if (activeHomeCareRequest.Patient.Status == PatientStatus.ReceivingHomeCare &&
            activeHomeCareRequest.Responder != null &&
            activeHomeCareRequest.Responder.Id == _userContext.Id &&
            activeHomeCareRequest.Dropoff == null)
        {
            var messages = await _repository.GetAll<HomeCareMessage>(x =>
                x.Patient.Id == activeHomeCareRequest.Patient.Id, tracking: false,
                action: x => x.Include(y => y.Patient).Include(y => y.Author));

            foreach (var message in messages)
            {
                message.Me = message.Author?.Id == _userContext.Id;
                message.Author?.CleanUser(_encryptionService);
            }

            return Results.Ok(messages);
        }
        else
        {
            return Results.BadRequest();
        }
    }
}
