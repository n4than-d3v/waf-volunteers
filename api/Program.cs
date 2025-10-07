using Api.Configuration;
using Api.Database;
using Api.Handlers.Accounts;
using Api.Handlers.Accounts.Admin;
using Api.Handlers.Accounts.Info;
using Api.Handlers.Accounts.Reset;
using Api.Handlers.Rota;
using Api.Handlers.Rota.Misc.Jobs;
using Api.Handlers.Rota.Misc.MissingReasons;
using Api.Handlers.Rota.Misc.Requirements;
using Api.Handlers.Rota.Misc.Times;
using Api.Handlers.Rota.Notify;
using Api.Handlers.Rota.RegularShifts;
using Api.Handlers.Rota.Shifts;
using Api.Services;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PostgreSQL");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<SecuritySettings>(
    builder.Configuration.GetSection("Security")
);
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("Smtp")
);
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);
builder.Services.Configure<PushSettings>(
    builder.Configuration.GetSection("Push")
);

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.SecretKeyBytes)
        };
    });

const string signedInPolicy = "SignedIn";
const string adminPolicy = "Admin";

builder.Services
    .AddAuthorizationBuilder()
    .AddPolicy(signedInPolicy, policy => policy.RequireAuthenticatedUser())
    .AddPolicy(adminPolicy, policy => policy.RequireAssertion((AuthorizationHandlerContext context) => context.User.IsAdmin()));

builder.Services.AddTransient<IDatabaseRepository, DatabaseRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IHashService, HashService>();
builder.Services.AddTransient<IEncryptionService, EncryptionService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IStringGenerator, StringGenerator>();
builder.Services.AddTransient<IUserContext, UserContext>();
builder.Services.AddTransient<IPushService, PushService>();

builder.Services.AddMediatR(options =>
{
    var assembly = Assembly.GetExecutingAssembly();
    options.RegisterServicesFromAssembly(assembly);
});

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddSwaggerGen(options =>
{
    options.EnableAnnotations();

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Wildlife Aid Foundation - Volunteer API",
        Version = "v1"
    });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Enter a valid JWT token (use the login endpoint first)",

        Reference = new OpenApiReference
        {
            Id = "Bearer",
            Type = ReferenceType.SecurityScheme
        }
    };

    options.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme,
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
    await context.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

var api = app.MapGroup("/api");
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

var apiNotify = api.MapGroup("/notify");
apiNotify.MapPost("/not-confirmed-next-shift", (IMediator mediator) => mediator.Send(new NotConfirmedNextShift()))
    .AddNote("Send notification if not confirmed next shift");

apiNotify.MapPost("/urgent-shifts", (IMediator mediator) => mediator.Send(new UrgentShifts()))
    .AddNote("Send notification for urgent shifts");

app.Run();

public static class OpenApiExtensions
{
    public static RouteHandlerBuilder AddNote(this RouteHandlerBuilder builder, string name)
    {
        builder.WithName(name);
        builder.WithOpenApi(op =>
        {
            op.Summary = name;
            return op;
        });

        return builder;
    }
}
