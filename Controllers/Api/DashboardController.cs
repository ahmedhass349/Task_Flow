// FILE: Controllers/Api/DashboardController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), cleaned usings (#17), standardized route (#20)

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Dashboard;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for retrieving dashboard statistics and activity.
    /// </summary>
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Retrieves dashboard statistics for the authenticated user.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetUserId();
            var stats = await _dashboardService.GetStatsAsync(userId);
            return Ok(ApiResponse<DashboardStatsDto>.Ok(stats));
        }

        /// <summary>
        /// Retrieves recent activity items for the authenticated user.
        /// </summary>
        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var userId = GetUserId();
            var activity = await _dashboardService.GetRecentActivityAsync(userId);
            return Ok(ApiResponse<IEnumerable<ActivityItemDto>>.Ok(activity));
        }
    }
}
