using Api.Configuration;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace Api.Services;

public interface IHashService
{
    string Hash(string value);
}

public class HashService : IHashService
{
    private readonly Encoding _encoding;
    private readonly string _hmacKey;

    public HashService(IOptions<SecuritySettings> settings)
    {
        _encoding = Encoding.UTF8;
        _hmacKey = settings.Value.HmacKey;
    }

    public string Hash(string value)
    {
        var keyBytes = _encoding.GetBytes(_hmacKey);
        var valueBytes = _encoding.GetBytes(value);
        var algorithm = new HMACSHA256(keyBytes);
        var hashBytes = algorithm.ComputeHash(valueBytes);
        return Convert.ToBase64String(hashBytes);
    }
}
