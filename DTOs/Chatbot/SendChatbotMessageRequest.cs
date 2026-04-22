using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Chatbot
{
    public class SendChatbotMessageRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;

        /// <summary>Raw text content extracted from an attached file.</summary>
        public string? FileContent { get; set; }

        /// <summary>Original filename shown in the conversation bubble.</summary>
        public string? FileName { get; set; }

        /// <summary>Base64-encoded content for image or PDF attachments (data URI stripped).</summary>
        public string? AttachedFileBase64 { get; set; }

        /// <summary>MIME type of the attached file, e.g. "image/png" or "application/pdf".</summary>
        public string? AttachedFileMimeType { get; set; }

        /// <summary>Active AI mode: "general", "coder", or "scanner". Defaults to "general".</summary>
        public string ChatMode { get; set; } = "general";
    }
}
