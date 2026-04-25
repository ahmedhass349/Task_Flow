using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using taskflow.DTOs.Mistral;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class MistralChatService : IMistralChatService
    {
        private readonly string _apiKey;
        private readonly string _chatModel;
        private readonly string _coderModel;
        private readonly string _ocrModel;

        private readonly IHttpClientFactory _httpFactory;
        private readonly ILogger<MistralChatService> _logger;

        private const string HardcodedApiKey = "B0tvPW52GKBJDw321cub71GDDJZJXDRJ";

        public MistralChatService(IHttpClientFactory httpFactory, ILogger<MistralChatService> logger, IConfiguration configuration)
        {
            _httpFactory = httpFactory;
            _logger = logger;
            _apiKey = HardcodedApiKey;
            _chatModel = configuration["Mistral:Model"] ?? "mistral-small-latest";
            _coderModel = configuration["Mistral:CoderModel"] ?? "codestral-latest";
            _ocrModel = configuration["Mistral:OcrModel"] ?? "mistral-ocr-latest";
        }

        public async Task<string> ChatAsync(
            IEnumerable<(string Role, string Content)> history,
            string? systemPrompt = null,
            CancellationToken ct = default)
        {
            using var client = _httpFactory.CreateClient("MistralClient");
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            var messages = new System.Collections.Generic.List<MistralChatMessage>
            {
                new MistralChatMessage
                {
                    Role = "system",
                    Content = systemPrompt ??
                              "You are TaskFlow AI, an intelligent assistant embedded in a task and project management application. " +
                              "Help users plan tasks, summarise projects, draft messages to teammates, suggest prioritisation strategies, " +
                              "set goals, and answer any workspace-related questions. Be concise, practical, and action-oriented."
                }
            };

            messages.AddRange(history.Select(m => new MistralChatMessage { Role = m.Role, Content = m.Content }));

            var request = new MistralChatRequest
            {
                Model = _chatModel,
                Messages = messages,
                ResponseFormat = null
            };

            var jsonOptions = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            };
            var json = JsonSerializer.Serialize(request, jsonOptions);

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            var response = await client.SendAsync(httpRequest, ct);
            response.EnsureSuccessStatusCode();

            var chatResponse = await response.Content.ReadFromJsonAsync<MistralChatResponse>(cancellationToken: ct)
                               ?? throw new System.InvalidOperationException("Mistral chat returned null.");

            return chatResponse.Choices.Count > 0
                ? chatResponse.Choices[0].Message.Content.Trim()
                : string.Empty;
        }

        public async IAsyncEnumerable<string> StreamAsync(
            IEnumerable<(string Role, string Content)> history,
            string? systemPrompt = null,
            string? attachedFileBase64 = null,
            string? attachedFileMimeType = null,
            string? chatMode = null,
            [EnumeratorCancellation] CancellationToken ct = default)
        {
            using var client = _httpFactory.CreateClient("MistralClient");
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            // Select model and system prompt based on chat mode
            string activeModel;
            string defaultSystem;
            switch (chatMode?.ToLowerInvariant())
            {
                case "coder":
                    activeModel = _coderModel;
                    defaultSystem =
                        "You are TaskFlow AI in Coder mode. You are an expert software engineer and coding assistant. " +
                        "Help with writing, reviewing, debugging, and explaining code. " +
                        "Provide clear, idiomatic, production-ready code with brief explanations. " +
                        "Prefer accuracy and best practices over verbosity.";
                    break;
                case "scanner":
                    activeModel = _chatModel;
                    defaultSystem =
                        "You are TaskFlow AI in Scanner mode. You extract, organize, and summarize information from documents and images. " +
                        "Present extracted data clearly and accurately. When given a document, extract all relevant text, tables, and structured information faithfully.";
                    break;
                default: // "general" or null
                    activeModel = _chatModel;
                    defaultSystem =
                        "You are TaskFlow AI, an intelligent assistant embedded in a task and project management application. " +
                        "Help users plan tasks, summarise projects, draft messages to teammates, suggest prioritisation strategies, " +
                        "set goals, and answer any workspace-related questions. Be concise, practical, and action-oriented.";
                    break;
            }

            // Coder mode: Codestral is text-only — no multimodal image support
            bool isCoder = string.Equals(chatMode, "coder", StringComparison.OrdinalIgnoreCase);

            bool hasImage = !isCoder &&
                            !string.IsNullOrEmpty(attachedFileBase64) &&
                            !string.IsNullOrEmpty(attachedFileMimeType) &&
                            attachedFileMimeType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);

            bool hasPdf = !string.IsNullOrEmpty(attachedFileBase64) &&
                          string.Equals(attachedFileMimeType, "application/pdf", StringComparison.OrdinalIgnoreCase);

            // For PDFs: extract text via OCR first, then inject as plain text into the chat message
            string? pdfExtractedText = null;
            if (hasPdf)
            {
                pdfExtractedText = await ExtractPdfTextViaOcrAsync(attachedFileBase64!, ct);
            }

            var histList = history.ToList();
            var allMessages = new List<object>
            {
                new { role = "system", content = systemPrompt ?? defaultSystem }
            };

            for (int i = 0; i < histList.Count; i++)
            {
                var (role, content) = histList[i];
                bool isLastUserMsg = i == histList.Count - 1 && role == "user";

                if (isLastUserMsg && hasImage)
                {
                    allMessages.Add(new
                    {
                        role = "user",
                        content = (object)new object[]
                        {
                            new { type = "text", text = content },
                            new { type = "image_url", image_url = new { url = $"data:{attachedFileMimeType};base64,{attachedFileBase64}" } }
                        }
                    });
                }
                else if (isLastUserMsg && hasPdf)
                {
                    var combinedText = string.IsNullOrWhiteSpace(pdfExtractedText)
                        ? content
                        : $"{content}\n\n[Attached PDF content:]\n{pdfExtractedText}";
                    allMessages.Add(new { role = "user", content = combinedText });
                }
                else
                {
                    allMessages.Add(new { role, content });
                }
            }

            var payload = new
            {
                model = activeModel,
                messages = allMessages,
                temperature = 0.7,
                stream = true
            };

            var json = JsonSerializer.Serialize(payload);
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response;
            string? earlyError = null;
            try
            {
                response = await client.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead, ct);
                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogError("Mistral stream request failed with {Status}. Body: {Body}", response.StatusCode, body);
                    response.EnsureSuccessStatusCode(); // throws
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mistral stream request failed.");
                earlyError = ex.Message;
                response = null!;
            }

            if (earlyError != null)
            {
                yield return $"[Error: {earlyError}]";
                yield break;
            }

            using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream && !ct.IsCancellationRequested)
            {
                var line = await reader.ReadLineAsync();
                if (line == null) break;
                if (!line.StartsWith("data: ")) continue;

                var data = line["data: ".Length..];
                if (data.Trim() == "[DONE]") break;

                MistralStreamChunk? chunk;
                try
                {
                    chunk = JsonSerializer.Deserialize<MistralStreamChunk>(data);
                }
                catch
                {
                    continue;
                }

                var token = chunk?.Choices.Count > 0 ? chunk.Choices[0].Delta.Content : null;
                if (!string.IsNullOrEmpty(token))
                    yield return token;
            }
        }

        private async Task<string?> ExtractImageTextViaOcrAsync(string base64Image, string mimeType, CancellationToken ct)
        {
            try
            {
                using var client = _httpFactory.CreateClient("MistralClient");
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

                var payload = new
                {
                    model = _ocrModel,
                    document = new
                    {
                        type = "image_url",
                        image_url = $"data:{mimeType};base64,{base64Image}"
                    }
                };

                var json = JsonSerializer.Serialize(payload);
                using var request = new HttpRequestMessage(HttpMethod.Post, "v1/ocr")
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };

                var response = await client.SendAsync(request, ct);
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogError("Mistral OCR (image) request failed with {Status}. Body: {Body}", response.StatusCode, errorBody);
                    return null;
                }

                using var doc = await JsonDocument.ParseAsync(
                    await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);

                if (!doc.RootElement.TryGetProperty("pages", out var pages))
                    return null;

                var sb = new StringBuilder();
                foreach (var page in pages.EnumerateArray())
                {
                    if (page.TryGetProperty("markdown", out var md))
                    {
                        var text = md.GetString();
                        if (!string.IsNullOrWhiteSpace(text))
                            sb.AppendLine(text);
                    }
                }

                return sb.Length > 0 ? sb.ToString().Trim() : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Image OCR extraction failed.");
                return null;
            }
        }

        private async Task<string?> ExtractPdfTextViaOcrAsync(string base64Pdf, CancellationToken ct)
        {
            try
            {
                using var client = _httpFactory.CreateClient("MistralClient");
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

                var payload = new
                {
                    model = _ocrModel,
                    document = new
                    {
                        type = "document_url",
                        document_url = $"data:application/pdf;base64,{base64Pdf}"
                    }
                };

                var json = JsonSerializer.Serialize(payload);
                using var request = new HttpRequestMessage(HttpMethod.Post, "v1/ocr")
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };

                var response = await client.SendAsync(request, ct);
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogError("Mistral OCR request failed with {Status}. Body: {Body}", response.StatusCode, errorBody);
                    return null;
                }

                using var doc = await JsonDocument.ParseAsync(
                    await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);

                if (!doc.RootElement.TryGetProperty("pages", out var pages))
                    return null;

                var sb = new StringBuilder();
                foreach (var page in pages.EnumerateArray())
                {
                    if (page.TryGetProperty("markdown", out var md))
                    {
                        var text = md.GetString();
                        if (!string.IsNullOrWhiteSpace(text))
                            sb.AppendLine(text);
                    }
                }

                return sb.Length > 0 ? sb.ToString().Trim() : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PDF OCR extraction failed.");
                return null;
            }
        }

        public async Task<string> GenerateTitleAsync(string firstUserMessage, CancellationToken ct = default)
        {
            var history = new[]
            {
                ("user",
                 $"Generate a concise conversation title (5 words maximum, no quotes) for a chat that starts with: {firstUserMessage}")
            };
            try
            {
                var title = await ChatAsync(
                    history,
                    "You generate short, descriptive conversation titles. Reply only with the title, nothing else.",
                    ct);
                return title.Trim().Trim('"').Trim('\'');
            }
            catch
            {
                return "New Conversation";
            }
        }

        /// <inheritdoc />
        public async Task<string> ChatWithFileAsync(
            string userPrompt,
            string? fileBase64 = null,
            string? fileMimeType = null,
            string? systemPrompt = null,
            CancellationToken ct = default)
        {
            using var client = _httpFactory.CreateClient("MistralClient");
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            bool hasImage = !string.IsNullOrEmpty(fileBase64) &&
                            !string.IsNullOrEmpty(fileMimeType) &&
                            fileMimeType!.StartsWith("image/", StringComparison.OrdinalIgnoreCase);

            bool hasPdf = !string.IsNullOrEmpty(fileBase64) &&
                          string.Equals(fileMimeType, "application/pdf", StringComparison.OrdinalIgnoreCase);

            // Use mistral-ocr-latest to extract text from both images and PDFs
            string? extractedText = null;
            if (hasImage)
                extractedText = await ExtractImageTextViaOcrAsync(fileBase64!, fileMimeType!, ct);
            else if (hasPdf)
                extractedText = await ExtractPdfTextViaOcrAsync(fileBase64!, ct);

            object userContent;
            if (!string.IsNullOrWhiteSpace(extractedText))
            {
                userContent = $"{userPrompt}\n\n[Extracted content from attached file:]\n{extractedText}";
            }
            else
            {
                userContent = userPrompt;
            }

            var allMessages = new List<object>
            {
                new { role = "system", content = systemPrompt ?? "You are a helpful assistant." },
                new { role = "user", content = userContent }
            };

            var payload = new
            {
                model = _chatModel,
                messages = allMessages,
                temperature = 0.1
            };

            var json = JsonSerializer.Serialize(payload);
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            var response = await client.SendAsync(httpRequest, ct);
            response.EnsureSuccessStatusCode();

            var chatResponse = await response.Content.ReadFromJsonAsync<MistralChatResponse>(cancellationToken: ct)
                               ?? throw new InvalidOperationException("Mistral returned null.");

            return chatResponse.Choices.Count > 0
                ? chatResponse.Choices[0].Message.Content.Trim()
                : "{}";
        }
    }
}
