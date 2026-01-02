using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatients : IRequest<IResult>
{
    public PatientStatus Status { get; set; }
}

public class ViewPatientsHandler : IRequestHandler<ViewPatients, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ViewPatientsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewPatients request, CancellationToken cancellationToken)
    {
        var patients = await _repository.GetAll<Patient>(
            x => x.Status == request.Status, tracking: false,
            x => x
                .AsSplitQuery()
                .IncludeAdmission()
                .IncludeBasicDetails()
                .IncludeHusbandry());
        return Results.Ok(patients);
    }
}
