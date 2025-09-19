using Api.Configuration;
using Api.Database;
using Api.Handlers.Accounts;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
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

builder.Services.AddTransient<IDatabaseRepository, DatabaseRepository>();

builder.Services.AddTransient<IHashService, HashService>();
builder.Services.AddTransient<IEncryptionService, EncryptionService>();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddMediatR(options =>
{
    var assembly = Assembly.GetExecutingAssembly();
    options.RegisterServicesFromAssembly(assembly);
});

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
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
apiAccount.MapPost("/", (IMediator mediator, CreateAccount request) => mediator.Send(request));
apiAccount.MapPost("/reset-password", (IMediator mediator, RequestPasswordResetHandler request) => mediator.Send(request));

app.Run();
