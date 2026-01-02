using Api.Database;
using Api.Database.Entities.Hospital.Patients.Exams;
using MediatR;

namespace Api.Handlers.Hospital.Exams;

public class GetMucousMembraneColours : IRequest<IResult>
{
}

public class GetMucousMembraneColoursHandler : IRequestHandler<GetMucousMembraneColours, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetMucousMembraneColoursHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetMucousMembraneColours request, CancellationToken cancellationToken)
    {
        var mucousMembraneColours = await _repository.GetAll<MucousMembraneColour>(x => true, tracking: false);
        return Results.Ok(mucousMembraneColours);
    }
}
