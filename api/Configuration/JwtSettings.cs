using System.Text;

namespace Api.Configuration;

public class JwtSettings
{
    public string SecretKey { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpiresInMinutes { get; set; }

    public byte[] SecretKeyBytes => Encoding.UTF8.GetBytes(SecretKey);
}
