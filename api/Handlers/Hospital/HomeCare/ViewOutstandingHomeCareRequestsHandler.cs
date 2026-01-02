using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewOutstandingHomeCareRequests : IRequest<IResult>
{
}

public class ViewOutstandingHomeCareRequestsHandler : IRequestHandler<ViewOutstandingHomeCareRequests, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ViewOutstandingHomeCareRequestsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewOutstandingHomeCareRequests request, CancellationToken cancellationToken)
    {
        var outstandingHomeCareRequests = await _repository.GetAll<HomeCareRequest>(
            x => x.Responded == null, tracking: false,
            action: x => x.Include(y => y.Patient).Include(y => y.Requested).Include(y => y.Responder));
        return Results.Ok(outstandingHomeCareRequests);
    }
}
