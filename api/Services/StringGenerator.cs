using System.Security.Cryptography;
using System.Text;

namespace Api.Services;

public interface IStringGenerator
{
    string Generate(int length);
}

public class StringGenerator : IStringGenerator
{
    private const string AllowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    public string Generate(int length)
    {
        if (length <= 0)
            throw new ArgumentOutOfRangeException(nameof(length), "Length must be a positive integer.");

        var bytes = new byte[length];
        var result = new StringBuilder(length);

        using var rng = RandomNumberGenerator.Create();

        while (result.Length < length)
        {
            rng.GetBytes(bytes);

            foreach (var b in bytes)
            {
                var index = b % AllowedChars.Length;
                result.Append(AllowedChars[index]);

                if (result.Length == length)
                    break;
            }
        }

        return result.ToString();
    }
}
