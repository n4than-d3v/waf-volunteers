using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Rechecks;

public class AddRecheck : IRequest<IResult>
{
    public int PatientId { get; set; }
    public RecheckRoles Roles { get; set; }
    public string Description { get; set; }
    public DateOnly Due { get; set; }
    public bool RequireWeight { get; set; }

    public AddRecheck WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class AddRecheckHandler : IRequestHandler<AddRecheck, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddRecheckHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddRecheck request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var recheck = new PatientRecheck
        {
            Patient = patient,
            Description = request.Description,
            Roles = request.Roles,
            RequireWeight = request.RequireWeight,
            Due = request.Due
        };

        _repository.Create(recheck);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
