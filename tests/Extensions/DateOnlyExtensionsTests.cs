using Api.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Extensions;

public class DateOnlyExtensionsTests
{
    private readonly DateOnly _start = new(2025, 11, 15);

    [Fact]
    public void IsWeekOne_First()
    {
        var saturday = _start;
        var sunday = saturday.AddDays(1);
        Assert.Equal(1, saturday.GetRotaWeek());
        Assert.Equal(1, sunday.GetRotaWeek());
    }

    [Fact]
    public void IsWeekTwo_Second()
    {
        var saturday = _start.AddDays(7);
        var sunday = saturday.AddDays(1);
        Assert.Equal(2, saturday.GetRotaWeek());
        Assert.Equal(2, sunday.GetRotaWeek());
    }

    [Fact]
    public void IsWeekOne_Third()
    {
        var saturday = _start.AddDays(14);
        var sunday = saturday.AddDays(1);
        Assert.Equal(1, saturday.GetRotaWeek());
        Assert.Equal(1, sunday.GetRotaWeek());
    }

    [Fact]
    public void IsWeekTwo_Fourth()
    {
        var saturday = _start.AddDays(21);
        var sunday = saturday.AddDays(1);
        Assert.Equal(2, saturday.GetRotaWeek());
        Assert.Equal(2, sunday.GetRotaWeek());
    }

    [Fact]
    public void IsOn_Monday_Without_Week_Check()
    {
        var date = _start.AddDays(2);
        Assert.True(date.IsOn(DayOfWeek.Monday, null));
    }

    [Fact]
    public void IsOn_Saturday_With_Week_One_Check()
    {
        var date = _start;
        Assert.True(date.IsOn(DayOfWeek.Saturday, 1));
    }

    [Fact]
    public void IsOn_Saturday_With_Week_Two_Check()
    {
        var date = _start;
        Assert.False(date.IsOn(DayOfWeek.Saturday, 2));
    }
}
