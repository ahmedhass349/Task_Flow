// FILE: Controllers/Api/NotificationsController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), pass userId to MarkAsRead (#2), cleaned usings (#17), standardized route (#20)

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Notifications;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for managing user notifications.
    /// </summary>
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Retrieves notifications for the authenticated user with pagination.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetUserId();
            var notifications = await _notificationService.GetForUserAsync(userId, page, pageSize);
            return Ok(ApiResponse<IEnumerable<NotificationDto>>.Ok(notifications));
        }

        /// <summary>
        /// Gets the unread count for the authenticated user.
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(ApiResponse<int>.Ok(count));
        }

        /// <summary>
        /// Marks a specific notification as read.
        /// </summary>
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserId();
            await _notificationService.MarkAsReadAsync(id, userId);
            return Ok(ApiResponse<string>.Ok("Notification marked as read."));
        }

        /// <summary>
        /// Marks all notifications as read for the authenticated user.
        /// </summary>
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserId();
            await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(ApiResponse<string>.Ok("All notifications marked as read."));
        }
    }
}
