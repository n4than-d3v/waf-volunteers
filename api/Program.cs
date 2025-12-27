using Api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PostgreSQL");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

RegisterConfiguration(builder);
RegisterAuthentication(builder);

#if DEBUG
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
#endif

RegisterServices(builder);

builder.Services.AddMediatR(options =>
{
    var assembly = Assembly.GetExecutingAssembly();
    options.RegisterServicesFromAssembly(assembly);
});

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

AddSwagger(builder);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
    await context.Database.MigrateAsync();

    await context.LoadMedications();
    await context.SetupHospitalReferenceData();

}

UseSwagger(app);

app.UseHttpsRedirection();

#if DEBUG
app.UseCors("AllowAngularApp");
#endif

var api = app.MapGroup("/api");
RegisterRoutes(api);

app.Run();

public partial class Program { }