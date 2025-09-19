using Api.Configuration;
using Api.Constants;
using Api.Database;
using Api.Handlers.Accounts;
using Api.Handlers.Accounts.Admin;
using Api.Handlers.Accounts.Info;
using Api.Handlers.Accounts.Reset;
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
const string rotaPolicy = "Rota";
const string adminPolicy = "Admin";

builder.Services
    .AddAuthorizationBuilder()
    .AddPolicy(signedInPolicy, policy => policy.RequireAuthenticatedUser())
    .AddPolicy(rotaPolicy, policy => policy.RequireAssertion((AuthorizationHandlerContext context) => context.User.CanSignUp()))
    .AddPolicy(adminPolicy, policy => policy.RequireAssertion((AuthorizationHandlerContext context) => context.User.IsAdmin()));

builder.Services.AddTransient<IDatabaseRepository, DatabaseRepository>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IHashService, HashService>();
builder.Services.AddTransient<IEncryptionService, EncryptionService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IStringGenerator, StringGenerator>();
builder.Services.AddTransient<IUserContext, UserContext>();

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

var api = app.MapGroup("/api");
var apiAccount = api.MapGroup("/account");

apiAccount.MapGet("/users", (IMediator mediator) => mediator.Send(new GetAccounts()))
    .AddNote("Admin views all users' account info")
    .RequireAuthorization(adminPolicy);

apiAccount.MapPost("/users", (IMediator mediator, CreateAccount request) => mediator.Send(request))
    .AddNote("Admin creates an account")
    .RequireAuthorization(adminPolicy);

apiAccount.MapPost("/password/reset", (IMediator mediator, RequestPasswordReset request) => mediator.Send(request))
    .AddNote("Unauthenticated user requests email to be sent to them for resetting their password");

apiAccount.MapPut("/password/reset", (IMediator mediator, ResetPassword request) => mediator.Send(request))
    .AddNote("Unauthenticated user uses emailed token to reset their password");

apiAccount.MapPost("/login", (IMediator mediator, Login request) => mediator.Send(request))
    .AddNote("Unauthenticated user sends their username and password to login");

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

apiAccount.MapPut("/users/{id:int}", (IMediator mediator, int id, UpdateAccountInfo request) => mediator.Send(request.WithId(id)))
    .AddNote("Admin updates the account info of another user")
    .RequireAuthorization(adminPolicy);

var apiRota = api.MapGroup("/rota");
apiRota.RequireAuthorization(rotaPolicy);

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
