using Api.Handlers.Accounts.Admin;
using Api.Handlers.Accounts.Beacon;
using Api.Handlers.Accounts.Info;
using Api.Handlers.Accounts.Reset;
using Api.Handlers.Accounts;
using Api.Handlers.Rota.Misc.Assignments.Areas;
using Api.Handlers.Rota.Misc.Assignments.Shifts;
using Api.Handlers.Rota.Misc.Assignments;
using Api.Handlers.Rota.Misc.Jobs;
using Api.Handlers.Rota.Misc.MissingReasons;
using Api.Handlers.Rota.Misc.Requirements;
using Api.Handlers.Rota.Misc.Times;
using Api.Handlers.Rota.RegularShifts;
using Api.Handlers.Rota.Shifts;
using MediatR;
using Api.Handlers.Rota;
using Api.Handlers.Rota.Notify;
using Api.Handlers.Notices.Interaction;
using Api.Handlers.Notices;
using Api.Handlers.Hospital.Admission;
using Api.Handlers.Hospital.Exams;
using Api.Handlers.Hospital.HomeCare;
using Api.Handlers.Hospital.Husbandry;
using Api.Handlers.Hospital.Locations;
using Api.Handlers.Hospital.Medications;
using Api.Handlers.Hospital.Patients.Outcome;
using Api.Handlers.Hospital.Patients.Prescriptions.Instructions;
using Api.Handlers.Hospital.Patients.Prescriptions.Medications;
using Api.Handlers.Hospital.Patients.Rechecks;
using Api.Handlers.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.PatientTypes;
using Api.Handlers.Hospital.Tasks;

public partial class Program
{
    private static void RegisterRoutes(RouteGroupBuilder api)
    {
        RegisterAccountRoutes(api);
        RegisterRotaRoutes(api);
        RegisterNotifyRoutes(api);
        RegisterClockingRoutes(api);
        RegisterNoticeRoutes(api);
        RegisterHospitalRoutes(api);
    }

    private static void RegisterHospitalRoutes(RouteGroupBuilder api)
    {
        var apiHospital = api.MapGroup("/hospital");

        apiHospital.MapPost("/refresh-admissions", (IMediator mediator, CheckPatientAdmissions request) => mediator.Send(request))
            .AddNote("Refresh patient admissions");

        var apiHospitalOptions = apiHospital.MapGroup("/options");

        var apiHospitalOptionsExams = apiHospitalOptions.MapGroup("/exams");

        apiHospitalOptionsExams.MapGet("/attitudes", (IMediator mediator) => mediator.Send(new GetAttitudes()))
            .AddNote("Get attitude options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsExams.MapGet("/body-conditions", (IMediator mediator) => mediator.Send(new GetBodyConditions()))
            .AddNote("Get body condition options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsExams.MapGet("/dehydrations", (IMediator mediator) => mediator.Send(new GetDehydrations()))
            .AddNote("Get dehydration options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsExams.MapGet("/mucous-membrane-colours", (IMediator mediator) => mediator.Send(new GetMucousMembraneColours()))
            .AddNote("Get mucous membrane colour options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsExams.MapGet("/mucous-membrane-textures", (IMediator mediator) => mediator.Send(new GetMucousMembraneTextures()))
            .AddNote("Get mucous membrane texture options")
            .RequireAuthorization(vetOrAuxPolicy);

        var apiHospitalOptionsOutcome = apiHospitalOptions.MapGroup("/outcome");

        apiHospitalOptionsOutcome.MapGet("/disposition-reasons", (IMediator mediator) => mediator.Send(new GetDispositionReasons()))
            .AddNote("Get disposition reason options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsOutcome.MapGet("/release-types", (IMediator mediator) => mediator.Send(new GetReleaseTypes()))
            .AddNote("Get release type options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsOutcome.MapGet("/transfer-locations", (IMediator mediator) => mediator.Send(new GetTransferLocations()))
            .AddNote("Get transfer location options")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalOptionsOutcome.MapPut("/disposition-reason", (IMediator mediator, UpsertDispositionReason request) => mediator.Send(request))
            .AddNote("Update or create disposition reason")
            .RequireAuthorization(adminPolicy);

        apiHospitalOptionsOutcome.MapPut("/release-type", (IMediator mediator, UpsertReleaseType request) => mediator.Send(request))
            .AddNote("Update or create release type")
            .RequireAuthorization(adminPolicy);

        apiHospitalOptionsOutcome.MapPut("/transfer-location", (IMediator mediator, UpsertTransferLocation request) => mediator.Send(request))
            .AddNote("Update or create transfer location")
            .RequireAuthorization(adminPolicy);

        var apiHospitalPatient = apiHospital.MapGroup("/patients");

        apiHospitalPatient.MapPost("/{id:int}/exam", (IMediator mediator, int id, PerformExam request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet performs initial exam")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/request-home-care", (IMediator mediator, int id, RequireHomeCare request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet requests home care for patient")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/ready-for-release", (IMediator mediator, int id, MarkPatientReadyForRelease request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet marks patient as ready for release")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/die", (IMediator mediator, int id, MarkPatientDead request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet marks patient as dead")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/release", (IMediator mediator, int id, MarkPatientReleased request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet marks patient as released")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/transfer", (IMediator mediator, int id, MarkPatientTransferred request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet marks patient as transferred")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/{id:int}/prescriptions/instruction", (IMediator mediator, int id, AddInstructionPrescription request) => mediator.Send(request.WithId(id)))
            .AddNote("Create prescription instruction")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapDelete("/prescriptions/instruction/{id:int}", (IMediator mediator, int id) => mediator.Send(new RemoveInstructionPrescription { PrescriptionInstructionId = id }))
            .AddNote("Remove prescription instruction")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/prescriptions/instruction/{id:int}/administer", (IMediator mediator, int id, PerformInstructionPrescription request) => mediator.Send(request.WithId(id)))
            .AddNote("Administer prescription instruction")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalPatient.MapPost("/{id:int}/prescriptions/medication", (IMediator mediator, int id, AddMedicationPrescription request) => mediator.Send(request.WithId(id)))
            .AddNote("Create prescription medication")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapDelete("/prescriptions/medication/{id:int}", (IMediator mediator, int id) => mediator.Send(new RemoveMedicationPrescription { PrescriptionMedicationId = id }))
            .AddNote("Remove prescription medication")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/prescriptions/medication/{id:int}/administer", (IMediator mediator, int id, PerformMedicationPrescription request) => mediator.Send(request.WithId(id)))
            .AddNote("Administer prescription medication")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalPatient.MapPost("/{id:int}/recheck", (IMediator mediator, int id, AddRecheck request) => mediator.Send(request.WithId(id)))
            .AddNote("Create recheck")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapDelete("/recheck/{id:int}", (IMediator mediator, int id) => mediator.Send(new RemoveRecheck { PatientRecheckId = id }))
            .AddNote("Remove recheck")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPost("/recheck/{id:int}/perform", (IMediator mediator, int id, PerformRecheck request) => mediator.Send(request.WithId(id)))
            .AddNote("Perform recheck")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalPatient.MapPost("/{id:int}/note", (IMediator mediator, int id, AddPatientNote request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet or aux adds a note")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalPatient.MapPost("/{id:int}/move", (IMediator mediator, int id, MovePatient request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet moves patient")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapPut("/{id:int}/basic-details", (IMediator mediator, int id, UpdatePatientBasicDetails request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet updates patient basic details")
            .RequireAuthorization(vetPolicy);

        apiHospitalPatient.MapGet("/search", (IMediator mediator, string query) => mediator.Send(new SearchPatients { Search = query }))
            .AddNote("Search for a patient")
            .RequireAuthorization(signedInPolicy);

        apiHospitalPatient.MapGet("/{id:int}", (IMediator mediator, int id) => mediator.Send(new ViewPatient { Id = id }))
            .AddNote("View patient details")
            .RequireAuthorization(signedInPolicy);

        apiHospitalPatient.MapGet("/status", (IMediator mediator) => mediator.Send(new ViewPatientCounts()))
            .AddNote("View patient counts by status")
            .RequireAuthorization(signedInPolicy);

        apiHospitalPatient.MapGet("/status/{status:int}", (IMediator mediator, int status) => mediator.Send(new ViewPatients { Status = (PatientStatus)status }))
            .AddNote("Filter patients by status")
            .RequireAuthorization(signedInPolicy);

        var apiHospitalHomeCare = apiHospital.MapGroup("/home-care");

        apiHospitalHomeCare.MapPost("/{id:int}/accept", (IMediator mediator, int id, AcceptHomeCare request) => mediator.Send(request.WithId(id)))
            .AddNote("Orphan feeder accepts home care request")
            .RequireAuthorization(orphanFeederPolicy);

        apiHospitalHomeCare.MapPost("/{id:int}/drop-off", (IMediator mediator, int id) => mediator.Send(new DroppedOffHomeCare { HomeCareRequestId = id }))
            .AddNote("Vet accepts patient back as an inpatient")
            .RequireAuthorization(vetPolicy);

        apiHospitalHomeCare.MapGet("/{id:int}/messages", (IMediator mediator, int id) => mediator.Send(new ViewHomeCareMessages { HomeCareRequestId = id }))
            .AddNote("Orphan feeder views home care messages")
            .RequireAuthorization(orphanFeederPolicy);

        apiHospitalHomeCare.MapPost("/{id:int}/message", (IMediator mediator, int id, AddHomeCareMessage request) => mediator.Send(request.WithId(id)))
            .AddNote("Vet or orphan feeder sends home care message")
            .RequireAuthorization(vetOrOrphanFeederPolicy);

        apiHospitalHomeCare.MapGet("/outstanding", (IMediator mediator) => mediator.Send(new ViewOutstandingHomeCareRequests()))
            .AddNote("Orphan feeder views outstanding home care requests")
            .RequireAuthorization(orphanFeederPolicy);

        apiHospitalHomeCare.MapGet("/active", (IMediator mediator) => mediator.Send(new ViewMyActiveHomeCareRequests()))
            .AddNote("Orphan feeder views active home care requests")
            .RequireAuthorization(orphanFeederPolicy);

        var apiHospitalHusbandry = apiHospital.MapGroup("/husbandry");

        apiHospitalHusbandry.MapGet("/diets", (IMediator mediator) => mediator.Send(new GetDiets()))
            .AddNote("View diets")
            .RequireAuthorization(signedInPolicy);

        apiHospitalHusbandry.MapGet("/tags", (IMediator mediator) => mediator.Send(new GetTags()))
            .AddNote("View tags")
            .RequireAuthorization(signedInPolicy);

        apiHospitalHusbandry.MapPut("/diet", (IMediator mediator, UpsertDiet request) => mediator.Send(request))
            .AddNote("Update or create diet")
            .RequireAuthorization(adminPolicy);

        apiHospitalHusbandry.MapPut("/tag", (IMediator mediator, UpsertTag request) => mediator.Send(request))
            .AddNote("Update or create tag")
            .RequireAuthorization(adminPolicy);

        var apiHospitalLocations = apiHospital.MapGroup("/locations");

        apiHospitalLocations.MapGet("/", (IMediator mediator) => mediator.Send(new GetAreas()))
            .AddNote("Get list of areas, including pens")
            .RequireAuthorization(signedInPolicy);

        apiHospitalLocations.MapPost("/area", (IMediator mediator, CreateArea request) => mediator.Send(request))
            .AddNote("Admin creates a new area")
            .RequireAuthorization(adminPolicy);

        apiHospitalLocations.MapPost("/pen", (IMediator mediator, CreatePen request) => mediator.Send(request))
            .AddNote("Admin creates a new pen")
            .RequireAuthorization(adminPolicy);

        var apiHospitalMedications = apiHospital.MapGroup("/medications");

        apiHospitalMedications.MapGet("/", (IMediator mediator, string search) => mediator.Send(new GetMedications { Search = search }))
            .AddNote("View list of medications")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalMedications.MapGet("/administration-methods", (IMediator mediator) => mediator.Send(new GetAdministrationMethods()))
            .AddNote("View list of administration methods")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalMedications.MapPost("/{id:int}/enable", (IMediator mediator, int id) => mediator.Send(new SetMedicationUsage { Id = id, Used = true }))
            .AddNote("Enable usage of medication")
            .RequireAuthorization(adminPolicy);

        apiHospitalMedications.MapPost("/{id:int}/disable", (IMediator mediator, int id) => mediator.Send(new SetMedicationUsage { Id = id, Used = false }))
            .AddNote("Disable usage of medication")
            .RequireAuthorization(adminPolicy);

        apiHospitalMedications.MapPut("/administration-method", (IMediator mediator, UpsertAdministrationMethod request) => mediator.Send(request))
            .AddNote("Update or create administration method")
            .RequireAuthorization(adminPolicy);

        var apiHospitalSpecies = apiHospital.MapGroup("/species");

        apiHospitalSpecies.MapGet("/", (IMediator mediator) => mediator.Send(new GetSpecies()))
            .AddNote("View list of species")
            .RequireAuthorization(signedInPolicy);

        apiHospitalSpecies.MapPut("/", (IMediator mediator, UpsertSpecies request) => mediator.Send(request))
            .AddNote("Update or create species")
            .RequireAuthorization(adminPolicy);

        apiHospitalSpecies.MapPut("/age", (IMediator mediator, UpsertSpeciesAge request) => mediator.Send(request))
            .AddNote("Update or create species age")
            .RequireAuthorization(adminPolicy);

        apiHospitalSpecies.MapPut("/variant", (IMediator mediator, UpsertSpeciesVariant request) => mediator.Send(request))
            .AddNote("Update or create species variant")
            .RequireAuthorization(adminPolicy);

        var apiHospitalTasks = apiHospital.MapGroup("/tasks");

        apiHospitalTasks.MapGet("/rechecks", (IMediator mediator, string on) => mediator.Send(new ViewRechecks { Date = DateOnly.Parse(on) }))
            .AddNote("View list of rechecks on any given date (includes overdue)")
            .RequireAuthorization(vetOrAuxPolicy);

        apiHospitalTasks.MapGet("/prescriptions", (IMediator mediator, string on) => mediator.Send(new ViewPrescriptions { Date = DateOnly.Parse(on) }))
            .AddNote("View list of prescriptions on any given date")
            .RequireAuthorization(vetOrAuxPolicy);
    }

    private static void RegisterAccountRoutes(RouteGroupBuilder api)
    {
        var apiAccount = api.MapGroup("/account");

        apiAccount.MapPost("/login", (IMediator mediator, Login request) => mediator.Send(request))
            .AddNote("Unauthenticated user sends their username and password to login");

        apiAccount.MapPost("/password/reset", (IMediator mediator, RequestPasswordReset request) => mediator.Send(request))
            .AddNote("Unauthenticated user requests email to be sent to them for resetting their password");

        apiAccount.MapPut("/password/reset", (IMediator mediator, ResetPassword request) => mediator.Send(request))
            .AddNote("Unauthenticated user uses emailed token to reset their password");

        apiAccount.MapGet("/users", (IMediator mediator) => mediator.Send(new GetAccounts()))
            .AddNote("Admin views all users' account info")
            .RequireAuthorization(adminPolicy);

        apiAccount.MapPost("/beacon-sync", (IMediator mediator, BeaconSync request) => mediator.Send(request))
            .AddNote("Admin synchronises accounts with Beacon CRM")
            .RequireAuthorization(adminPolicy);

        apiAccount.MapPost("/send-invitations", (IMediator mediator, SendInvitations request) => mediator.Send(request))
            .AddNote("Admin rolls out the application to a team or individual user")
            .RequireAuthorization(adminPolicy);


        apiAccount.MapPost("/users", (IMediator mediator, CreateAccount request) => mediator.Send(request))
            .AddNote("Admin creates an account")
            .RequireAuthorization(adminPolicy);

        apiAccount.MapGet("/users/me", (IMediator mediator) => mediator.Send(new GetAccountInfo()))
            .AddNote("Authenticated user accesses their account info")
            .RequireAuthorization(signedInPolicy);

        apiAccount.MapPut("/users/me", (IMediator mediator, UpdateAccountInfo request) => mediator.Send(request))
            .AddNote("Authenticated user updates their account info")
            .RequireAuthorization(signedInPolicy);

        apiAccount.MapPost("/users/me/subscribe", (IMediator mediator, Subscribe request) => mediator.Send(request))
            .AddNote("Authenticated user subscribes to push notifications")
            .RequireAuthorization(signedInPolicy);

        apiAccount.MapGet("/users/{id:int}", (IMediator mediator, int id) => mediator.Send(new GetAccountInfo { Id = id }))
            .AddNote("Admin accesses account info of another user")
            .RequireAuthorization(adminPolicy);

        apiAccount.MapPut("/users/{id:int}", (IMediator mediator, int id, UpdateAccount request) => mediator.Send(request.WithId(id)))
            .AddNote("Admin updates the account info of another user")
            .RequireAuthorization(adminPolicy);
    }

    private static void RegisterRotaRoutes(RouteGroupBuilder api)
    {
        var apiRota = api.MapGroup("/rota");

        apiRota.MapGet("/jobs", (IMediator mediator) => mediator.Send(new GetJobs()))
            .AddNote("Authenticated user views list of jobs")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPut("/jobs", (IMediator mediator, UpdateJobs request) => mediator.Send(request))
            .AddNote("Admin updates list of jobs")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/missing-reasons", (IMediator mediator) => mediator.Send(new GetMissingReasons()))
            .AddNote("Authenticated user views list of missing reasons")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPut("/missing-reasons", (IMediator mediator, UpdateMissingReasons request) => mediator.Send(request))
            .AddNote("Admin updates list of missing reasons")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/times", (IMediator mediator) => mediator.Send(new GetTimes()))
            .AddNote("Authenticated user views list of times")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPut("/times", (IMediator mediator, UpdateTimes request) => mediator.Send(request))
            .AddNote("Admin updates list of times")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/requirements", (IMediator mediator) => mediator.Send(new GetRequirements()))
            .AddNote("Admin views list of shift requirements")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPut("/requirements", (IMediator mediator, UpdateRequirements request) => mediator.Send(request))
            .AddNote("Admin updates list of requirements")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/assignable-areas", (IMediator mediator) => mediator.Send(new GetAssignableAreas()))
            .AddNote("Authenticated user views list of assignable areas")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPut("/assignable-areas", (IMediator mediator, UpdateAssignableAreas request) => mediator.Send(request))
            .AddNote("Admin updates list of assignable areas")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/assignable-shifts", (IMediator mediator) => mediator.Send(new GetAssignableShifts()))
            .AddNote("Admin views list of assignable shifts")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPut("/assignable-shifts", (IMediator mediator, UpdateAssignableShifts request) => mediator.Send(request))
            .AddNote("Admin updates list of assignable shifts")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPut("/assign-area", (IMediator mediator, AssignArea request) => mediator.Send(request))
            .AddNote("Admin assigns an area for an attendance")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/users/me/regular-shifts", (IMediator mediator) => mediator.Send(new GetRegularShifts()))
            .AddNote("Authenticated user views their regular shifts")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapGet("/users/{id:int}/regular-shifts", (IMediator mediator, int id) => mediator.Send(new GetRegularShifts { UserId = id }))
            .AddNote("Admin views regular shifts of user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPost("/users/{id:int}/regular-shifts", (IMediator mediator, int id, AddRegularShift request) => mediator.Send(request.WithId(id)))
            .AddNote("Admin adds regular shift for user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapDelete("/users/{id:int}/regular-shift/{shiftId:int}", (IMediator mediator, int id, int shiftId) => mediator.Send(new DeleteRegularShift { UserId = id, ShiftId = shiftId }))
            .AddNote("Admin removes regular shift for user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/shifts", (IMediator mediator) => mediator.Send(new GetUserRota()))
            .AddNote("Authenticated user views their rota")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPost("/shifts/confirm", (IMediator mediator, ConfirmShift request) => mediator.Send(request))
            .AddNote("Authenticated user confirms a shift")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapPost("/shifts/deny", (IMediator mediator, DenyShift request) => mediator.Send(request))
            .AddNote("Authenticated user denies a shift")
            .RequireAuthorization(signedInPolicy);

        apiRota.MapGet("/shifts/{start:datetime}/{end:datetime}", (IMediator mediator, DateOnly start, DateOnly end) => mediator.Send(new ViewRota { Start = start, End = end }))
            .AddNote("Admin views the rota")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/user/{id:int}/shifts", (IMediator mediator, int id) => mediator.Send(new GetUserRota { UserId = id }))
            .AddNote("Admin views rota for user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPost("/user/{id:int}/shifts/confirm", (IMediator mediator, int id, ConfirmShift request) => mediator.Send(request.WithId(id)))
            .AddNote("Admin confirms a shift for user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapPost("/user/{id:int}/shifts/deny", (IMediator mediator, int id, DenyShift request) => mediator.Send(request.WithId(id)))
            .AddNote("Admin denies a shift for user")
            .RequireAuthorization(adminPolicy);

        apiRota.MapGet("/reports/{start:datetime}/{end:datetime}", (IMediator mediator, DateOnly start, DateOnly end) => mediator.Send(new ViewAttendance { Start = start, End = end }))
            .AddNote("Admin views the attendance report")
            .RequireAuthorization(adminPolicy);
    }

    private static void RegisterNotifyRoutes(RouteGroupBuilder api)
    {
        var apiNotify = api.MapGroup("/notify");
        apiNotify.MapPost("/not-confirmed-next-shift", (IMediator mediator) => mediator.Send(new NotConfirmedNextShift()))
            .AddNote("Send notification if not confirmed next shift");

        apiNotify.MapPost("/urgent-shifts", (IMediator mediator) => mediator.Send(new UrgentShifts()))
            .AddNote("Send notification for urgent shifts");
    }

    private static void RegisterClockingRoutes(RouteGroupBuilder api)
    {
        var apiClocking = api.MapGroup("/clocking");
        apiClocking.MapPost("/in", (IMediator mediator, ClockIn request) => mediator.Send(request))
            .AddNote("Clock volunteer in")
            .RequireAuthorization(clockingPolicy);

        apiClocking.MapPost("/out", (IMediator mediator, ClockOut request) => mediator.Send(request))
            .AddNote("Clock volunteer out")
            .RequireAuthorization(clockingPolicy);

        apiClocking.MapGet("/view", (IMediator mediator) => mediator.Send(new GetClockingRota()))
            .AddNote("View clocking rota")
            .RequireAuthorization(clockingPolicy);
    }

    private static void RegisterNoticeRoutes(RouteGroupBuilder api)
    {
        var apiNotices = api.MapGroup("/notices");
        apiNotices.MapPost("/", async (IMediator mediator, HttpRequest httpReq) =>
        {
            var form = await httpReq.ReadFormAsync();
            _ = int.TryParse(form["roles"], out int roles);

            var request = new CreateNotice
            {
                Title = form["title"],
                Content = form["content"],
                Roles = (Api.Database.Entities.Account.AccountRoles)roles,
                Files = form.Files
            };

            return await mediator.Send(request);
        })
        .AddNote("Admin creates a new notice")
        .RequireAuthorization(adminPolicy);

        apiNotices.MapPut("/{id:int}", async (IMediator mediator, int id, HttpRequest httpReq) =>
        {
            var form = await httpReq.ReadFormAsync();
            _ = int.TryParse(form["roles"], out int roles);

            var request = new UpdateNotice
            {
                Id = id,
                Title = form["title"],
                Content = form["content"],
                Roles = (Api.Database.Entities.Account.AccountRoles)roles,
                Files = form.Files
            };

            return await mediator.Send(request);
        })
        .AddNote("Admin updates an existing notice")
        .RequireAuthorization(adminPolicy);

        apiNotices.MapGet("/{noticeId:int}/files/{attachmentId:int}", (IMediator mediator, int noticeId, int attachmentId) => mediator.Send(new DownloadNoticeAttachment { NoticeId = noticeId, AttachmentId = attachmentId }))
            .AddNote("User downloads notice attachment")
            .RequireAuthorization(signedInPolicy);

        apiNotices.MapGet("/", (IMediator mediator) => mediator.Send(new ListNotices()))
            .AddNote("User views list of notices")
            .RequireAuthorization(signedInPolicy);

        apiNotices.MapGet("/{id:int}", (IMediator mediator, int id) => mediator.Send(new ViewNoticeInteractions { NoticeId = id }))
            .AddNote("Admin views notice interactions")
            .RequireAuthorization(adminPolicy);

        apiNotices.MapDelete("/{id:int}", (IMediator mediator, int id) => mediator.Send(new DeleteNotice { NoticeId = id }))
            .AddNote("Admin deletes a notice")
            .RequireAuthorization(adminPolicy);

        apiNotices.MapPost("/{id:int}/open", (IMediator mediator, int id) => mediator.Send(new OpenNotice { NoticeId = id }))
            .AddNote("User opens a notice, returns the content")
            .RequireAuthorization(signedInPolicy);

        apiNotices.MapPost("/{id:int}/close", (IMediator mediator, int id) => mediator.Send(new CloseNotice { NoticeId = id }))
            .AddNote("User closes a notice")
            .RequireAuthorization(signedInPolicy);
    }
}
