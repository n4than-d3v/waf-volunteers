namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public interface IFeeding
{
    public TimeOnly Time { get; set; }
    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Food Food { get; set; }
    public bool TopUp { get; set; }
    public string? Notes { get; set; }
}
