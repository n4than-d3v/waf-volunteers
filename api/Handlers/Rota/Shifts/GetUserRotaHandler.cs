using Api.Services;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class GetUserRota : IRequest<IResult>
{
    public int? UserId { get; set; }
}

public class GetUserRotaHandler : IRequestHandler<GetUserRota, IResult>
{
    private readonly IRotaService _rotaService;
    private readonly IUserContext _context;

    public GetUserRotaHandler(IRotaService rotaService, IUserContext context)
    {
        _rotaService = rotaService;
        _context = context;
    }

    public async Task<IResult> Handle(GetUserRota request, CancellationToken cancellationToken)
    {
        var userId = request.UserId ?? _context.Id;
        var now = DateOnly.FromDateTime(DateTime.Now);

        var rota = await _rotaService.GetVolunteerRotaAsync(now, userId);
        return Results.Ok(rota);
    }
}
