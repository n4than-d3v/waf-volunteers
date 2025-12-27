namespace Api.Extensions;

public static class DateOnlyExtensions
{
    private static readonly DateOnly _weekOneStart = new(2025, 11, 10);

    public static int GetRotaWeek(this DateOnly date)
    {
        return (((date.DayNumber - _weekOneStart.DayNumber) / 7) % 2 == 0) ? 1 : 2;
    }

    public static bool IsOn(this DateOnly date, DayOfWeek dayOfWeek)
    {
        return date.DayOfWeek == dayOfWeek;
    }

    public static bool IsOn(this DateOnly date, DayOfWeek dayOfWeek, int? week)
    {
        if (week == null) return IsOn(date, dayOfWeek);
        return IsOn(date, dayOfWeek) && GetRotaWeek(date) == week;
    }
}
