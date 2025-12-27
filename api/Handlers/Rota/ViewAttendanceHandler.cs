using Api.Services;
using MediatR;

namespace Api.Handlers.Rota;

public class ViewAttendance:IRequest<IResult>
{
    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }
}

public class ViewAttendanceHandler : IRequestHandler<ViewAttendance, IResult>
{
    private readonly IRotaService _rotaService;

    public ViewAttendanceHandler(IRotaService rotaService)
    { 
        _rotaService = rotaService;
    }

    public async Task<IResult> Handle(ViewAttendance request, CancellationToken cancellationToken)
    {
        if (request.End <= request.Start) return Results.BadRequest();

        var reports = await _rotaService.GetReportAsync(request.Start, request.End);
        return Results.Ok(reports);
    }
}
