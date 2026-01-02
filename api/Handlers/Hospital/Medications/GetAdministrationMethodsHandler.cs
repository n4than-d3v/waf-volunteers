using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class GetAdministrationMethods : IRequest<IResult>
{
}

public class GetAdministrationMethodsHandler : IRequestHandler<GetAdministrationMethods, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetAdministrationMethodsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetAdministrationMethods request, CancellationToken cancellationToken)
    {
        var administrationMethods = await _repository.GetAll<AdministrationMethod>(x => true, tracking: false);
        return Results.Ok(administrationMethods);
    }
}
