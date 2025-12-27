using Api.Database;
using Api.Services;

public partial class Program
{
    private static void RegisterServices(WebApplicationBuilder builder)
    {
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddTransient<IDatabaseRepository, DatabaseRepository>();
        builder.Services.AddTransient<IHashService, HashService>();
        builder.Services.AddTransient<IEncryptionService, EncryptionService>();
        builder.Services.AddTransient<IEmailService, EmailService>();
        builder.Services.AddTransient<IStringGenerator, StringGenerator>();
        builder.Services.AddTransient<IUserContext, UserContext>();
        builder.Services.AddTransient<IPushService, PushService>();
        builder.Services.AddTransient<IRotaService, RotaService>();
        builder.Services.AddTransient<IBeaconService, BeaconService>();
    }
}

