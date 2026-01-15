using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Microsoft.Graph.Models;
using Newtonsoft.Json;
using static Azure.Core.HttpHeader;
using System.Threading;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Org.BouncyCastle.Ocsp;
using static Microsoft.Graph.Constants;

namespace Api.Database;

public static class Seed
{
    private const string EmptyHtml = "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"attrs\":{\"align\":null,\"indent\":null}}]}";

    private static async Task SetupMedications(this DatabaseContext context)
    {
        if (context.Medications.Any()) return;

        var json = await File.ReadAllTextAsync("medications.json")!;
        List<CreateMedication> commands = JsonConvert.DeserializeObject<List<CreateMedication>>(json)!;

        string[] waterfowl = ["Blue Swedish Duck", "Canada Goose", "Common Coot", "Common Moorhen", "Duck", "Egyptian Goose", "Greylag Goose", "Little Grebe", "Mallard", "Mute Swan", "Tufted Duck", "Water Rail", "Unidentified Goose"];
        string[] pigeons = ["Collared Dove", "Common Wood Pigeon", "Domestic Dove", "Domestic Pigeon", "Fancy Pigeon", "Pigeon", "Stock Dove", "Unidentified Pigeon"];
        string[] raptors = ["Barn Owl", "Common Buzzard", "Common Kestrel", "Goshawk", "Hobby", "Little Owl", "Merlin", "Peregrine Falcon", "Red Kite", "Sparrowhawk", "Tawny Owl", "Ural Owl"];
        string[] rodents = ["Bank Vole", "Black Rat", "Brown Rat", "Common Vole", "Field Mouse", "Field Vole", "Gray Squirrel", "Harvest Mouse", "House Mouse", "Hazel Dormouse", "Rat", "Red Squirrel", "Wood Mouse", "Yellow-necked Field Mouse", "Unidentified Mouse", "Unidentified Rodent"];

        foreach (var command in commands)
        {
            var medication = new Medication
            {
                ActiveSubstance = command.Drug,
                Brands = command.Brands,
                Notes = command.Notes ?? string.Empty,
                Concentrations = []
            };
            foreach (var form in command.Forms)
            {
                var concentration = new MedicationConcentration
                {
                    Medication = medication,
                    Form = form.Form,
                    ConcentrationMgMl = form.ConcentrationMgMl,
                    SpeciesDoses = []
                };
                foreach (var dose in form.Doses)
                {
                    if (dose.SpeciesType != null)
                    {
                        if (dose.SpeciesType == MedicationSpeciesType.Mammal
                            || dose.SpeciesType == MedicationSpeciesType.Bird
                            || dose.SpeciesType == MedicationSpeciesType.Amphibian
                            || dose.SpeciesType == MedicationSpeciesType.Reptile)
                        {
                            concentration.SpeciesDoses.Add(new MedicationConcentrationSpeciesDose
                            {
                                MedicationConcentration = concentration,
                                SpeciesType = (SpeciesType)dose.SpeciesType,
                                DoseMgKgRangeStart = dose.DoseMgKgRangeStart,
                                DoseMgKgRangeEnd = dose.DoseMgKgRangeEnd,
                                DoseMlKgRangeStart = dose.DoseMlKgRangeStart,
                                DoseMlKgRangeEnd = dose.DoseMlKgRangeEnd,
                                AdministrationMethod = string.IsNullOrWhiteSpace(dose.AdministrationMethod) ? null : context.AdministrationMethods.Single(x => x.Code == dose.AdministrationMethod),
                                Frequency = dose.Frequency,
                                Notes = dose.Notes ?? string.Empty
                            });
                        }
                        else
                        {
                            foreach (var species in
                                (dose.SpeciesType == MedicationSpeciesType.Waterfowl ? waterfowl :
                                (dose.SpeciesType == MedicationSpeciesType.Pigeons ? pigeons :
                                (dose.SpeciesType == MedicationSpeciesType.Raptors ? raptors :
                                (dose.SpeciesType == MedicationSpeciesType.Rodents ? rodents : [])))))
                            {
                                concentration.SpeciesDoses.Add(new MedicationConcentrationSpeciesDose
                                {
                                    MedicationConcentration = concentration,
                                    Species = context.Species.Single(x => x.Name == species),
                                    DoseMgKgRangeStart = dose.DoseMgKgRangeStart,
                                    DoseMgKgRangeEnd = dose.DoseMgKgRangeEnd,
                                    DoseMlKgRangeStart = dose.DoseMlKgRangeStart,
                                    DoseMlKgRangeEnd = dose.DoseMlKgRangeEnd,
                                    AdministrationMethod = context.AdministrationMethods.Single(x => x.Code == dose.AdministrationMethod),
                                    Frequency = dose.Frequency,
                                    Notes = dose.Notes ?? string.Empty
                                });
                            }
                        }
                    }
                    else
                    {
                        concentration.SpeciesDoses.Add(new MedicationConcentrationSpeciesDose
                        {
                            MedicationConcentration = concentration,
                            Species = context.Species.Single(x => x.Name == dose.Species),
                            DoseMgKgRangeStart = dose.DoseMgKgRangeStart,
                            DoseMgKgRangeEnd = dose.DoseMgKgRangeEnd,
                            DoseMlKgRangeStart = dose.DoseMlKgRangeStart,
                            DoseMlKgRangeEnd = dose.DoseMlKgRangeEnd,
                            AdministrationMethod = string.IsNullOrWhiteSpace(dose.AdministrationMethod) ? null : context.AdministrationMethods.Single(x => x.Code == dose.AdministrationMethod),
                            Frequency = dose.Frequency,
                            Notes = dose.Notes ?? string.Empty
                        });
                    }
                }
                medication.Concentrations.Add(concentration);
            }
            context.Medications.Add(medication);
        }
    }

    private static async Task SetupSpecies(this DatabaseContext context)
    {
        if (context.Species.Any()) return;

        #region Species

        List<string> amphibiansAges = ["Infant", "Adult"];
        List<string> amphibians = ["Common Pond Frog", "Common Toad", "Marsh Frog", "Green Frog", "Smooth Newt", "Unidentified Newt", "Unidentified Toad", "Unidentified Frog"];
        List<string> birdsAges = ["Egg", "Hatchling", "Nestling", "Fledgling", "Juvenile", "Adult"];
        List<string> birds = ["Barn Owl", "Barn Swallow", "Black-headed Gull", "Blackbird", "Blackcap", "Blue Jay", "Blue Swedish Duck", "Blue Tit", "Canada Goose", "Carrion Crow", "Chaffinch", "Coal Tit", "Collared Dove", "Common Buzzard", "Common Chiffchaff", "Common Coot", "Common Kestrel", "Common Kingfisher", "Common Magpie", "Common Moorhen", "Common Pheasant", "Common Starling", "Common Swift", "Common Tern", "Common Wood Pigeon", "Cormorant", "Domestic Dove", "Domestic Pigeon", "Duck", "Dunnock", "Egyptian Goose", "English Sparrow", "Bullfinch", "Jackdaw", "Jay", "Siskin", "Sparrowhawk", "Treecreeper", "Woodcock", "Wren", "Wryneck", "Goldfinch", "Greenfinch", "Robin", "Fancy Pigeon", "Fieldfare", "Finch", "Firecrest", "Garden Warbler", "Goldcrest", "Goldfinch", "Goshawk", "Great Spotted Woodpecker", "Great Tit", "Green Parakeet", "Green Woodpecker", "Grey Heron", "Grey Wagtail", "Greylag Goose", "Gull", "Herring Gull", "Hobby", "House Martin", "Indian Ring-necked Parakeet", "Lapwing", "Lesser Black-backed Gull", "Lesser Spotted Woodpecker", "Little Egret", "Little Grebe", "Little Owl", "Little Ringed Plover", "Long-tailed Tit", "Mallard", "Merlin", "Mistle Thrush", "Mute Swan", "Nuthatch", "Partridge", "Peregrine Falcon", "Pied Wagtail", "Pigeon", "Quail", "Red Kite", "Red-legged Partridge", "Redpoll", "Redstart", "Redwing", "Sedge Warbler", "Skylark", "Song Thrush", "Sparrow", "Stock Dove", "Swallow", "Tawny Owl", "Thrush-like Wren", "Tufted Duck", "Ural Owl", "Warbler", "Water Rail", "Woodpecker", "Wren", "Yellow Wagtail", "Zebra Finch", "Unidentified Goose", "Unidentified Parakeet", "Unidentified Passerine", "Unidentified Pheasant", "Unidentified Thrush", "Unidentified Pigeon", "Unidentified Bird"];
        List<string> mammalsAges = ["Neonate", "Infant", "Juvenile", "Sub-adult", "Adult"];
        List<string> mammals = ["Badger", "Bank Vole", "Black Rat", "Brown Hare", "Brown Long-eared Bat", "Brown Rat", "Chinese Muntjak", "Common Pipistrelle", "Common Shrew", "Common Vole", "Hare", "Hedgehog", "Polecat", "Rabbit", "Roe Deer", "Field Mouse", "Field Vole", "Gray Squirrel", "Grey Long-eared Bat", "Harvest Mouse", "House Mouse", "Hazel Dormouse", "Leisler's Bat", "Long-eared Myotis", "Mole", "Rat", "Red Deer", "Red Fox", "Shrew", "Red Squirrel", "Weasel", "Whiskered Bat", "Wood Mouse", "Yellow-necked Field Mouse", "Unidentified Bat", "Unidentified Deer", "Unidentified Mouse", "Unidentified Rodent"];
        List<string> reptilesAges = ["Egg", "Infant", "Adult"];
        List<string> reptiles = ["Common Slow Worm", "Corn Snake", "Grass Snake"];

        #endregion

        List<CreateSpecies> commands = [
            new CreateSpecies { Type = SpeciesType.Amphibian, Names = amphibians, Ages = amphibiansAges },
            new CreateSpecies { Type = SpeciesType.Bird, Names = birds, Ages = birdsAges },
            new CreateSpecies { Type = SpeciesType.Mammal, Names = mammals, Ages = mammalsAges },
            new CreateSpecies { Type = SpeciesType.Reptile, Names = reptiles, Ages = reptilesAges },
        ];
        foreach (var command in commands)
        {
            foreach (var name in command.Names)
            {
                var species = new Species
                {
                    Name = name,
                    SpeciesType = command.Type,
                    Variants = []
                };
                int i = 1;
                foreach (var age in command.Ages)
                {
                    var speciesVariant = new SpeciesVariant { Species = species, Name = $"{age}", FriendlyName = $"{age} {name}", Order = i, FeedingGuidance = EmptyHtml };
                    species.Variants.Add(speciesVariant);
                    i++;
                }
                context.Species.Add(species);
            }
        }
    }

    private static async Task SetupAreas(DatabaseContext context)
    {
        if (context.Areas.Any()) return;

        #region Areas

        var nur = new Area { Code = "NUR", Name = "Nursery", Pens = [] };
        for (int i = 1; i <= 29; i++) nur.Pens.Add(new Pen { Area = nur, Code = "INC-" + i.ToString("D2") });
        for (int i = 1; i <= 8; i++) nur.Pens.Add(new Pen { Area = nur, Code = "FC-" + i.ToString("D2") });

        var fp = new Area { Code = "FP", Name = "Fox pens", Pens = [] };
        for (int i = 1; i <= 28; i++) fp.Pens.Add(new Pen { Area = fp, Code = i.ToString("D2") });

        var ds = new Area { Code = "DS", Name = "Deer sheds", Pens = [] };
        for (int i = 1; i <= 3; i++) ds.Pens.Add(new Pen { Area = ds, Code = i.ToString("D2") });

        var dp = new Area { Code = "DP", Name = "Deer paddocks", Pens = [] };
        for (int i = 1; i <= 4; i++) dp.Pens.Add(new Pen { Area = dp, Code = i.ToString("D2") });

        var hc = new Area { Code = "HC", Name = "Hutches", Pens = [] };
        for (int i = 1; i <= 21; i++) hc.Pens.Add(new Pen { Area = hc, Code = i.ToString("D2") });

        var np = new Area { Code = "NP", Name = "Nursery ponds", Pens = [] };
        for (int i = 1; i <= 3; i++) np.Pens.Add(new Pen { Area = np, Code = i.ToString("D2") });

        var h2 = new Area { Code = "H2", Name = "Hospital 2", Pens = [] };
        for (int i = 1; i <= 33; i++) h2.Pens.Add(new Pen { Area = h2, Code = "CARR-" + i.ToString("D2") });
        for (int i = 1; i <= 8; i++) h2.Pens.Add(new Pen { Area = h2, Code = "CAGE-" + i.ToString("D2") });

        var avry = new Area { Code = "AVRY", Name = "Aviaries", Pens = [] };
        avry.Pens.Add(new Pen { Area = avry, Code = "HP1" });
        avry.Pens.Add(new Pen { Area = avry, Code = "H2" });
        avry.Pens.Add(new Pen { Area = avry, Code = "TB" });
        avry.Pens.Add(new Pen { Area = avry, Code = "POND" });
        for (int i = 1; i <= 4; i++)
            avry.Pens.Add(new Pen { Area = avry, Code = "ORCH-" + i.ToString("D2") });
        for (int i = 1; i <= 4; i++)
            avry.Pens.Add(new Pen { Area = avry, Code = "TENN-" + i.ToString("D2") });

        var iso = new Area { Code = "ISO", Name = "Isolation", Pens = [] };
        for (int i = 1; i <= 3; i++) iso.Pens.Add(new Pen { Area = iso, Code = i.ToString("D2") });

        var hh = new Area { Code = "HH", Name = "Hacking houses", Pens = [] };
        for (int i = 3; i <= 4; i++) hh.Pens.Add(new Pen { Area = hh, Code = i.ToString("D2") });

        var flight = new Area { Code = "FLT", Name = "Flights", Pens = [] };
        flight.Pens.Add(new Pen { Area = flight, Code = "SMALL" });
        flight.Pens.Add(new Pen { Area = flight, Code = "LARGE" });

        var su1 = new Area { Code = "SU1", Name = "Silent Unit 1", Pens = [] };
        for (int i = 1; i <= 8; i++) su1.Pens.Add(new Pen { Area = su1, Code = i.ToString("D2") });

        var su3 = new Area { Code = "SU3", Name = "Silent Unit 3", Pens = [] };
        for (int i = 1; i <= 8; i++) su3.Pens.Add(new Pen { Area = su3, Code = i.ToString("D2") });

        var su4 = new Area { Code = "SU4", Name = "Silent Unit 4", Pens = [] };
        for (int i = 1; i <= 26; i++) su4.Pens.Add(new Pen { Area = su4, Code = i.ToString("D2") });

        var qrnt = new Area { Code = "QRNT", Name = "Quarantine", Pens = [] };
        for (int i = 1; i <= 13; i++) qrnt.Pens.Add(new Pen { Area = qrnt, Code = i.ToString("D2") });

        context.Areas.AddRange(nur, fp, ds, dp, hc, np, h2, avry, iso, hh, flight, su1, su3, su4, qrnt);

        #endregion
    }

    #region DTOs

    public class CreateMedication
    {
        public string Drug { get; set; }
        public string[] Brands { get; set; }
        public string Notes { get; set; }
        public List<CMForm> Forms { get; set; }

        public class CMForm
        {
            public string Form { get; set; }
            public double ConcentrationMgMl { get; set; }
            public List<CMFSpecies> Doses { get; set; }

            public class CMFSpecies
            {
                public string? Species { get; set; }
                public MedicationSpeciesType? SpeciesType { get; set; }
                public double DoseMgKgRangeStart { get; set; }
                public double DoseMgKgRangeEnd { get; set; }
                public double DoseMlKgRangeStart { get; set; }
                public double DoseMlKgRangeEnd { get; set; }
                public string? AdministrationMethod { get; set; }
                public string? Frequency { get; set; }
                public string Notes { get; set; }
            }
        }
    }

    public enum MedicationSpeciesType
    {
        Mammal = 1,
        Bird = 2,
        Amphibian = 3,
        Reptile = 4,
        Waterfowl = 5,
        Pigeons = 6,
        Raptors = 7,
        Rodents = 8
    }

    private class CreateSpecies
    {
        public SpeciesType Type { get; set; }
        public List<string> Names { get; set; }
        public List<string> Ages { get; set; }
    }

    #endregion

    public static async Task SetupHospitalReferenceData(this DatabaseContext context)
    {
        if (!context.Attitudes.Any())
        {
            context.Attitudes.AddRange(
                new Attitude { Description = "Alert" },
                new Attitude { Description = "Spicy" },
                new Attitude { Description = "Quiet" },
                new Attitude { Description = "Depressed" },
                new Attitude { Description = "Obtunded" },
                new Attitude { Description = "Stuporous" },
                new Attitude { Description = "Non-responsive" }
            );
        }
        if (!context.BodyConditions.Any())
        {
            context.BodyConditions.AddRange(
                new BodyCondition { Description = "Plump" },
                new BodyCondition { Description = "Good" },
                new BodyCondition { Description = "Reasonable" },
                new BodyCondition { Description = "Thin" },
                new BodyCondition { Description = "Emaciated" }
            );
        }
        if (!context.Dehydrations.Any())
        {
            context.Dehydrations.AddRange(
                new Dehydration { Description = "None" },
                new Dehydration { Description = "Mild" },
                new Dehydration { Description = "Moderate" },
                new Dehydration { Description = "Severe" }
            );
        }
        if (!context.MucousMembraneColours.Any())
        {
            context.MucousMembraneColours.AddRange(
                new MucousMembraneColour { Description = "Pink" },
                new MucousMembraneColour { Description = "Pale" },
                new MucousMembraneColour { Description = "White" },
                new MucousMembraneColour { Description = "Blue" },
                new MucousMembraneColour { Description = "Yellow" },
                new MucousMembraneColour { Description = "Pigmented" },
                new MucousMembraneColour { Description = "Dark red" }
            );
        }
        if (!context.MucousMembraneTextures.Any())
        {
            context.MucousMembraneTextures.AddRange(
                new MucousMembraneTexture { Description = "Moist" },
                new MucousMembraneTexture { Description = "Tacky" },
                new MucousMembraneTexture { Description = "Dry" },
                new MucousMembraneTexture { Description = "Oily" }
            );
        }
        if (!context.AdministrationMethods.Any())
        {
            context.AdministrationMethods.AddRange(
                new AdministrationMethod { Description = "Oral", Code = "PO" },
                new AdministrationMethod { Description = "Subcutaneous", Code = "SQ" },
                new AdministrationMethod { Description = "Intramuscular", Code = "IM" },
                new AdministrationMethod { Description = "Intravenous", Code = "IV" },
                new AdministrationMethod { Description = "Topical", Code = "TP" },
                new AdministrationMethod { Description = "Intranasal", Code = "IN" },
                new AdministrationMethod { Description = "Both eyes", Code = "OU" },
                new AdministrationMethod { Description = "Right eye", Code = "OD" },
                new AdministrationMethod { Description = "Left eye", Code = "OS" },
                new AdministrationMethod { Description = "Intraperitoneal", Code = "IP" },
                new AdministrationMethod { Description = "Intraosseous", Code = "IO" },
                new AdministrationMethod { Description = "Intracardiac", Code = "IC" },
                new AdministrationMethod { Description = "Intracoelomic", Code = "ICL" }
            );
        }
        if (!context.ReleaseTypes.Any())
        {
            context.ReleaseTypes.AddRange(
                new ReleaseType { Description = "Hard" },
                new ReleaseType { Description = "Soft" },
                new ReleaseType { Description = "Hack" },
                new ReleaseType { Description = "Escape" },
                new ReleaseType { Description = "Returned to rescuer" },
                new ReleaseType { Description = "Reunited with family" }
            );
        }
        if (!context.DispositionReasons.Any())
        {
            context.DispositionReasons.AddRange(
                new DispositionReason { Description = "Failure to thrive", Communication = string.Empty },
                new DispositionReason { Description = "Extensive wounds", Communication = string.Empty },
                new DispositionReason { Description = "NAD - Returned to Rescuer / Finder", Communication = string.Empty },
                new DispositionReason { Description = "Multiple seizures", Communication = string.Empty },
                new DispositionReason { Description = "Organ failure - Jaundice", Communication = string.Empty },
                new DispositionReason { Description = "Abnormal behaviour", Communication = string.Empty },
                new DispositionReason { Description = "Severe infection", Communication = string.Empty },
                new DispositionReason { Description = "Disease", Communication = string.Empty },
                new DispositionReason { Description = "Catastrophic injuries", Communication = string.Empty },
                new DispositionReason { Description = "Severe paraside burden", Communication = string.Empty },
                new DispositionReason { Description = "Loss of limb", Communication = string.Empty },
                new DispositionReason { Description = "Blind", Communication = string.Empty },
                new DispositionReason { Description = "Emaciated", Communication = string.Empty },
                new DispositionReason { Description = "No improvement post-treatment", Communication = string.Empty },
                new DispositionReason { Description = "Sepsis", Communication = string.Empty },
                new DispositionReason { Description = "Zoonotic disease", Communication = string.Empty },
                new DispositionReason { Description = "Invasive species", Communication = string.Empty },
                new DispositionReason { Description = "Welfare grounds", Communication = string.Empty },
                new DispositionReason { Description = "Unlikely to survive", Communication = string.Empty },
                new DispositionReason { Description = "Neurological damage", Communication = string.Empty },
                new DispositionReason { Description = "Respiratory distress", Communication = string.Empty },
                new DispositionReason { Description = "Old age", Communication = string.Empty },
                new DispositionReason { Description = "Unknown", Communication = string.Empty },
                new DispositionReason { Description = "Toxin ingestion", Communication = string.Empty }
            );
        }

        await context.SaveChangesAsync();

        await SetupAreas(context);
        await SetupSpecies(context);

        await context.SaveChangesAsync();

        await SetupMedications(context);

        try
        {
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
        }
    }
}
