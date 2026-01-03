using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class UpsertAdministrationMethod : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Description { get; set; }
}

public class UpsertAdministrationMethodHandler : IRequestHandler<UpsertAdministrationMethod, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertAdministrationMethodHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertAdministrationMethod request, CancellationToken cancellationToken)
    {
        AdministrationMethod administrationMethod;
        if (request.Id != null)
        {
            administrationMethod = await _repository.Get<AdministrationMethod>(request.Id.Value);
            if (administrationMethod == null) return Results.BadRequest();

            administrationMethod.Description = request.Description;
        }
        else
        {
            administrationMethod = new AdministrationMethod
            {
                Description = request.Description
            };
            _repository.Create(administrationMethod);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
