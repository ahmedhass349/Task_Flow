/*
  FILE: Helpers/FileSignatureValidator.cs
  PHASE: 1
  PART: 2-Security
  CHANGES:
    - New file: validates file magic bytes against expected signatures for each
      allowed extension, preventing extension-spoofing attacks (SEC-05).
*/
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace taskflow.Helpers
{
    public static class FileSignatureValidator
    {
        // Number of bytes to inspect — enough to cover all signatures below.
        private const int HeaderLength = 16;

        /// <summary>
        /// Reads the first bytes of <paramref name="file"/> and verifies that they match
        /// the expected magic bytes for the given <paramref name="extension"/>.
        /// Returns <c>true</c> when valid (or when no signature check is defined for the
        /// extension), <c>false</c> when the signature does not match.
        /// </summary>
        public static async Task<bool> IsValidAsync(IFormFile file, string extension)
        {
            var ext = extension.ToLowerInvariant();

            // Plain text files have no reliable magic bytes — extension check is sufficient.
            if (ext == ".txt") return true;

            var header = await ReadHeaderAsync(file);

            return ext switch
            {
                ".jpg" or ".jpeg" => StartsWith(header, 0xFF, 0xD8, 0xFF),
                ".png"            => StartsWith(header, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A),
                ".gif"            => StartsWith(header, 0x47, 0x49, 0x46, 0x38),          // GIF8
                ".webp"           => IsWebP(header),
                ".pdf"            => StartsWith(header, 0x25, 0x50, 0x44, 0x46),          // %PDF
                ".doc" or ".xls"  => StartsWith(header, 0xD0, 0xCF, 0x11, 0xE0),         // OLE2
                ".docx" or ".xlsx" or ".zip" => StartsWith(header, 0x50, 0x4B, 0x03, 0x04), // PK..
                ".mp3"            => IsMp3(header),
                ".mp4" or ".mov"  => IsQuickTime(header),
                _                 => true  // unknown extension — already blocked by AllowedExtensions
            };
        }

        private static async Task<byte[]> ReadHeaderAsync(IFormFile file)
        {
            var buf = new byte[HeaderLength];
            using var stream = file.OpenReadStream();
            var read = await stream.ReadAsync(buf.AsMemory(0, HeaderLength));
            return buf[..read];
        }

        private static bool StartsWith(byte[] header, params byte[] signature)
        {
            if (header.Length < signature.Length) return false;
            for (int i = 0; i < signature.Length; i++)
                if (header[i] != signature[i]) return false;
            return true;
        }

        // RIFF....WEBP: bytes 0-3 = 52 49 46 46, bytes 8-11 = 57 45 42 50
        private static bool IsWebP(byte[] header) =>
            header.Length >= 12 &&
            StartsWith(header, 0x52, 0x49, 0x46, 0x46) &&
            header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

        // ID3-tagged MP3: ID3 (49 44 33), or sync-safe frame FF FB/F3/F2
        private static bool IsMp3(byte[] header) =>
            header.Length >= 3 &&
            ((header[0] == 0x49 && header[1] == 0x44 && header[2] == 0x33) ||  // ID3
             (header[0] == 0xFF && (header[1] == 0xFB || header[1] == 0xF3 || header[1] == 0xF2)));

        // QuickTime/MPEG-4: offset-4 'ftyp' box — bytes 4-7 = 66 74 79 70
        private static bool IsQuickTime(byte[] header) =>
            header.Length >= 8 &&
            header[4] == 0x66 && header[5] == 0x74 && header[6] == 0x79 && header[7] == 0x70;
    }
}
