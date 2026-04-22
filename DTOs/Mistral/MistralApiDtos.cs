using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace taskflow.DTOs.Mistral
{
    // ── Mistral Chat Completions API ───────────────────────────────────────────

    public class MistralChatMessage
    {
        [JsonPropertyName("role")]
        public string Role { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    public class MistralChatRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = "mistral-small-latest";

        [JsonPropertyName("messages")]
        public List<MistralChatMessage> Messages { get; set; } = new();

        [JsonPropertyName("temperature")]
        public double Temperature { get; set; } = 0.1;

        [JsonPropertyName("response_format")]
        public MistralResponseFormat? ResponseFormat { get; set; }
    }

    public class MistralResponseFormat
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "json_object";
    }

    public class MistralChatChoice
    {
        [JsonPropertyName("message")]
        public MistralChatMessage Message { get; set; } = new();
    }

    public class MistralChatResponse
    {
        [JsonPropertyName("choices")]
        public List<MistralChatChoice> Choices { get; set; } = new();
    }

    // ── Mistral Streaming API ──────────────────────────────────────────────────

    public class MistralStreamDelta
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }

    public class MistralStreamChoice
    {
        [JsonPropertyName("delta")]
        public MistralStreamDelta Delta { get; set; } = new();
    }

    public class MistralStreamChunk
    {
        [JsonPropertyName("choices")]
        public List<MistralStreamChoice> Choices { get; set; } = new();
    }
}
