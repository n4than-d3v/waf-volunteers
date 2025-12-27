using Api.Configuration;
using Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

public partial class Program
{
    private const string signedInPolicy = "SignedIn";
    private const string adminPolicy = "Admin";
    private const string clockingPolicy = "Clocking";

    private static void RegisterAuthentication(WebApplicationBuilder builder)
    {
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

        builder.Services
            .AddAuthorizationBuilder()
            .AddPolicy(signedInPolicy, policy => policy.RequireAuthenticatedUser())
            .AddPolicy(adminPolicy, policy => policy.RequireAssertion((AuthorizationHandlerContext context) => context.User.IsAdmin()))
            .AddPolicy(clockingPolicy, policy => policy.RequireAssertion((AuthorizationHandlerContext context) => context.User.IsClocking()));
    }
}
