using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using Api.Handlers.Hospital.Patients;
using Api.Database.Entities.Account;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewOutstandingHomeCareRequests : IRequest<IResult>
{
}

public class ViewOutstandingHomeCareRequestsHandler : IRequestHandler<ViewOutstandingHomeCareRequests, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;

    public ViewOutstandingHomeCareRequestsHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(ViewOutstandingHomeCareRequests request, CancellationToken cancellationToken)
    {
        var account = await _repository.Get<Account>(_userContext.Id, tracking: false);
        if (account == null) return Results.BadRequest();

        var outstandingHomeCareRequests = await _repository.GetAll<HomeCareRequest>(
            x =>
                x.Patient.Status == PatientStatus.PendingHomeCare &&
                x.Responded == null &&
                x.Patient.Species != null &&
                (
                    x.Patient.Species.HomeCarerPermissions == null ||
                    x.Patient.Species.HomeCarerPermissions == HomeCarerPermissions.None ||
                    (account.HomeCarerPermissions & x.Patient.Species.HomeCarerPermissions.Value) != 0
                ),
            tracking: false,
            action: x => x
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Species)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.SpeciesVariant)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Pen)
                        .ThenInclude(p => p.Area)
                .Include(y => y.Requester)
                .Include(y => y.Responder)
        );

        foreach (var req in outstandingHomeCareRequests)
        {
            req.Requester?.CleanUser(_encryptionService);
            req.Responder?.CleanUser(_encryptionService);
        }

        return Results.Ok(outstandingHomeCareRequests);
    }
}
