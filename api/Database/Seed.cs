using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace Api.Database;

public static class Seed
{
    public static async Task LoadMedications(this DatabaseContext context)
    {
        try
        {
            const string url = "https://www.vmd.defra.gov.uk/productinformationdatabase/downloads/VMD_ProductInformationDatabase.xml";

            using var client = new HttpClient();
            var xmlContent = await client.GetStringAsync(url);

            var doc = XDocument.Parse(xmlContent);

            var products = doc
                .Descendants("CurrentAuthorisedProducts")
                .Where(p => (string)p.Element("Territory") == "Great Britain");

            var activeSubstances = products.Select(p => p.Element("ActiveSubstances")?.Value)
                .SelectMany(x => x.Split(",")).Select(x => x.Trim()).Distinct();
            foreach (var activeSubstance in activeSubstances)
                if (!context.ActiveSubstances.Any(x => x.Name == activeSubstance))
                    context.ActiveSubstances.Add(new ActiveSubstance { Name = activeSubstance });

            var targetSpecieses = products.Select(p => p.Element("TargetSpecies")?.Value)
                .SelectMany(x => x.Split(",")).Select(x => x.Trim()).Distinct();
            foreach (var targetSpecies in targetSpecieses)
                if (!context.TargetSpecies.Any(x => x.Name == targetSpecies))
                    context.TargetSpecies.Add(new TargetSpecies { Name = targetSpecies });

            var pharmaceuticalForms = products.Select(p => p.Element("PharmaceuticalForm")?.Value)
                .Select(x => x.Trim()).Distinct();
            foreach (var pharmaceuticalForm in pharmaceuticalForms)
                if (!context.PharmaceuticalForms.Any(x => x.Name == pharmaceuticalForm))
                    context.PharmaceuticalForms.Add(new PharmaceuticalForm { Name = pharmaceuticalForm });

            var therapeuticGroups = products.Select(p => p.Element("TherapeuticGroup")?.Value)
                .Select(x => x.Trim()).Distinct();
            foreach (var therapeuticGroup in therapeuticGroups)
                if (!context.TherapeuticGroups.Any(x => x.Name == therapeuticGroup))
                    context.TherapeuticGroups.Add(new TherapeuticGroup { Name = therapeuticGroup });

            await context.SaveChangesAsync();

            foreach (var product in products)
            {
                var vmdProductNo = product.Element("VMDProductNo")?.Value.Trim();
                var medication = context.Medications.SingleOrDefault(x => x.VMDProductNo == vmdProductNo);
                if (medication != null) continue;

                var medicationActiveSubstances = product.Element("ActiveSubstances")?.Value
                    .Split(",").Select(x => x.Trim());
                var medicationTargetSpecies = product.Element("TargetSpecies")?.Value
                    .Split(",").Select(x => x.Trim());
                var medicationPharmaceuticalForm = product.Element("PharmaceuticalForm")?.Value.Trim();
                var medicationTherapeuticGroup = product.Element("TherapeuticGroup")?.Value.Trim();
                medication = new Medication
                {
                    VMDProductNo = vmdProductNo,
                    Name = product.Element("Name")?.Value.Trim(),
                    MAHolder = product.Element("MAHolder")?.Value.Trim(),
                    Distributors = product.Element("Distributors")?.Value.Trim(),
                    VMNo = product.Element("VMNo")?.Value.Trim(),
                    ControlledDrug = product.Element("ControlledDrug")?.Value.Trim() == "Y",
                    ActiveSubstances = context.ActiveSubstances.Where(x => medicationActiveSubstances.Contains(x.Name)).ToList(),
                    TargetSpecies = context.TargetSpecies.Where(x => medicationTargetSpecies.Contains(x.Name)).ToList(),
                    PharmaceuticalForm = context.PharmaceuticalForms.Single(x => x.Name == medicationPharmaceuticalForm),
                    TherapeuticGroup = context.TherapeuticGroups.Single(x => x.Name == medicationTherapeuticGroup),
                    SPCLink = product.Element("SPC_Link")?.Value.Trim(),
                    UKPARLink = product.Element("UKPAR_Link")?.Value.Trim(),
                    PAARLink = product.Element("PAAR_Link")?.Value.Trim()
                };
                context.Medications.Add(medication);
            }

            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            // Do not throw exceptions, this is called on startup
        }
    }

    public static async Task SetupHospitalReferenceData(this DatabaseContext context)
    {
        if (!context.Attitudes.Any())
        {
            context.Attitudes.AddRange(
                new Attitude { Description = "Alert" },
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
        if (!context.Tags.Any())
        {
            context.Tags.AddRange(
                new Tag { Name = "Do not feed", Description = "..." },
                new Tag { Name = "Do not clean", Description = "..." }
            );
        }
        if (!context.AdministrationMethods.Any())
        {
            context.AdministrationMethods.AddRange(
                new AdministrationMethod { Description = "Oral" },
                new AdministrationMethod { Description = "Subcutaneous" }
            );
        }
        if (!context.ReleaseTypes.Any())
        {
            context.ReleaseTypes.AddRange(
                new ReleaseType { Description = "Hard" },
                new ReleaseType { Description = "Soft" },
                new ReleaseType { Description = "Hack" },
                new ReleaseType { Description = "Self" },
                new ReleaseType { Description = "Hard" }
            );
        }

        try
        {
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {

        }
    }
}
