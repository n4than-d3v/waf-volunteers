using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Rechecks;

public class UpdateRecheck : IRequest<IResult>
{
    public int Id { get; set; }

    public RecheckRoles Roles { get; set; }
    public string Description { get; set; }
    public DateOnly Due { get; set; }
    public bool RequireWeight { get; set; }

    public UpdateRecheck WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateRecheckHandler : IRequestHandler<UpdateRecheck, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateRecheckHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateRecheck request, CancellationToken cancellationToken)
    {
        var recheck = await _repository.Get<PatientRecheck>(request.Id);
        if (recheck == null) return Results.BadRequest();

        recheck.Description = request.Description;
        recheck.Roles = request.Roles;
        recheck.RequireWeight = request.RequireWeight;
        recheck.Due = request.Due;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
