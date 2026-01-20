using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class DroppedOffHomeCare : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public int PenId { get; set; }

    public DroppedOffHomeCare WithId(int id)
    {
        HomeCareRequestId = id;
        return this;
    }
}

public class DroppedOffHomeCareHandler : IRequestHandler<DroppedOffHomeCare, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public DroppedOffHomeCareHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(DroppedOffHomeCare request, CancellationToken cancellationToken)
    {
        var homeCareRequest = await _repository.Get<HomeCareRequest>(request.HomeCareRequestId, action: x => x.Include(y => y.Patient));
        if (homeCareRequest == null) return Results.BadRequest();

        var patient = homeCareRequest.Patient;

        patient.Status = PatientStatus.Inpatient;
        homeCareRequest.Dropoff = DateTime.UtcNow;

        await _repository.SaveChangesAsync();

        return await _mediator.Send(new Patients.MovePatient
        {
            PatientId = patient.Id,
            PenId = request.PenId
        }, cancellationToken);
    }
}
