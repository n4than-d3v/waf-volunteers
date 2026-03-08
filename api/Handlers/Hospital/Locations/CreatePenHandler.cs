using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using MediatR;
using System.Text.RegularExpressions;

namespace Api.Handlers.Hospital.Locations;

public class CreatePen : IRequest<IResult>
{
    public int AreaId { get; set; }
    public string Code { get; set; }
}

public class CreatePenHandler : IRequestHandler<CreatePen, IResult>
{
    private readonly IDatabaseRepository _repository;

    public CreatePenHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(CreatePen request, CancellationToken cancellationToken)
    {
        var area = await _repository.Get<Area>(request.AreaId);
        if (area == null) return Results.BadRequest();

        var pen = new Pen
        {
            Area = area,
            Code = ConvertCode(request.Code)
        };

        _repository.Create(pen);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }

    private static string ConvertCode(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return input;

        input = input.Trim();

        var match = Regex.Match(input, @"^([A-Za-z]+)\s*(\d+)$");
        if (match.Success)
        {
            string letters = match.Groups[1].Value.ToUpper();
            int number = int.Parse(match.Groups[2].Value);
            return $"{letters}-{number:00}";
        }

        if (Regex.IsMatch(input, @"^\d+$"))
        {
            int number = int.Parse(input);
            return number.ToString("00");
        }

        return input.ToUpper();
    }
}
