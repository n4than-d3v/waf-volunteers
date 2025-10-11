using Api.Configuration;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace Api.Services;

public interface IEncryptionService
{
    string GenerateSalt();

    string Encrypt(string value, string salt);
    string Decrypt(string value, string salt);
}

public class EncryptionService : IEncryptionService
{
    private readonly Encoding _encoding;
    private readonly string _aesKey;

    public EncryptionService(IOptions<SecuritySettings> settings)
    {
        _encoding = Encoding.UTF8;
        _aesKey = settings.Value.AesKey;
    }

    public string GenerateSalt()
    {
        var algorithm = CreateAes();
        algorithm.GenerateIV();
        return Convert.ToBase64String(algorithm.IV);
    }

    public string Encrypt(string value, string salt)
    {
        using var algorithm = CreateAes();
        algorithm.IV = Convert.FromBase64String(salt);
        using var encryptor = algorithm.CreateEncryptor();
        using var memoryStream = new MemoryStream();
        using var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
        using (var streamWriter = new StreamWriter(cryptoStream))
        {
            streamWriter.Write((value ?? string.Empty).Trim());
        }
        var encrypted = memoryStream.ToArray();
        return Convert.ToBase64String(encrypted);
    }

    public string Decrypt(string value, string salt)
    {
        using var algorithm = CreateAes();
        algorithm.IV = Convert.FromBase64String(salt);
        var encryptedBytes = Convert.FromBase64String(value);
        using var decryptor = algorithm.CreateDecryptor();
        using var memoryStream = new MemoryStream(encryptedBytes);
        using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
        using var streamReader = new StreamReader(cryptoStream);
        return streamReader.ReadToEnd();
    }

    private Aes CreateAes()
    {
        var algorithm = Aes.Create();
        algorithm.Mode = CipherMode.CBC;
        algorithm.Key = _encoding.GetBytes(_aesKey);
        algorithm.Padding = PaddingMode.PKCS7;
        return algorithm;
    }
}
