using Api.Database.Entities.Hospital.Patients.Prescriptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Database;

public class PatientPrescriptionBaseTests
{
    public class TestPrescription
    : PatientPrescriptionBase<TestAdministration>
    {
    }

    public class TestAdministration : PatientPrescriptionAdministrationBase
    {
    }

    [Fact]
    public void AdministerToday_OneTime_NotYetAdministered_Returns_1()
    {
        // Arrange
        var prescription = new TestPrescription
        {
            Frequency = "One time",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        // Act
        var result = prescription.AdministerToday;

        // Assert
        Assert.Equal(1, result);
    }

    [Fact]
    public void AdministerToday_OneTime_AlreadyAdministeredYesterday_Returns_0()
    {
        // Arrange
        var prescription = new TestPrescription
        {
            Frequency = "One time",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>
            {
                new TestAdministration
                {
                    Administered = DateTime.Now.AddDays(-1)
                }
            }
        };

        // Act
        var result = prescription.AdministerToday;

        // Assert
        Assert.Equal(0, result);
    }

    [Fact]
    public void AdministerToday_OneTime_AlreadyAdministeredToday_Returns_1()
    {
        // Arrange
        var prescription = new TestPrescription
        {
            Frequency = "One time",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>
            {
                new TestAdministration
                {
                    Success = true,
                    Administered = DateTime.Now
                }
            }
        };

        // Act
        var result = prescription.AdministerToday;

        // Assert
        Assert.Equal(1, result);
    }

    [Fact]
    public void AdministerToday_Every1Hour_Returns24()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 1 hours",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(24, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_Every6Hours_Returns4()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 6 hours",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(4, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_Every1Day_Returns1()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 1 days",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_Every1Week_Returns1()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 1 weeks",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_Every1Week_Returns0()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 1 weeks",
            Start = DateOnly.FromDateTime(DateTime.Today.AddDays(-1)),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(0, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_Every1Week_Returns1_After1Week()
    {
        var prescription = new TestPrescription
        {
            Frequency = "Every 1 weeks",
            Start = DateOnly.FromDateTime(DateTime.Today.AddDays(-7)),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_2TimesPerHour_Returns48()
    {
        var prescription = new TestPrescription
        {
            Frequency = "2 times per hour",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(48, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_4TimesPerDay_Returns4()
    {
        var prescription = new TestPrescription
        {
            Frequency = "4 times per day",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(4, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_1TimePerDay_Returns1()
    {
        var prescription = new TestPrescription
        {
            Frequency = "1 times per day",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_7TimesPerWeek_Returns1()
    {
        var prescription = new TestPrescription
        {
            Frequency = "7 times per week",
            Start = DateOnly.FromDateTime(DateTime.Today),
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };

        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_StartToday_Returns1()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today));
        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_StartYesterday_Returns0()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-1)));
        Assert.Equal(0, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_Start2DaysAgo_Returns1()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-2)));
        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_Start3DaysAgo_Returns0()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-3)));
        Assert.Equal(0, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_Start4DaysAgo_Returns1()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-4)));
        Assert.Equal(1, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_Start5DaysAgo_Returns0()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-5)));
        Assert.Equal(0, prescription.AdministerToday);
    }

    [Fact]
    public void AdministerToday_3TimesPerWeek_Start6DaysAgo_Returns0()
    {
        var prescription = CreatePrescription(DateOnly.FromDateTime(DateTime.Today.AddDays(-6)));
        Assert.Equal(0, prescription.AdministerToday);
    }

    private static TestPrescription CreatePrescription(DateOnly start)
    {
        return new TestPrescription
        {
            Frequency = "3 times per week",
            Start = start,
            End = DateOnly.FromDateTime(DateTime.Today),
            Administrations = new List<TestAdministration>()
        };
    }

    [Fact]
    public void AdministeredToday_NoAdministrations_Returns_0()
    {
        // Arrange
        var prescription = new TestPrescription
        {
            Administrations = new List<TestAdministration>()
        };

        // Act
        var result = prescription.AdministeredToday;

        // Assert
        Assert.Equal(0, result);
    }

    [Fact]
    public void AdministeredToday_OnlyCountsSuccessAdministrationsFromToday()
    {
        // Arrange
        var prescription = new TestPrescription
        {
            Administrations = new List<TestAdministration>
            {
                new TestAdministration
                {
                    Success = true,
                    Administered = DateTime.Today.AddHours(1)
                },
                new TestAdministration
                {
                    Success = false,
                    Administered = DateTime.Today.AddHours(10)
                },
                new TestAdministration
                {
                    Success = true,
                    Administered = DateTime.Today.AddDays(-1) // yesterday
                }
            }
        };

        // Act
        var result = prescription.AdministeredToday;

        // Assert
        Assert.Equal(1, result);
    }
}
