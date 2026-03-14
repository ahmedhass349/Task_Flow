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
        /// Retrieves all notifications for the authenticated user.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = GetUserId();
            var notifications = await _notificationService.GetNotificationsAsync(userId);
            return Ok(ApiResponse<IEnumerable<NotificationDto>>.Ok(notifications));
        }

        /// <summary>
        /// Marks a specific notification as read.
        /// </summary>
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserId();
            await _notificationService.MarkAsReadAsync(userId, id);
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
