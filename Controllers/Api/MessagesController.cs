// FILE: Controllers/Api/MessagesController.cs

using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Messages;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for managing messages and conversations.
    /// </summary>
    [ApiController]
    [Route("api/messages")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IWebHostEnvironment _env;

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".gif", ".webp",
            ".pdf", ".doc", ".docx", ".xls", ".xlsx",
            ".txt", ".zip", ".mp3", ".mp4", ".mov"
        };

        private const long MaxFileSizeBytes = 20 * 1024 * 1024; // 20 MB

        public MessagesController(IMessageService messageService, IWebHostEnvironment env)
        {
            _messageService = messageService;
            _env = env;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Retrieves all contacts (users with conversation history) for the authenticated user.
        /// </summary>
        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
            var userId = GetUserId();
            var contacts = await _messageService.GetContactsAsync(userId);
            return Ok(ApiResponse<IEnumerable<ContactDto>>.Ok(contacts, "Contacts retrieved successfully"));
        }

        /// <summary>
        /// Retrieves the full conversation between the authenticated user and a specific contact.
        /// </summary>
        [HttpGet("{contactId}")]
        public async Task<IActionResult> GetConversation(int contactId)
        {
            var userId = GetUserId();
            var messages = await _messageService.GetConversationAsync(userId, contactId);
            return Ok(ApiResponse<IEnumerable<MessageDto>>.Ok(messages, "Conversation retrieved successfully"));
        }

        /// <summary>
        /// Sends a new message from the authenticated user to a specified receiver.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var userId = GetUserId();
            var message = await _messageService.SendMessageAsync(userId, request);
            return StatusCode(201, ApiResponse<MessageDto>.Ok(message, "Message sent successfully"));
        }

        /// <summary>
        /// Uploads a file attachment and returns its URL + metadata.
        /// </summary>
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<object>.Fail("No file provided."));

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(ApiResponse<object>.Fail("File exceeds the 20 MB size limit."));

            var ext = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(ApiResponse<object>.Fail("File type not allowed."));

            var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "messages");
            Directory.CreateDirectory(uploadsDir);

            var safeFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, safeFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var url = $"/uploads/messages/{safeFileName}";

            // Determine attachment type category
            string attachmentType;
            var imgExts = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var pdfExts = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".pdf" };
            if (imgExts.Contains(ext)) attachmentType = "image";
            else if (pdfExts.Contains(ext)) attachmentType = "pdf";
            else attachmentType = "file";

            return Ok(ApiResponse<object>.Ok(new
            {
                url,
                name = file.FileName,
                type = attachmentType,
                size = file.Length
            }, "File uploaded successfully"));
        }

        /// <summary>
        /// Resolves a user by email into a ContactDto so the frontend can start a new conversation.
        /// </summary>
        [HttpPost("resolve-contact")]
        public async Task<IActionResult> ResolveContact([FromBody] ResolveContactRequest request)
        {
            var userId = GetUserId();
            var contact = await _messageService.ResolveContactAsync(userId, request.Email);
            if (contact == null)
                return NotFound(ApiResponse<object>.Fail("User not found."));
            return Ok(ApiResponse<ContactDto>.Ok(contact, "Contact resolved"));
        }

        /// <summary>
        /// Marks all messages in a conversation as read (from the authenticated user's perspective).
        /// </summary>
        [HttpPatch("{contactId}/read")]
        public async Task<IActionResult> MarkConversationAsRead(int contactId)
        {
            var userId = GetUserId();
            await _messageService.MarkConversationAsReadAsync(userId, contactId);
            return Ok(ApiResponse<object>.Ok((object?)null, "Conversation marked as read"));
        }

        /// <summary>
        /// Marks all messages across all conversations as read for the authenticated user.
        /// </summary>
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserId();
            await _messageService.MarkAllAsReadAsync(userId);
            return Ok(ApiResponse<object>.Ok((object?)null, "All messages marked as read"));
        }

        /// <summary>
        /// Deletes a conversation from the authenticated user's view.
        /// The other person receives a system farewell message.
        /// </summary>
        [HttpDelete("conversation/{contactId}")]
        public async Task<IActionResult> DeleteConversation(int contactId)
        {
            var userId = GetUserId();
            await _messageService.DeleteConversationAsync(userId, contactId);
            return Ok(ApiResponse<object>.Ok((object?)null, "Conversation deleted"));
        }
    }
}
