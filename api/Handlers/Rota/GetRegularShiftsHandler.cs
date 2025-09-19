using MediatR;

namespace Api.Handlers.Rota;

public class GetRegularShifts : IRequest<IResult>
{

}

public class GetRegularShiftsHandler : IRequestHandler<GetRegularShifts, IResult>
{
    public GetRegularShiftsHandler()
    {

    }

    public async Task<IResult> Handle(GetRegularShifts request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
