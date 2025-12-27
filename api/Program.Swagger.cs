using Microsoft.OpenApi.Models;

public partial class Program
{
    private static void AddSwagger(WebApplicationBuilder builder)
    {
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
    }

    private static void UseSwagger(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
    }
}

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