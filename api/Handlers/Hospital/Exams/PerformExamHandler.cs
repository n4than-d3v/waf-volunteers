using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Handlers.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Exams;

public class PerformExam : IRequest<IResult>
{
    public int? ExamId { get; set; } // If updating

    public int PatientId { get; set; }
    public int SpeciesId { get; set; }
    public int SpeciesVariantId { get; set; }
    public Sex Sex { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public decimal? Temperature { get; set; }
    public int? AttitudeId { get; set; }
    public int? BodyConditionId { get; set; }
    public int? DehydrationId { get; set; }
    public int? MucousMembraneColourId { get; set; }
    public int? MucousMembraneTextureId { get; set; }
    public List<TreatmentInstruction> TreatmentInstructions { get; set; }
    public List<TreatmentMedication> TreatmentMedications { get; set; }
    public string Comments { get; set; }

    public PerformExam WithId(int patientId)
    {
        PatientId = patientId;
        return this;
    }

    public PerformExam WithId(int patientId, int examId)
    {
        PatientId = patientId;
        ExamId = examId;
        return this;
    }

    public class TreatmentInstruction
    {
        public string Instructions { get; set; }
    }

    public class TreatmentMedication
    {
        public decimal QuantityValue { get; set; }
        public string QuantityUnit { get; set; }
        public int MedicationId { get; set; }
        public int MedicationConcentrationId { get; set; }
        public int AdministrationMethodId { get; set; }

        public string Comments { get; set; }
    }
}

public class PerformExamHandler : IRequestHandler<PerformExam, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public PerformExamHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(PerformExam request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId, action: x => x.Include(y => y.Exams));
        if (patient == null) return Results.BadRequest();

        var examiner = await _repository.Get<Account>(_userContext.Id);
        if (examiner == null) return Results.BadRequest();

        var species = await _repository.Get<Species>(request.SpeciesId);
        if (species == null) return Results.BadRequest();

        var speciesVariant = await _repository.Get<SpeciesVariant>(request.SpeciesVariantId);
        if (speciesVariant == null) return Results.BadRequest();

        Attitude? attitude = null;
        if (request.AttitudeId.HasValue)
        {
            attitude = await _repository.Get<Attitude>(request.AttitudeId.Value);
            if (attitude == null) return Results.BadRequest();
        }
        BodyCondition? bodyCondition = null;
        if (request.BodyConditionId.HasValue)
        {
            bodyCondition = await _repository.Get<BodyCondition>(request.BodyConditionId.Value);
            if (bodyCondition == null) return Results.BadRequest();
        }
        Dehydration? dehydration = null;
        if (request.DehydrationId.HasValue)
        {
            dehydration = await _repository.Get<Dehydration>(request.DehydrationId.Value);
            if (dehydration == null) return Results.BadRequest();
        }
        MucousMembraneColour? mucousMembraneColour = null;
        if (request.MucousMembraneColourId.HasValue)
        {
            mucousMembraneColour = await _repository.Get<MucousMembraneColour>(request.MucousMembraneColourId.Value);
            if (mucousMembraneColour == null) return Results.BadRequest();
        }
        MucousMembraneTexture? mucousMembraneTexture = null;
        if (request.MucousMembraneTextureId.HasValue)
        {
            mucousMembraneTexture = await _repository.Get<MucousMembraneTexture>(request.MucousMembraneTextureId.Value);
            if (mucousMembraneTexture == null) return Results.BadRequest();
        }

        bool isInitialExam = patient.Exams.Count == 0;

        Exam? exam = null;

        if (request.ExamId.HasValue)
        {
            exam = await _repository.Get<Exam>(request.ExamId.Value, tracking: true,
                action: x => x
                    .Include(y => y.Patient)
                    .Include(y => y.Examiner)
                    .Include(y => y.Species)
                    .Include(y => y.SpeciesVariant)
                    .Include(y => y.Attitude)
                    .Include(y => y.BodyCondition)
                    .Include(y => y.Dehydration)
                    .Include(y => y.MucousMembraneColour)
                    .Include(y => y.MucousMembraneTexture)
                    .Include(y => y.TreatmentInstructions)
                    .Include(y => y.TreatmentMedications));
            if (exam == null) return Results.BadRequest();

            isInitialExam = patient.Exams.Count == 1;

            foreach (var treatment in exam.TreatmentInstructions)
                _repository.Delete(treatment);
            exam.TreatmentInstructions.Clear();

            foreach (var treatment in exam.TreatmentMedications)
                _repository.Delete(treatment);
            exam.TreatmentMedications.Clear();
        }
        else
        {
            exam = new Exam();
            _repository.Create(exam);
        }

        var examType = isInitialExam ? ExamType.Intake : ExamType.Regular;

        exam.Patient = patient;
        exam.Examiner = examiner;
        exam.Date = DateTime.UtcNow;
        exam.Type = examType;
        exam.Species = species;
        exam.SpeciesVariant = speciesVariant;
        exam.Sex = request.Sex;
        exam.WeightValue = request.WeightValue;
        exam.WeightUnit = request.WeightUnit;
        exam.Temperature = request.Temperature;
        exam.Attitude = attitude;
        exam.BodyCondition = bodyCondition;
        exam.Dehydration = dehydration;
        exam.MucousMembraneColour = mucousMembraneColour;
        exam.MucousMembraneTexture = mucousMembraneTexture;
        exam.TreatmentInstructions = [];
        exam.TreatmentMedications = [];
        exam.Comments = request.Comments;

        foreach (var treatmentInstruction in request.TreatmentInstructions)
        {
            exam.TreatmentInstructions.Add(new ExamTreatmentInstruction
            {
                Exam = exam,
                Instructions = treatmentInstruction.Instructions
            });
        }

        foreach (var treatmentMedication in request.TreatmentMedications)
        {
            var medication = await _repository.Get<Medication>(treatmentMedication.MedicationId);
            if (medication == null) return Results.BadRequest();

            var medicationConcentration = await _repository.Get<MedicationConcentration>(treatmentMedication.MedicationConcentrationId);
            if (medicationConcentration == null) return Results.BadRequest();

            var administrationMethod = await _repository.Get<AdministrationMethod>(treatmentMedication.AdministrationMethodId);
            if (administrationMethod == null) return Results.BadRequest();

            exam.TreatmentMedications.Add(new ExamTreatmentMedication
            {
                Exam = exam,
                Medication = medication,
                MedicationConcentration = medicationConcentration,
                AdministrationMethod = administrationMethod,
                QuantityUnit = treatmentMedication.QuantityUnit,
                QuantityValue = treatmentMedication.QuantityValue,
                Comments = treatmentMedication.Comments
            });
        }

        if (isInitialExam)
        {
            patient.Status = PatientStatus.Inpatient;
            patient.Species = species;
            patient.SpeciesVariant = speciesVariant;
            patient.Sex = exam.Sex;
            patient.LastUpdatedDetails = DateTime.UtcNow;
        }

        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
