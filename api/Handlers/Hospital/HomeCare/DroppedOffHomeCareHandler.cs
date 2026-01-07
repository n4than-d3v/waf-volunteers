using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class DroppedOffHomeCare : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
}

public class DroppedOffHomeCareHandler : IRequestHandler<DroppedOffHomeCare, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DroppedOffHomeCareHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DroppedOffHomeCare request, CancellationToken cancellationToken)
    {
        var homeCareRequest = await _repository.Get<HomeCareRequest>(request.HomeCareRequestId, action: x => x.Include(y => y.Patient));
        if (homeCareRequest == null) return Results.BadRequest();

        var patient = homeCareRequest.Patient;

        patient.Status = PatientStatus.Inpatient;

        homeCareRequest.Dropoff = DateTime.UtcNow;

        await _repository.SaveChangesAsync();
        return Results.Accepted();
    }
}
