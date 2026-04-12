using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class TransferHomeCare : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public int HomeCarerId { get; set; }

    public TransferHomeCare WithId(int id)
    {
        HomeCareRequestId = id;
        return this;
    }
}

public class TransferHomeCareHandler : IRequestHandler<TransferHomeCare, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public TransferHomeCareHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(TransferHomeCare request, CancellationToken cancellationToken)
    {
        var existingHomeCareRequest = await _repository.Get<HomeCareRequest>(
            request.HomeCareRequestId,
            action: x => x.Include(y => y.Patient)
        );
        if (existingHomeCareRequest == null)
            return Results.BadRequest();

        var responder = await _repository.Get<Account>(request.HomeCarerId);
        if (responder == null)
            return Results.BadRequest();

        existingHomeCareRequest.Dropoff = DateTime.UtcNow;
        var patient = existingHomeCareRequest.Patient;
        patient.CurrentHomeCarer = null;

        await _repository.SaveChangesAsync();

        await _mediator.Send(
            new RequireHomeCare
            {
                PatientId = existingHomeCareRequest.Patient.Id,
                HomeCarerId = request.HomeCarerId,
                Notes = existingHomeCareRequest.Notes,
            },
            cancellationToken
        );

        return Results.Accepted();
    }
}
