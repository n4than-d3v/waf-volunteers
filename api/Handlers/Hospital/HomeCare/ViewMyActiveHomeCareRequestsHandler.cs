using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewMyActiveHomeCareRequests : IRequest<IResult>
{
}

public class ViewMyActiveHomeCareRequestsHandler : IRequestHandler<ViewMyActiveHomeCareRequests, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;

    public ViewMyActiveHomeCareRequestsHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewMyActiveHomeCareRequests request, CancellationToken cancellationToken)
    {
        var activeHomeCareRequests = await _repository.GetAll<HomeCareRequest>(
            x => x.Patient.Status == PatientStatus.ReceivingHomeCare && x.Responder != null && x.Responder.Id == _userContext.Id && x.Dropoff == null, tracking: false,
            action: x => x
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Species)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.SpeciesVariant)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Pen)
                        .ThenInclude(p => p.Area)
                .Include(y => y.Requester).Include(y => y.Responder));

        foreach (var req in activeHomeCareRequests)
        {
            req.Requester?.CleanUser(_encryptionService);
            req.Responder?.CleanUser(_encryptionService);
        }

        return Results.Ok(activeHomeCareRequests);
    }
}
