using Api.Database.Entities.Hospital.Patients.Medications;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Database.Entities.Stock;

public class StockItem : Entity
{
    public Medication Medication { get; set; }
    public MedicationConcentration MedicationConcentration { get; set; }
    public string Brand { get; set; }
    public StockMeasurement Measurement { get; set; }
    public int AfterOpeningLifetimeDays { get; set; }
    public int ReorderQuantity { get; set; }

    public List<StockItemBatch> Batches { get; set; }
}
