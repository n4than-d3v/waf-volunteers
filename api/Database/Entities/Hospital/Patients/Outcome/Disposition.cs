namespace Api.Database.Entities.Hospital.Patients.Outcome;

public enum Disposition
{
    Released = 1,
    Transferred = 2,
    DeadOnArrival = 3,
    DiedBefore24Hrs = 4,
    DiedAfter24Hrs = 5,
    PtsBefore24Hrs = 6,
    PtsAfter24Hrs = 7
}
