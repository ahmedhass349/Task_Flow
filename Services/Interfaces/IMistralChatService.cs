using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace taskflow.Services.Interfaces
{
    public interface IMistralChatService
    {
        /// <summary>Send a multi-turn conversation to Mistral and return the full assistant reply.</summary>
        Task<string> ChatAsync(IEnumerable<(string Role, string Content)> history, string? systemPrompt = null, CancellationToken ct = default);

        /// <summary>Stream a multi-turn conversation, yielding each token as it arrives.</summary>
        /// <param name="attachedFileBase64">Optional base64-encoded image or PDF to attach to the final user message.</param>
        /// <param name="attachedFileMimeType">MIME type of the attachment, e.g. "image/png" or "application/pdf".</param>
        /// <param name="chatMode">Active AI mode: "general", "coder", or "scanner".</param>
        IAsyncEnumerable<string> StreamAsync(IEnumerable<(string Role, string Content)> history, string? systemPrompt = null, string? attachedFileBase64 = null, string? attachedFileMimeType = null, string? chatMode = null, CancellationToken ct = default);

        /// <summary>Generate a short (≤5 word) conversation title from the first user message.</summary>
        Task<string> GenerateTitleAsync(string firstUserMessage, CancellationToken ct = default);

        /// <summary>
        /// Send a single prompt with an optional file attachment and receive a complete (non-streaming) response.
        /// Images are sent multimodally; PDFs are OCR-extracted first.
        /// </summary>
        Task<string> ChatWithFileAsync(string userPrompt, string? fileBase64 = null, string? fileMimeType = null, string? systemPrompt = null, CancellationToken ct = default);
    }
}
