using System.Collections.Generic;

namespace taskflow.DTOs.Tasks
{
    /// <summary>Request body for the AI-powered task smart-fill endpoint.</summary>
    public class SmartFillRequest
    {
        /// <summary>Raw base64-encoded file content (no data-URI prefix).</summary>
        public string FileBase64 { get; set; } = string.Empty;

        /// <summary>MIME type of the uploaded file, e.g. "image/png" or "application/pdf".</summary>
        public string MimeType { get; set; } = string.Empty;
    }

    /// <summary>Structured task fields extracted by the AI scanner.</summary>
    public class SmartFillResult
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        /// <summary>One of: Low, Medium, High, Urgent</summary>
        public string? Priority { get; set; }
        /// <summary>ISO 8601 datetime string if a deadline was found, otherwise null.</summary>
        public string? DueDate { get; set; }
        public string? Assignee { get; set; }
        /// <summary>List of subtask/checklist item texts extracted from the document.</summary>
        public List<string>? Subtasks { get; set; }
    }
}
