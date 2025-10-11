using Api.Services;
using MediatR;

namespace Api.Handlers.Rota;

public class ViewRota : IRequest<IResult>
{
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
}

public class ViewRotaHandler : IRequestHandler<ViewRota, IResult>
{
    private readonly IRotaService _rotaService;

    public ViewRotaHandler(IRotaService rotaService)
    {
        _rotaService = rotaService;
    }

    public async Task<IResult> Handle(ViewRota request, CancellationToken cancellationToken)
    {
        if (request.End <= request.Start) return Results.BadRequest();

        var rota = await _rotaService.GetRotaAsync(request.Start, request.End);
        return Results.Ok(rota);
    }
}
