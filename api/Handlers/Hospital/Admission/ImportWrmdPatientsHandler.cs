using Api.Database;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using Newtonsoft.Json;
using Api.Services;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Database.Entities.Hospital.Patients.Medications;

namespace Api.Handlers.Hospital.Admission;

/*
public class ImportWrmdPatients : IRequest<IResult>
{
    public string Json { get; set; }
}

public class ImportWrmdPatientsHandler : IRequestHandler<ImportWrmdPatients, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ImportWrmdPatientsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ImportWrmdPatients request, CancellationToken cancellationToken)
    {
        try
        {
            var root = JsonConvert.DeserializeObject<Root>(request.Json);

            var year = DateTime.UtcNow.Year;
            var yearStart = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var yearEnd = yearStart.AddYears(1).AddSeconds(-1);
            var allPatientsAdmittedThisYear = await _repository.GetAll<Database.Entities.Hospital.Patients.Patient>(x => yearStart <= x.Admitted && x.Admitted <= yearEnd, tracking: false);
            var admittedThisYear = allPatientsAdmittedThisYear.Count;

            if (await _repository.Get<Database.Entities.Hospital.Patients.Patient>(x => x.Reference == root.props.cageCard.case_number) != null)
            {
                return Results.Ok();
            }

            var admitter = await _repository.Get<Admitter>(248);
            var initialLocation = await _repository.Get<InitialLocation>(x => x.Description == "Not provided");
            var suspectedSpecies = await _repository.Get<SuspectedSpecies>(x => x.Description == "Other");
            var wrmd = await _repository.Get<Account>(2235);

            var attitudes = await _repository.GetAll<Attitude>(x => true);
            var bodyConditions = await _repository.GetAll<BodyCondition>(x => true);
            var dehydrations = await _repository.GetAll<Dehydration>(x => true);
            var mucousMembraneColours = await _repository.GetAll<MucousMembraneColour>(x => true);
            var mucousMembraneTextures = await _repository.GetAll<MucousMembraneTexture>(x => true);

            var admissionReasons = await _repository.GetAll<AdmissionReason>(x => true);
            var dispositionReasons = await _repository.GetAll<DispositionReason>(x => true);

            var medications = await _repository.GetAll<Medication>(x => true,
                action: x => x.Include(y => y.Concentrations));
            var administrationMethods = await _repository.GetAll<AdministrationMethod>(x => true);

            var admissions = new Dictionary<string, AdmissionReason>
            {
                { "The Wildlife Aid Foundation", admissionReasons.First(x => x.Description == "Other") },
                { "DOA", admissionReasons.First(x => x.Description == "DOA") },
                { "RTA/Vehicle Collision", admissionReasons.First(x => x.Description == "RTA") },
                { "Unresponsive", admissionReasons.First(x => x.Description == "Behavioural") },
                { "Domestic Pet/Racing Pigeon", admissionReasons.First(x => x.Description == "Other") },
                { "Cat Attack", admissionReasons.First(x => x.Description == "Cat attack") },
                { "Dog Attack", admissionReasons.First(x => x.Description == "Predator attack") },
                { "Spinal Injury", admissionReasons.First(x => x.Description == "Injured") },
                { "Disease", admissionReasons.First(x => x.Description == "Illness/disease") },
                { "Window Strike", admissionReasons.First(x => x.Description == "Window strike") },
                { "Orphan", admissionReasons.First(x => x.Description == "Nest disturbed") },
                { "Too Small to Hibernate", admissionReasons.First(x => x.Description == "Other") },
                { "Predator Attack", admissionReasons.First(x => x.Description == "Predator attack") },
                { "Out During Daylight", admissionReasons.First(x => x.Description == "Out in daytime") },
                { "Shot", admissionReasons.First(x => x.Description == "Injured") },
                { "Illness", admissionReasons.First(x => x.Description == "Illness/disease") },
                { "Head Injury / Physical Trauma", admissionReasons.First(x => x.Description == "Injured") },
                { "Wing Injury / Physical Trauma", admissionReasons.First(x => x.Description == "Injured") },
                { "Leg Injury / Physical Trauma", admissionReasons.First(x => x.Description == "Injured") },
                { "Wounds / Physical Trauma", admissionReasons.First(x => x.Description == "Injured") },
                { "Nest Disturbed", admissionReasons.First(x => x.Description == "Nest disturbed") },
                { "Animal Cruelty", admissionReasons.First(x => x.Description == "Other") },
                { "Transfer from Vets", admissionReasons.First(x => x.Description == "Other") },
                { "Fallen from nest", admissionReasons.First(x => x.Description == "Fallen from nest") },
                { "Fallen down chimney", admissionReasons.First(x => x.Description == "Fallen from nest") },
                { "Entangled in Netting / Wire / String", admissionReasons.First(x => x.Description == "Trapped/entangled") },
                { "Mange / Disease", admissionReasons.First(x => x.Description == "Mange") },
                { "Grounded", admissionReasons.First(x => x.Description == "Grounded") },
                { "Transfer from another Wildlife Centre", admissionReasons.First(x => x.Description == "Other") },
                { "Trapped", admissionReasons.First(x => x.Description == "Trapped/entangled") },
                { "Non-domestic Animal Interaction", admissionReasons.First(x => x.Description == "Other") },
                { "Territorial Injuries / Physical Trauma", admissionReasons.First(x => x.Description == "Injured") },
                { "Abnormal Behaviour", admissionReasons.First(x => x.Description == "Behavioural") },
                { "Neurological Deficit", admissionReasons.First(x => x.Description == "Behavioural") },
                { "Suspected Toxin Ingestion", admissionReasons.First(x => x.Description == "Illness/disease") },
                { "Poisoned", admissionReasons.First(x => x.Description == "Illness/disease") },
                { "Caught in Humane Trap", admissionReasons.First(x => x.Description == "Other") },
                { "Old Age", admissionReasons.First(x => x.Description == "Other") },
                { "Other", admissionReasons.First(x => x.Description == "Other") },
                { "Collapsed", admissionReasons.First(x => x.Description == "Collapsed") }
            };

            AdmissionReason? admissionReason = null;
            if (admissions.ContainsKey(root.props.patient.reason_for_admission ?? "NULL"))
                admissionReason = admissions[root.props.patient.reason_for_admission];
            else
                admissionReason = admissions["Other"];

            var frequencies = new Dictionary<int, string>()
        {
            { 153, "One time" },
            { 154, "Every 24 hours" },
            { 155, "Every 12 hours" },
            { 156, "Every 8 hours" },
            { 157, "Every 6 hours" },
            { 158, "5 times per day" },
            { 159, "6 times per day" },
            { 160, "Every 2 days" },
            { 161, "Every 3 days" },
            { 162, "Every 4 days" },
            { 163, "Every 5 days" },
            { 164, "Every 6 days" },
            { 165, "Every 7 days" },
            { 166, "Every 2 weeks" },
            { 167, "Every 3 weeks" },
            { 168, "Every 4 weeks" },
            { 169, "Every 24 hours" },
            { 170, "Every 24 hours" },
            { 171, "Every 24 hours" },
            { 172, "Every 24 hours" },
            { 173, "One time" }
        };

            var patientSalt = _encryptionService.GenerateSalt();

            var speciesName = root.props.patient.common_name
                .Replace("European ", "")
                .Replace("Eurasian ", "")
                .Replace("Common ", "")
                .Replace("Woodpigeon", "Wood Pigeon")
                .Replace("Collared-dove", "Collared Dove")
                .Replace("Gray ", "Grey ")
                .ToUpper();

            if (speciesName == "CROW") speciesName = "CARRION CROW";
            if (speciesName == "UNIDENTIFIED FOX") speciesName = "RED FOX";

            if (speciesName == "NOTES" || speciesName == "VET TEAM")
            {
                return Results.NoContent();
            }

            if (speciesName.EndsWith(" SP.")) speciesName = speciesName.Substring(0, speciesName.Length - 4);
            if (speciesName.EndsWith(" SP")) speciesName = speciesName.Substring(0, speciesName.Length - 3);

            var species = await _repository.Get<Species>(x => x.Name.ToUpper() == speciesName
                , action: x => x.Include(y => y.Variants));

            species ??= await _repository.Get<Species>(x => x.Name.ToUpper() == "COMMON " + speciesName
                , action: x => x.Include(y => y.Variants));

            species ??= await _repository.Get<Species>(x => x.Name.ToUpper() == "UNIDENTIFIED " + speciesName
                , action: x => x.Include(y => y.Variants));

            var exam = new Exam
            {
                Type = Database.Entities.Hospital.Patients.Exams.ExamType.Intake,
                Species = species,
                SpeciesVariant = species.Variants[species.Variants.Count - 1],
                Sex = Database.Entities.Hospital.Patients.Exams.Sex.Unknown,
                Examiner = wrmd,
                Comments = "None",
                TreatmentInstructions = [],
            };

            var patient = new Database.Entities.Hospital.Patients.Patient
            {
                BeaconId = 0,
                Admitted = root.props.patient.admitted_at.ToUniversalTime(),
                AdmissionReasons = [admissionReason],
                Admitter = admitter,
                FoundAt = _encryptionService.Encrypt("Unknown", patientSalt),
                Name = root.props.admissionsPaginator.data[0].patient.name,
                InitialLocation = initialLocation,
                SuspectedSpecies = suspectedSpecies,
                Species = species,
                SpeciesVariant = species.Variants[species.Variants.Count - 1],
                Sex = Database.Entities.Hospital.Patients.Exams.Sex.Unknown,
                Reference = root.props.cageCard.case_number,
                Status = PatientStatus.Inpatient,
                Exams = [exam],
                Rechecks = [],
                PrescriptionInstructions = [],
                PrescriptionMedications = [],
                FaecalTests = [],
                BloodTests = [],
                Notes = [],
                Salt = patientSalt
            };

            if (root.props.locationCard.disposition != "Pending")
            {
                patient.Status = PatientStatus.Dispositioned;
                Disposition disposition = Disposition.Released;
                if (root.props.locationCard.disposition == "Released") disposition = Disposition.Released;
                else if (root.props.locationCard.disposition == "Transferred") disposition = Disposition.Transferred;
                else if (root.props.locationCard.disposition == "Dead on arrival") disposition = Disposition.DeadOnArrival;
                else if (root.props.locationCard.disposition == "Euthanized in 24hr") disposition = Disposition.PtsBefore24Hrs;
                else if (root.props.locationCard.disposition == "Euthanized +24hr") disposition = Disposition.PtsAfter24Hrs;
                else if (root.props.locationCard.disposition == "Died in 24hr") disposition = Disposition.DiedBefore24Hrs;
                else if (root.props.locationCard.disposition == "Died +24hr") disposition = Disposition.DiedAfter24Hrs;
                else throw new Exception("Unknown disposition");
                patient.Disposition = disposition;
                patient.Dispositioner = wrmd;
                var date = (root.props.patient.dispositioned_at ?? root.props.patient.updated_at);
                patient.Dispositioned = date.ToUniversalTime();
                var dispositionReason = dispositionReasons.FirstOrDefault(x => x.Description.ToUpper() ==
                    (root.props.patient.reason_for_disposition ?? "Unknown").Replace("\"", "").ToUpper());
                dispositionReason ??= dispositionReasons.First(x => x.Description == "Unknown");
                patient.DispositionReason = dispositionReason;
            }

            exam.Patient = patient;

            if (!string.IsNullOrWhiteSpace(root.props.patient.diagnosis))
            {
                patient.Notes.Add(new PatientNote
                {
                    Noted = root.props.patient.updated_at.ToUniversalTime(),
                    Comments = root.props.patient.diagnosis,
                    Noter = wrmd,
                    Patient = patient
                });
            }

            var logTypes = root.props.logs.Select(x => x.log_type).Distinct();

            foreach (var log in root.props.logs)
            {
                var type = log.log_type;
                if (type == "recheck")
                {
                    var recheck = new PatientRecheck
                    {
                        Description = log.model.description,
                        Due = DateOnly.Parse(log.date_to),
                        Roles = log.model.assigned_to.value == "Veterinarian" ? RecheckRoles.Vet : RecheckRoles.Technician,
                        RequireWeight = log.model.description.ToUpper().Contains("WEIGHT"),
                        Patient = patient
                    };
                    if (log.model.recorded_tasks != null && log.model.recorded_tasks.Any(x => x.completed_at.HasValue))
                    {
                        recheck.Rechecked = log.model.recorded_tasks.First(x => x.completed_at.HasValue).completed_at.Value;
                        recheck.Rechecker = wrmd;
                    }
                    patient.Rechecks.Add(recheck);
                }
                else if (type == "care-log")
                {
                    patient.Notes.Add(new PatientNote
                    {
                        Noted = log.model.created_at.ToUniversalTime(),
                        Comments = log.model.comments ?? "",
                        Noter = wrmd,
                        Patient = patient,
                        WeightValue = log.model.weight,
                        WeightUnit = log.model.weight_unit == null ? null : (
                            log.model.weight_unit.value?.ToUpper() == "G" ?
                                Database.Entities.Hospital.Patients.Exams.WeightUnit.G :
                                Database.Entities.Hospital.Patients.Exams.WeightUnit.KG)
                    });
                }
                else if (type == "prescription")
                {
                    if (!(string.IsNullOrWhiteSpace(log.model.drug) || log.model.concentration == null ||
                        log.model.dose == null || log.model.route == null || log.model.dose_unit == null))
                    {
                        // try create medication
                        var medication = medications.FirstOrDefault(x =>
                            x.ActiveSubstance.ToUpper().Trim() == log.model.drug.ToUpper().Trim() ||
                            x.Brands.Select(y => y.ToUpper().Trim()).Contains(log.model.drug.ToUpper().Trim()));
                        if (medication != null)
                        {
                            var concentration = medication.Concentrations.FirstOrDefault(x => x.ConcentrationMgMl == log.model.concentration);
                            if (concentration != null)
                            {
                                if (log.model.route.code == "topical") log.model.route.code = "TP";
                                var administrationMethod = administrationMethods.First(x => x.Code == log.model.route.code.ToUpper());
                                patient.PrescriptionMedications.Add(new Database.Entities.Hospital.Patients.Prescriptions.PatientPrescriptionMedication
                                {
                                    Start = DateOnly.Parse(log.date_from),
                                    End = DateOnly.Parse(log.date_to ?? log.date_from),
                                    Frequency = frequencies[log.frequency.id],
                                    Medication = medication,
                                    MedicationConcentration = concentration,
                                    AdministrationMethod = administrationMethod,
                                    Administrations = [],
                                    Comments = log.model.instructions ?? string.Empty,
                                    QuantityUnit = log.model.dose_unit.value,
                                    QuantityValue = log.model.dose.Value,
                                    Patient = patient
                                });
                                continue;
                            }
                        }
                    }
                    patient.PrescriptionInstructions.Add(new Database.Entities.Hospital.Patients.Prescriptions.PatientPrescriptionInstruction
                    {
                        Start = DateOnly.Parse(log.date_from),
                        End = DateOnly.Parse(log.date_to ?? log.date_from),
                        Frequency = frequencies[log.frequency.id],
                        Instructions = log.body,
                        Patient = patient
                    });
                }
                else if (type == "lab-report" && log.model.lab_result_type == "lab_fecal")
                {
                    patient.FaecalTests.Add(new Database.Entities.Hospital.Patients.Labs.PatientFaecalTest
                    {
                        Comments = log.model.comments + " " + log.model.technician,
                        Direct = log.model.lab_result.direct != null ? log.model.lab_result.direct.value == "Positive" : null,
                        Float = log.model.lab_result.@float != null ? log.model.lab_result.@float.value == "Positive" : null,
                        Patient = patient,
                        Tested = log.model.created_at.ToUniversalTime(),
                        Tester = wrmd
                    });
                }
                else if (type == "lab-report")
                {
                    patient.BloodTests.Add(new Database.Entities.Hospital.Patients.Labs.PatientBloodTest
                    {
                        Comments = log.model.comments + " " + log.model.technician,
                        Patient = patient,
                        Tested = log.model.created_at.ToUniversalTime(),
                        Tester = wrmd
                    });
                }
                else if (type == "exam")
                {
                    if (log.model.sex != null)
                        exam.Sex = log.model.sex.value == "Male" ?
                            Database.Entities.Hospital.Patients.Exams.Sex.Male :
                                (log.model.sex.value == "Female" ?
                                    Database.Entities.Hospital.Patients.Exams.Sex.Female :
                                        Database.Entities.Hospital.Patients.Exams.Sex.Unknown);
                    if (log.model.weight != null)
                        exam.WeightValue = log.model.weight;
                    if (log.model.weight_unit != null)
                        exam.WeightUnit = log.model.weight_unit.value == "g" ? Database.Entities.Hospital.Patients.Exams.WeightUnit.G : Database.Entities.Hospital.Patients.Exams.WeightUnit.KG;
                    if (log.model.temperature != null)
                        exam.Temperature = log.model.temperature;
                    if (log.model.attitude != null)
                        exam.Attitude = attitudes.FirstOrDefault(x => x.Description == log.model.attitude.value);
                    if (log.model.body_condition != null)
                        exam.BodyCondition = bodyConditions.FirstOrDefault(x => x.Description == log.model.body_condition.value);
                    if (log.model.dehydration != null)
                        exam.Dehydration = dehydrations.FirstOrDefault(x => x.Description == log.model.dehydration.value);
                    if (log.model.mucous_membrane_color != null)
                        exam.MucousMembraneColour = mucousMembraneColours.FirstOrDefault(x => x.Description == log.model.mucous_membrane_color.value);
                    if (log.model.mucous_membrane_texture != null)
                        exam.MucousMembraneTexture = mucousMembraneTextures.FirstOrDefault(x => x.Description == log.model.mucous_membrane_texture.value);
                    if (log.model.treatment != null)
                        exam.TreatmentInstructions.Add(new ExamTreatmentInstruction
                        {
                            Exam = exam,
                            Instructions = log.model.treatment
                        });

                    if (log.model.age_unit != null)
                        exam.SpeciesVariant = species.Variants.FirstOrDefault(x => x.Name == log.model.age_unit.value.Replace("Hatchling / Chick", "Hatchling"));
                    exam.SpeciesVariant ??= species.Variants[0];

                    patient.Species = exam.Species;
                    patient.SpeciesVariant = exam.SpeciesVariant;
                    patient.Sex = exam.Sex;

                    exam.Date = log.model.examined_at.ToUniversalTime();

                    var comments = new List<string>();
                    if (log.model.head != null) comments.Add($"Eyes / Ears / Mouth / Nares: {log.model.head}");
                    if (log.model.cns != null) comments.Add($"Neurologic: {log.model.cns}");
                    if (log.model.cardiopulmonary != null) comments.Add($"Heart / Lungs: {log.model.cardiopulmonary}");
                    if (log.model.gastrointestinal != null) comments.Add($"GI / Vent: {log.model.gastrointestinal}");
                    if (log.model.musculoskeletal != null) comments.Add($"Musculoskeletal: {log.model.musculoskeletal}");
                    if (log.model.integument != null) comments.Add($"Feathers / Fur / Skin: {log.model.integument}");
                    if (log.model.body != null) comments.Add($"Body: {log.model.body}");
                    if (log.model.forelimb != null) comments.Add($"Wings / Arms: {log.model.forelimb}");
                    if (log.model.hindlimb != null) comments.Add($"Legs / Feet / Hocks: {log.model.hindlimb}");
                    if (log.model.comments != null) comments.Add($"Comments: {log.model.comments}");

                    exam.Comments = string.Join(". ", comments) ?? string.Empty;
                    if (string.IsNullOrWhiteSpace(exam.Comments)) exam.Comments = "None";
                }
            }

            _repository.Create(patient);

            await _repository.SaveChangesAsync();

            return Results.Created();
        }
        catch (Exception ex)
        {
            return Results.BadRequest();
        }
    }

    #region Classes

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class Admission
    {
        public string patient_id { get; set; }
        public int case_year { get; set; }
        public int case_id { get; set; }
        public object hash { get; set; }
    }

    public class AdmissionsPaginator
    {
        public int current_page { get; set; }
        public List<Datum> data { get; set; }
        public string first_page_url { get; set; }
        public int from { get; set; }
        public string next_page_url { get; set; }
        public string path { get; set; }
        public int per_page { get; set; }
        public string prev_page_url { get; set; }
        public int to { get; set; }
        public string last_page_url { get; set; }
        public int total { get; set; }
    }

    public class AssignedTo
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public object code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class Auth
    {
        public User user { get; set; }
        public List<string> abilities { get; set; }
        public Organization organization { get; set; }
        public bool is_spoofed { get; set; }
    }

    public class AutoCompleteOptions
    {
        [JsonProperty("patients.county_found")]
        public List<string> patientscounty_found { get; set; }

        [JsonProperty("patients.city_found")]
        public List<string> patientscity_found { get; set; }

        [JsonProperty("patients.admitted_by")]
        public List<string> patientsadmitted_by { get; set; }

        [JsonProperty("patients.reason_for_admission")]
        public List<string> patientsreason_for_admission { get; set; }

        [JsonProperty("patients.reason_for_disposition")]
        public List<string> patientsreason_for_disposition { get; set; }
    }

    public class CageCard
    {
        public string patient_id { get; set; }
        public string common_name { get; set; }
        public string admitted_at_for_humans { get; set; }
        public string date_admitted_at { get; set; }
        public string time_admitted_at { get; set; }
        public object morph_id { get; set; }
        public object morph { get; set; }
        public string band { get; set; }
        public object name { get; set; }
        public string reference_number { get; set; }
        public object microchip_number { get; set; }
        public string case_number { get; set; }
        public object custom_values { get; set; }
    }

    public class Collaboration
    {
        public bool is_collaborative { get; set; }
        public int organization_count { get; set; }
    }

    public class CoordinatesFound
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }
    }

    public class CountryOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class DailyTaskAssignmentsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskConcentrationUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskDosageUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskDoseUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskFrequenciesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskNutritionFrequenciesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskNutritionIngredientUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskNutritionRoutesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class DailyTaskOptionUiBehaviorIds
    {
        public int singleDoseId { get; set; }
        public int veterinarianId { get; set; }
        public int mgPerMlId { get; set; }
        public int mgPerKgId { get; set; }
        public int mlId { get; set; }
        public int gramId { get; set; }
        public int nutritionFrequencyHoursId { get; set; }
    }

    public class DailyTaskRoutesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class Datum
    {
        public string id { get; set; }
        public int organization_id { get; set; }
        public int case_year { get; set; }
        public int case_id { get; set; }
        public string patient_id { get; set; }
        public int? legacy_patient_id { get; set; }
        public object hash { get; set; }
        public object deleted_at { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string case_number { get; set; }
        public Patient patient { get; set; }
    }

    public class DispositionUiBehaviors
    {
        public int patientDispositionIsPendingID { get; set; }
        public int patientDispositionIsReleasedID { get; set; }
        public int patientDispositionIsTransferredID { get; set; }
        public int patientDispositionIsDoaID { get; set; }
    }

    public class Errors
    {
    }

    public class ExamTemperatureUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class ExamWeightUnitsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class ExportableOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class Frequency
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public string code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class Incident
    {
        public object id { get; set; }
        public object incident_number { get; set; }
    }

    public class IncludableOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class Jetstream
    {
        public bool canCreateTeams { get; set; }
        public bool canManageTwoFactorAuthentication { get; set; }
        public bool canUpdatePassword { get; set; }
        public bool canUpdateProfileInformation { get; set; }
        public bool hasEmailVerification { get; set; }
        public List<object> flash { get; set; }
        public bool hasAccountDeletionFeatures { get; set; }
        public bool hasApiFeatures { get; set; }
        public bool hasTeamFeatures { get; set; }
        public bool hasTermsAndPrivacyPolicyFeature { get; set; }
        public bool managesProfilePhotos { get; set; }
    }

    public class LanguageOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class LastCaseId
    {
        public int id { get; set; }
        public int year { get; set; }
    }

    public class LastWeight
    {
        public DateTime weighed_at_date_time { get; set; }
        public string weighed_at_date { get; set; }
        public string weighed_at_formated { get; set; }
        public int weighed_at_timestamp { get; set; }
        public string type { get; set; }
        public decimal weight { get; set; }
        public int unit_id { get; set; }
        public string unit { get; set; }
    }

    public class Location
    {
        public string id { get; set; }
        public int? legacy_id { get; set; }
        public int organization_id { get; set; }
        public int facility_id { get; set; }
        public string area { get; set; }
        public object enclosure { get; set; }
        public object hash { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }

    public class LocationCard
    {
        public string patient_id { get; set; }
        public int disposition_id { get; set; }
        public string disposition { get; set; }
        public object dispositioned_at_for_humans { get; set; }
        public List<PatientLocation> patientLocations { get; set; }
    }

    public class LocationOptionUiBehaviorIds
    {
        public int dispositionPendingId { get; set; }
        public int dispositionReleasedId { get; set; }
        public int dispositionTransferredId { get; set; }
        public int clinicFacilityId { get; set; }
        public int homecareFacilityId { get; set; }
    }

    public class Log
    {
        public string id { get; set; }
        public string log_type { get; set; }
        public DateTime logged_at_date_time { get; set; }
        public int logged_at_timestamp { get; set; }
        public string logged_at_for_humans { get; set; }
        public string badge_text { get; set; }
        public string badge_color { get; set; }
        public string body { get; set; }
        public bool can_edit { get; set; }
        public bool can_delete { get; set; }
        public User user { get; set; }
        public Model model { get; set; }
        public int? legacy_id { get; set; }
        public string patient_id { get; set; }
        public string recheck_date_range { get; set; }
        public int frequency_id { get; set; }
        public int assigned_to_id { get; set; }
        public string description { get; set; }
        public object deleted_at { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public Frequency frequency { get; set; }
        public AssignedTo assigned_to { get; set; }
        public string type { get; set; }
        public string type_id { get; set; }
        public string date_from { get; set; }
        public string date_to { get; set; }
        public string summary_body { get; set; }
        public int occurrences { get; set; }
        public bool is_schedulable { get; set; }
        public bool can_manage_task { get; set; }
    }

    public class Sex
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public object code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class TemperatureUnit
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public string code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class WeightUnit
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public string code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }


    public class AgeUnit
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public object code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class ValueContainer
    {
        public string value { get; set; }
    }

    public class ExamType
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public object code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class LogTypeOption
    {
        public string value { get; set; }
        public string label { get; set; }
    }

    public class Model
    {
        public string id { get; set; }
        public int? legacy_id { get; set; }
        public string patient_id { get; set; }
        public string recheck_date_range { get; set; }
        public int frequency_id { get; set; }
        public int assigned_to_id { get; set; }
        public string description { get; set; }
        public List<RecordedTask> recorded_tasks { get; set; }
        public object deleted_at { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public Frequency frequency { get; set; }
        public AssignedTo assigned_to { get; set; }
        public int? user_id { get; set; }
        public string date_care_at { get; set; }
        public string time_care_at { get; set; }
        public decimal? weight { get; set; }
        public int? weight_unit_id { get; set; }
        public decimal? temperature { get; set; }
        public object temperature_unit_id { get; set; }
        public string comments { get; set; }
        public DateTime? care_at { get; set; }
        public User user { get; set; }
        public WeightUnit weight_unit { get; set; }
        public object temperature_unit { get; set; }
        public string location_id { get; set; }
        public string date_moved_in_at { get; set; }
        public string time_moved_in_at { get; set; }
        public object hours { get; set; }
        public Location location { get; set; }
        public string date_from { get; set; }
        public string date_to { get; set; }

        public string lab_result_type { get; set; }
        public string lab_result_id { get; set; }
        public string analysis_date_at { get; set; }
        public string technician { get; set; }
        public LabResult lab_result { get; set; }

        public string date_examined_at { get; set; }
        public object time_examined_at { get; set; }
        public string head { get; set; }
        public string cns { get; set; }
        public string cardiopulmonary { get; set; }
        public string gastrointestinal { get; set; }
        public string musculoskeletal { get; set; }
        public string integument { get; set; }
        public string body { get; set; }
        public string forelimb { get; set; }
        public string hindlimb { get; set; }

        public string treatment { get; set; }
        public object nutrition { get; set; }
        public object examiner { get; set; }
        public DateTime examined_at { get; set; }
        public string examined_at_for_humans { get; set; }
        public ExamType exam_type { get; set; }
        public AgeUnit age_unit { get; set; }
        public Sex sex { get; set; }
        public ValueContainer body_condition { get; set; }
        public ValueContainer dehydration { get; set; }
        public ValueContainer mucous_membrane_color { get; set; }
        public ValueContainer mucous_membrane_texture { get; set; }
        public ValueContainer attitude { get; set; }

        public string drug { get; set; }
        public string instructions { get; set; }
        public double? concentration { get; set; }
        public decimal? dose { get; set; }
        public ValueContainer? dose_unit { get; set; }
        public AdminRoute? route { get; set; }
    }

    public class AdminRoute
    {
        public string value { get; set; }
        public string code { get; set; }
    }

    public class DirectOrFloat
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public string value_lowercase { get; set; }
        public object code { get; set; }
        public int sort_order { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object deleted_at { get; set; }
        public object custom_field_id { get; set; }
    }

    public class LabResult
    {
        public string id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public DirectOrFloat @float { get; set; }
        public DirectOrFloat direct { get; set; }
    }

    public class Notification
    {
        public object heading { get; set; }
        public object text { get; set; }
        public object style { get; set; }
    }

    public class Options
    {
        public List<TaxaMorphsOption> taxaMorphsOptions { get; set; }
        public List<PatientLocationFacilitiesOption> patientLocationFacilitiesOptions { get; set; }
        public List<DailyTaskNutritionIngredientUnitsOption> dailyTaskNutritionIngredientUnitsOptions { get; set; }
        public List<DailyTaskNutritionFrequenciesOption> dailyTaskNutritionFrequenciesOptions { get; set; }
        public List<DailyTaskFrequenciesOption> dailyTaskFrequenciesOptions { get; set; }
        public List<DailyTaskRoutesOption> dailyTaskRoutesOptions { get; set; }
        public List<DailyTaskNutritionRoutesOption> dailyTaskNutritionRoutesOptions { get; set; }
        public List<DailyTaskAssignmentsOption> dailyTaskAssignmentsOptions { get; set; }
        public List<ExamWeightUnitsOption> examWeightUnitsOptions { get; set; }
        public List<DailyTaskDosageUnitsOption> dailyTaskDosageUnitsOptions { get; set; }
        public List<DailyTaskConcentrationUnitsOption> dailyTaskConcentrationUnitsOptions { get; set; }
        public List<DailyTaskDoseUnitsOption> dailyTaskDoseUnitsOptions { get; set; }
        public List<OrganizationTagOption> organizationTagOptions { get; set; }
        public List<VeterinarianOption> veterinarianOptions { get; set; }
        public List<IncludableOption> includableOptions { get; set; }
        public List<ExportableOption> exportableOptions { get; set; }
        public List<string> areaOptions { get; set; }
        public List<string> enclosureOptions { get; set; }
        public List<CountryOption> countryOptions { get; set; }
        public List<SubdivisionOption> subdivisionOptions { get; set; }
        public List<TimezoneOption> timezoneOptions { get; set; }
        public List<LanguageOption> languageOptions { get; set; }
        public List<ExamTemperatureUnitsOption> examTemperatureUnitsOptions { get; set; }
        public List<PatientReleaseTypesOption> patientReleaseTypesOptions { get; set; }
        public List<PatientDispositionsOption> patientDispositionsOptions { get; set; }
        public List<PatientTransferTypesOption> patientTransferTypesOptions { get; set; }
        public AutoCompleteOptions autoCompleteOptions { get; set; }
    }

    public class Organization
    {
        public int id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public bool is_pro { get; set; }
        public bool is_master_organization { get; set; }
        public object master_organization_id { get; set; }
        public object federal_permit_number { get; set; }
        public object subdivision_permit_number { get; set; }
        public string contact_name { get; set; }
        public string country { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string subdivision { get; set; }
        public string postal_code { get; set; }
        public object coordinates { get; set; }
        public string phone { get; set; }
        public string phone_normalized { get; set; }
        public string phone_e164 { get; set; }
        public string phone_national { get; set; }
        public string contact_email { get; set; }
        public object website { get; set; }
        public object billing_id { get; set; }
        public string profile_photo_path { get; set; }
        public object notes { get; set; }
        public object timezone { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string profile_photo_url { get; set; }
        public string formatted_inline_address { get; set; }
        public List<Setting> settings { get; set; }
    }

    public class OrganizationTagOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class Patient
    {
        public string id { get; set; }
        public int? legacy_id { get; set; }
        public int organization_possession_id { get; set; }
        public string rescuer_id { get; set; }
        public object veterinarian_id { get; set; }
        public bool is_resident { get; set; }
        public object voided_at { get; set; }
        public object locked_at { get; set; }
        public string common_name { get; set; }
        public object morph_id { get; set; }
        public string date_admitted_at { get; set; }
        public string time_admitted_at { get; set; }
        public string admitted_by { get; set; }
        public object transported_by { get; set; }
        public string found_at { get; set; }
        public string address_found { get; set; }
        public string city_found { get; set; }
        public string subdivision_found { get; set; }
        public object postal_code_found { get; set; }
        public object county_found { get; set; }
        public CoordinatesFound coordinates_found { get; set; }
        public string reason_for_admission { get; set; }
        public object care_by_rescuer { get; set; }
        public object notes_about_rescue { get; set; }
        public string diagnosis { get; set; }
        public string band { get; set; }
        public object microchip_number { get; set; }
        public string reference_number { get; set; }
        public string name { get; set; }
        public int disposition_id { get; set; }
        public object transfer_type_id { get; set; }
        public object release_type_id { get; set; }
        public DateTime? dispositioned_at { get; set; }
        public object disposition_address { get; set; }
        public object disposition_city { get; set; }
        public string disposition_subdivision { get; set; }
        public object disposition_postal_code { get; set; }
        public object disposition_county { get; set; }
        public object disposition_coordinates { get; set; }
        public string reason_for_disposition { get; set; }
        public object dispositioned_by { get; set; }
        public object disposition_transported_by { get; set; }
        public object transferred_to { get; set; }
        public object transferred_to_permit_number { get; set; }
        public bool is_carcass_saved { get; set; }
        public bool is_criminal_activity { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object alert { get; set; }
        public int days_in_care { get; set; }
        public string common_name_formatted { get; set; }
        public DateTime admitted_at { get; set; }
        public string admitted_at_for_humans { get; set; }
        public object incident { get; set; }
        public List<object> tags { get; set; }
        public object morph { get; set; }
        public object custom_values { get; set; }
        public List<object> problems { get; set; }
        public List<object> clinical_classifications { get; set; }
        public List<object> categorization_of_clinical_signs { get; set; }
    }

    public class PatientDispositionsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class PatientLocation
    {
        public string location_id { get; set; }
        public string patient_location_id { get; set; }
        public string location_for_humans { get; set; }
        public string date_moved_in_at { get; set; }
        public string time_moved_in_at { get; set; }
        public string moved_in_at_for_humans { get; set; }
        public int facility_id { get; set; }
        public string facility { get; set; }
        public string area { get; set; }
        public string enclosure { get; set; }
        public object comments { get; set; }
    }

    public class PatientLocationFacilitiesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class PatientMeta
    {
        public string patient_id { get; set; }
        public object hash { get; set; }
        public object locked_at { get; set; }
        public object voided_at { get; set; }
        public bool is_criminal_activity { get; set; }
        public bool is_resident { get; set; }
        public object alert { get; set; }
        public List<object> tags { get; set; }
        public int days_in_care { get; set; }
        public Incident incident { get; set; }
        public int numberOfTasksDueToday { get; set; }
        public Share share { get; set; }
        public Collaboration collaboration { get; set; }
    }

    public class PatientReleaseTypesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class PatientTransferTypesOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class Props
    {
        public Errors errors { get; set; }
        public Jetstream jetstream { get; set; }
        public Auth auth { get; set; }
        public List<object> errorBags { get; set; }
        public string environment { get; set; }
        public string appName { get; set; }
        public bool showDonateHeader { get; set; }
        public Notification notification { get; set; }
        public object token { get; set; }
        public bool searchResultsCacheExists { get; set; }
        public List<object> unreadNotifications { get; set; }
        public Subscription subscription { get; set; }
        public Setting settings { get; set; }
        public Options options { get; set; }
        public List<string> activatedExtensions { get; set; }
        public List<int> yearsInOrganization { get; set; }
        public int caseYear { get; set; }
        public AdmissionsPaginator admissionsPaginator { get; set; }
        public object searchPaginator { get; set; }
        public int listPaginationPage { get; set; }
        public PatientMeta patientMeta { get; set; }
        public CageCard cageCard { get; set; }
        public LocationCard locationCard { get; set; }
        public Admission admission { get; set; }
        public LastWeight lastWeight { get; set; }
        public LocationOptionUiBehaviorIds locationOptionUiBehaviorIds { get; set; }
        public DailyTaskOptionUiBehaviorIds dailyTaskOptionUiBehaviorIds { get; set; }
        public LastCaseId lastCaseId { get; set; }
        public DispositionUiBehaviors dispositionUiBehaviors { get; set; }
        public int examWeightGramsId { get; set; }
        public bool organizationIsInPossession { get; set; }
        public Patient patient { get; set; }
        public List<object> problems { get; set; }
        public List<Log> logs { get; set; }
        public List<LogTypeOption> logTypeOptions { get; set; }
        public TaskFilters taskFilters { get; set; }
        public List<Task> tasks { get; set; }
        public List<object> pastDueTasks { get; set; }
        public List<TaskCategoryOption> taskCategoryOptions { get; set; }
    }

    public class RecordedTask
    {
        public DateTime? completed_at { get; set; }
    }

    public class Root
    {
        public string component { get; set; }
        public Props props { get; set; }
        public string url { get; set; }
        public string version { get; set; }
        public bool clearHistory { get; set; }
        public bool encryptHistory { get; set; }
    }

    public class Setting
    {
        public string id { get; set; }
        public int organization_id { get; set; }
        public string key { get; set; }
        public object value { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public List<string> LOG_ALLOW_DELETE { get; set; }
        public List<string> LOG_ALLOW_EDIT { get; set; }
        public bool LOG_ALLOW_AUTHOR_EDIT { get; set; }
        public List<string> ENCLOSURES { get; set; }
        public List<string> AREAS { get; set; }
        public string LANGUAGE { get; set; }
        public List<string> FAVORITE_REPORTS { get; set; }
        public string TIMEZONE { get; set; }
        public string LOG_ORDER { get; set; }
        public bool LOG_SHARES { get; set; }
        public bool FULL_PEOPLE_ACCESS { get; set; }
        public bool REMOTE_RESTRICTED { get; set; }
        public object CLINIC_IP { get; set; }
        public List<object> USER_REMOTE_PERMISSION { get; set; }
        public List<object> ROLE_REMOTE_PERMISSION { get; set; }
        public bool REQUIRE_TWO_FACTOR { get; set; }
        public bool SHOW_LOOKUP_RESCUER { get; set; }
        public bool SHOW_GEOLOCATION_FIELDS { get; set; }
        public bool SHOW_DONATIONS_ON_NEW_PATIENT { get; set; }
        public bool TIME_IN_24_HOUR { get; set; }
        public string DEFAULT_ACTION_AFTER_ADMIT { get; set; }
        public List<object> LIST_FIELDS { get; set; }
        public bool SHOW_TAGS { get; set; }
        public bool WILD_ALERT_SHARING { get; set; }
        public bool EXPORT_SHARING { get; set; }
        public List<object> PAPER_FORM_TEMPLATES { get; set; }
        public object PRINTER_1_IP { get; set; }
        public object PRINTER_1_PORT { get; set; }
        public object PRINTER_2_IP { get; set; }
        public object PRINTER_2_PORT { get; set; }
        public object PRINTER_3_IP { get; set; }
        public object PRINTER_3_PORT { get; set; }
        public object PRINTER_4_IP { get; set; }
        public object PRINTER_4_PORT { get; set; }
        public bool SUB_ORGANIZATION_ALLOW_MANAGE_SETTINGS { get; set; }
        public bool SUB_ORGANIZATION_ALLOW_TRANSFER_PATIENTS { get; set; }
        public List<object> OWCN_NOTIFY_OF_IOA { get; set; }
        public object OSPR_SPILL_ID { get; set; }
        public object OIL_SPILL_YEAR { get; set; }
        public object OIL_SPILL_START_AT { get; set; }
        public object OIL_SPILL_END_AT { get; set; }
    }

    public class Share
    {
        public string organizationAddress { get; set; }
        public string foundAddress { get; set; }
    }

    public class SubdivisionOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class Subscription
    {
        public bool isProPlan { get; set; }
        public object genericTrialEndsAt { get; set; }
    }

    public class Task
    {
        public string type { get; set; }
        public string type_id { get; set; }
        public string badge_text { get; set; }
        public string badge_color { get; set; }
        public int timestamp { get; set; }
        public int number_of_daily_occurrences { get; set; }
        public List<int> completed_occurrences { get; set; }
        public List<object> incomplete_occurrences { get; set; }
        public string body { get; set; }
        public string assignment { get; set; }
        public Model model { get; set; }
    }

    public class TaskCategoryOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class TaskFilters
    {
        public string date { get; set; }
        public string facility { get; set; }
        public string group_by { get; set; }
        public string group_name { get; set; }
        public bool hide_completed { get; set; }
        public bool include_non_pending { get; set; }
        public bool include_non_possession { get; set; }
        public bool include_past_due { get; set; }
        public List<string> include { get; set; }
        public object slug { get; set; }
    }

    public class TaxaMorphsOption
    {
        public string label { get; set; }
        public int value { get; set; }
    }

    public class TimezoneOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    public class User
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public object language { get; set; }
        public bool two_factor_enabled { get; set; }
        public int users_organizations_count { get; set; }
        public DateTime email_verified_at { get; set; }
        public int current_organization_id { get; set; }
        public int parent_organization_id { get; set; }
        public object profile_photo_path { get; set; }
        public bool is_api_user { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object two_factor_confirmed_at { get; set; }
        public object spoofed_organization_id { get; set; }
        public string profile_photo_url { get; set; }
    }

    public class VeterinarianOption
    {
        public string label { get; set; }
        public string value { get; set; }
    }

    #endregion
}
*/