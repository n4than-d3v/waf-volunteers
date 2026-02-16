using Api.Configuration;

public partial class Program
{
    private static void RegisterConfiguration(WebApplicationBuilder builder)
    {
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
        builder.Services.Configure<RotaSettings>(
            builder.Configuration.GetSection("Rota")
        );
        builder.Services.Configure<BeaconSettings>(
            builder.Configuration.GetSection("Beacon")
        );
        builder.Services.Configure<FileSettings>(
            builder.Configuration.GetSection("Files")
        );
    }
}
