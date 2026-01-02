using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database;
using MediatR;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class ViewMyActiveHomeCareRequests : IRequest<IResult>
{
}

public class ViewMyActiveHomeCareRequestsHandler : IRequestHandler<ViewMyActiveHomeCareRequests, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public ViewMyActiveHomeCareRequestsHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(ViewMyActiveHomeCareRequests request, CancellationToken cancellationToken)
    {
        var outstandingHomeCareRequests = await _repository.GetAll<HomeCareRequest>(
            x => x.Responder != null && x.Responder.Id == _userContext.Id && x.Dropoff == null, tracking: false,
            action: x => x.Include(y => y.Patient).Include(y => y.Requested).Include(y => y.Responder));
        return Results.Ok(outstandingHomeCareRequests);
    }
}
