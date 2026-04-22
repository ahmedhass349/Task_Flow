// FILE: Controllers/Api/ChatbotController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), pass userId to Get/Send/Delete (#2), cleaned usings (#17)
//          Phase 4: SSE error handling, logger, clear-all endpoint

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using taskflow.DTOs.Chatbot;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for managing chatbot conversations and messages.
    /// </summary>
    [ApiController]
    [Route("api/chatbot")]
    [Authorize]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;
        private readonly IMistralChatService _mistral;
        private readonly ILogger<ChatbotController> _logger;

        public ChatbotController(IChatbotService chatbotService, IMistralChatService mistral, ILogger<ChatbotController> logger)
        {
            _chatbotService = chatbotService;
            _mistral = mistral;
            _logger = logger;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Retrieves all conversations for the authenticated user.
        /// </summary>
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userId = GetUserId();
            var conversations = await _chatbotService.GetConversationsAsync(userId);
            return Ok(ApiResponse<IEnumerable<ConversationListDto>>.Ok(conversations));
        }

        /// <summary>
        /// Retrieves a specific conversation by its identifier, including all messages.
        /// </summary>
        [HttpGet("conversations/{id}")]
        public async Task<IActionResult> GetConversation(int id)
        {
            var userId = GetUserId();
            var conversation = await _chatbotService.GetConversationAsync(userId, id);
            return Ok(ApiResponse<ConversationDto>.Ok(conversation));
        }

        /// <summary>
        /// Creates a new conversation for the authenticated user.
        /// </summary>
        [HttpPost("conversations")]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request)
        {
            var userId = GetUserId();
            var conversation = await _chatbotService.CreateConversationAsync(userId, request);
            return StatusCode(201, ApiResponse<ConversationDto>.Ok(conversation, "Conversation created successfully."));
        }

        /// <summary>
        /// Sends a message to an existing conversation and receives a chatbot response.
        /// </summary>
        [HttpPost("conversations/{id}/messages")]
        public async Task<IActionResult> SendMessage(int id, [FromBody] SendChatbotMessageRequest request)
        {
            var userId = GetUserId();
            var message = await _chatbotService.SendMessageAsync(userId, id, request);
            return StatusCode(201, ApiResponse<ChatbotMessageDto>.Ok(message, "Message sent successfully."));
        }

        /// <summary>
        /// Deletes a conversation and all its messages.
        /// </summary>
        [HttpDelete("conversations/{id}")]
        public async Task<IActionResult> DeleteConversation(int id)
        {
            var userId = GetUserId();
            await _chatbotService.DeleteConversationAsync(userId, id);
            return NoContent();
        }

        /// <summary>
        /// Streams a Mistral response token-by-token via Server-Sent Events (SSE).
        /// Each token event:  data: {"token":"…"}\n\n
        /// Final event:       data: {"done":true,"message":{…}}\n\n
        /// Error event:       data: {"error":"…"}\n\n
        /// </summary>
        [HttpPost("conversations/{id}/messages/stream")]
        public async Task StreamMessage(int id, [FromBody] SendChatbotMessageRequest request, CancellationToken ct)
        {
            var userId = GetUserId();

            // BeginStreamAsync validates ownership and persists the user message.
            // If it throws here (before headers are sent), ExceptionHandlingMiddleware
            // handles it and returns a proper JSON error response.
            var state = await _chatbotService.BeginStreamAsync(userId, id, request);

            Response.ContentType = "text/event-stream; charset=utf-8";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["X-Accel-Buffering"] = "no";
            Response.Headers["Connection"] = "keep-alive";

            var accumulated = new StringBuilder();

            try
            {
                await foreach (var token in _mistral.StreamAsync(state.History, state.SystemPrompt, state.AttachedFileBase64, state.AttachedFileMimeType, state.ChatMode, ct))
                {
                    accumulated.Append(token);
                    var payload = JsonSerializer.Serialize(new { token });
                    await Response.WriteAsync($"data: {payload}\n\n", ct);
                    await Response.Body.FlushAsync(ct);
                }

                var botMsg = await _chatbotService.CommitStreamAsync(userId, id, accumulated.ToString());
                var donePayload = JsonSerializer.Serialize(new { done = true, message = botMsg });
                await Response.WriteAsync($"data: {donePayload}\n\n", ct);
                await Response.Body.FlushAsync(ct);
            }
            catch (OperationCanceledException)
            {
                // Client disconnected — commit whatever was accumulated so far (best-effort).
                if (accumulated.Length > 0)
                {
                    try { await _chatbotService.CommitStreamAsync(userId, id, accumulated.ToString()); }
                    catch (Exception ex) { _logger.LogWarning(ex, "Failed to commit partial stream for conversation {Id}", id); }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during SSE stream for conversation {Id}", id);
                try
                {
                    var errorPayload = JsonSerializer.Serialize(new { error = "Streaming failed. Please try again." });
                    await Response.WriteAsync($"data: {errorPayload}\n\n");
                    await Response.Body.FlushAsync();
                }
                catch (Exception writeEx)
                {
                    _logger.LogWarning(writeEx, "Could not write SSE error event for conversation {Id}", id);
                }
            }
        }

        /// <summary>
        /// Renames a conversation's title.
        /// </summary>
        [HttpPatch("conversations/{id}/title")]
        public async Task<IActionResult> UpdateTitle(int id, [FromBody] UpdateConversationTitleRequest request)
        {
            var userId = GetUserId();
            await _chatbotService.UpdateTitleAsync(userId, id, request.Title);
            return NoContent();
        }

        /// <summary>
        /// Deletes all conversations for the authenticated user.
        /// </summary>
        [HttpDelete("conversations")]
        public async Task<IActionResult> ClearAllConversations()
        {
            var userId = GetUserId();
            var count = await _chatbotService.ClearAllConversationsAsync(userId);
            return Ok(ApiResponse<object>.Ok(new { deleted = count }, $"{count} conversation(s) deleted."));
        }

        /// <summary>
        /// Edits an existing user message, deletes subsequent messages, and streams a new AI response.
        /// Reuses the same SSE format as StreamMessage.
        /// </summary>
        [HttpPost("conversations/{id}/messages/{msgId}/edit-stream")]
        public async Task EditAndRestream(int id, int msgId, [FromBody] EditMessageRequest request, CancellationToken ct)
        {
            var userId = GetUserId();

            var state = await _chatbotService.EditMessageAndBeginStreamAsync(userId, id, msgId, request);

            Response.ContentType = "text/event-stream; charset=utf-8";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["X-Accel-Buffering"] = "no";
            Response.Headers["Connection"] = "keep-alive";

            var accumulated = new StringBuilder();

            try
            {
                await foreach (var token in _mistral.StreamAsync(state.History, state.SystemPrompt, state.AttachedFileBase64, state.AttachedFileMimeType, state.ChatMode, ct))
                {
                    accumulated.Append(token);
                    var payload = JsonSerializer.Serialize(new { token });
                    await Response.WriteAsync($"data: {payload}\n\n", ct);
                    await Response.Body.FlushAsync(ct);
                }

                var botMsg = await _chatbotService.CommitStreamAsync(userId, id, accumulated.ToString());
                var donePayload = JsonSerializer.Serialize(new { done = true, message = botMsg });
                await Response.WriteAsync($"data: {donePayload}\n\n", ct);
                await Response.Body.FlushAsync(ct);
            }
            catch (OperationCanceledException)
            {
                if (accumulated.Length > 0)
                {
                    try { await _chatbotService.CommitStreamAsync(userId, id, accumulated.ToString()); }
                    catch (Exception ex) { _logger.LogWarning(ex, "Failed to commit partial edit-stream for conversation {Id}", id); }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during edit-stream for conversation {Id}", id);
                try
                {
                    var errorPayload = JsonSerializer.Serialize(new { error = "Streaming failed. Please try again." });
                    await Response.WriteAsync($"data: {errorPayload}\n\n");
                    await Response.Body.FlushAsync();
                }
                catch (Exception writeEx)
                {
                    _logger.LogWarning(writeEx, "Could not write SSE error event for conversation {Id}", id);
                }
            }
        }
    }
}
