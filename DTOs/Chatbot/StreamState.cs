using System.Collections.Generic;

namespace taskflow.DTOs.Chatbot
{
    /// <summary>Carries the history tuple list from BeginStreamAsync to the streaming controller action.</summary>
    public class StreamState
    {
        public IEnumerable<(string Role, string Content)> History { get; set; }
            = System.Linq.Enumerable.Empty<(string, string)>();

        /// <summary>Context-aware system prompt built from the user's tasks and projects.</summary>
        public string? SystemPrompt { get; set; }

        /// <summary>True when no bot reply exists yet — triggers auto-title after commit.</summary>
        public bool IsFirstMessage { get; set; }

        /// <summary>Base64-encoded attachment (image or PDF) to forward to the vision model.</summary>
        public string? AttachedFileBase64 { get; set; }

        /// <summary>MIME type of the attachment, e.g. "image/png" or "application/pdf".</summary>
        public string? AttachedFileMimeType { get; set; }

        /// <summary>Active AI mode: "general", "coder", or "scanner".</summary>
        public string ChatMode { get; set; } = "general";
    }
}
