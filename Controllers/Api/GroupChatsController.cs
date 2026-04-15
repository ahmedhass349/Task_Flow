using System;
using System.IO;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.GroupChats;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    [ApiController]
    [Route("api/group-chats")]
    [Authorize]
    public class GroupChatsController : ControllerBase
    {
        private readonly IGroupChatService _groupChatService;
        private readonly IWebHostEnvironment _env;

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".gif", ".webp",
            ".pdf", ".doc", ".docx", ".xls", ".xlsx",
            ".txt", ".zip", ".mp3", ".mp4", ".mov"
        };

        private const long MaxFileSizeBytes = 20 * 1024 * 1024; // 20 MB

        public GroupChatsController(IGroupChatService groupChatService, IWebHostEnvironment env)
        {
            _groupChatService = groupChatService;
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
        /// Returns all group chats the current user belongs to.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetGroupChats()
        {
            var userId = GetUserId();
            var groups = await _groupChatService.GetUserGroupChatsAsync(userId);
            return Ok(ApiResponse<List<GroupChatDto>>.Ok(groups, "Group chats retrieved"));
        }

        /// <summary>
        /// Creates a new group chat.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatRequest request)
        {
            var userId = GetUserId();
            var group = await _groupChatService.CreateGroupChatAsync(userId, request);
            return StatusCode(201, ApiResponse<GroupChatDto>.Ok(group, "Group chat created"));
        }

        /// <summary>
        /// Returns all messages in a group chat.
        /// </summary>
        [HttpGet("{id}/messages")]
        public async Task<IActionResult> GetMessages(int id)
        {
            var userId = GetUserId();
            var messages = await _groupChatService.GetGroupMessagesAsync(id, userId);
            return Ok(ApiResponse<List<GroupMessageDto>>.Ok(messages, "Messages retrieved"));
        }

        /// <summary>
        /// Sends a message to a group chat.
        /// </summary>
        [HttpPost("{id}/messages")]
        public async Task<IActionResult> SendMessage(int id, [FromBody] SendGroupMessageRequest request)
        {
            var userId = GetUserId();
            var message = await _groupChatService.SendGroupMessageAsync(id, userId, request);
            return StatusCode(201, ApiResponse<GroupMessageDto>.Ok(message, "Message sent"));
        }

        /// <summary>
        /// Marks all messages in a group chat as read for the current user.
        /// </summary>
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserId();
            await _groupChatService.MarkGroupAsReadAsync(id, userId);
            return NoContent();
        }

        /// <summary>
        /// Leaves (removes current user from) a group chat.
        /// </summary>
        [HttpDelete("{id}/leave")]
        public async Task<IActionResult> LeaveGroup(int id)
        {
            var userId = GetUserId();
            await _groupChatService.LeaveGroupAsync(id, userId);
            return NoContent();
        }

        /// <summary>
        /// Uploads an attachment for a group message.
        /// Reuses the same upload logic as individual messages.
        /// </summary>
        [HttpPost("upload")]
        [RequestSizeLimit(MaxFileSizeBytes + 1024)]
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<string>.Fail("No file provided."));

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(ApiResponse<string>.Fail("File size exceeds 20 MB limit."));

            var ext = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(ApiResponse<string>.Fail("File type not allowed."));

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "group-attachments");
            Directory.CreateDirectory(uploadsFolder);

            var safeFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, safeFileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var imageExts = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileType = imageExts.Contains(ext) ? "image"
                : ext.Equals(".pdf", StringComparison.OrdinalIgnoreCase) ? "pdf"
                : "file";

            return Ok(new
            {
                url = $"/uploads/group-attachments/{safeFileName}",
                name = file.FileName,
                type = fileType,
                size = file.Length
            });
        }
    }
}
