
using System.Threading.RateLimiting;
using Api.Configuration;
using Microsoft.Extensions.Options;

public interface ILoginPolicyService
{
    RateLimitPartition<string> GetPolicy(HttpContext context);
}

public sealed class LoginPolicyService : ILoginPolicyService
{
    private readonly string[] _trustedNetworks;

    public LoginPolicyService(IOptions<SecuritySettings> settings)
    {
        _trustedNetworks = settings.Value.TrustedNetworks ?? [];
    }

    public RateLimitPartition<string> GetPolicy(HttpContext context)
    {
        string ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        if (IsTrusted(ip))
        {
            return RateLimitPartition.GetNoLimiter(ip);
        }
        else
        {
            return RateLimitPartition.GetTokenBucketLimiter(ip, GenerateOptions);
        }
    }

    private TokenBucketRateLimiterOptions GenerateOptions(string ip) => new()
    {
        TokenLimit = 5,
        TokensPerPeriod = 1,
        ReplenishmentPeriod = TimeSpan.FromMinutes(1),
        AutoReplenishment = true,
        QueueLimit = 0
    };

    private bool IsTrusted(string? ipAddress)
    {
        if (string.IsNullOrWhiteSpace(ipAddress))
        {
            return false;
        }

        return _trustedNetworks.Contains(ipAddress);
    }
}
