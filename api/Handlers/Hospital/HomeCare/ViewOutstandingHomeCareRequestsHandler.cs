using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using Api.Handlers.Hospital.Patients;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewOutstandingHomeCareRequests : IRequest<IResult>
{
}

public class ViewOutstandingHomeCareRequestsHandler : IRequestHandler<ViewOutstandingHomeCareRequests, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewOutstandingHomeCareRequestsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewOutstandingHomeCareRequests request, CancellationToken cancellationToken)
    {
        var outstandingHomeCareRequests = await _repository.GetAll<HomeCareRequest>(
            x => x.Patient.Status == PatientStatus.PendingHomeCare && x.Responded == null, tracking: false,
            action: x => x
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Species)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.SpeciesVariant)
                .Include(y => y.Patient)
                    .ThenInclude(p => p.Pen)
                        .ThenInclude(p => p.Area)
                .Include(y => y.Requester).Include(y => y.Responder));

        foreach (var req in outstandingHomeCareRequests)
        {
            req.Requester?.CleanUser(_encryptionService);
            req.Responder?.CleanUser(_encryptionService);
        }

        return Results.Ok(outstandingHomeCareRequests);
    }
}
