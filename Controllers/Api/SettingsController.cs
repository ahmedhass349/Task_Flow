// FILE: Controllers/Api/SettingsController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), cleaned usings (#17), standardized route (#20)

using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Settings;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for managing user profile settings and account operations.
    /// </summary>
    [ApiController]
    [Route("api/settings")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Retrieves the profile information for the authenticated user.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _settingsService.GetProfileAsync(userId);
            return Ok(ApiResponse<ProfileDto>.Ok(profile));
        }

        /// <summary>
        /// Updates the profile information for the authenticated user.
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = GetUserId();
            var profile = await _settingsService.UpdateProfileAsync(userId, request);
            return Ok(ApiResponse<ProfileDto>.Ok(profile, "Profile updated successfully."));
        }

        /// <summary>
        /// Changes the password for the authenticated user.
        /// </summary>
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = GetUserId();
            await _settingsService.ChangePasswordAsync(userId, request);
            return Ok(ApiResponse<string>.Ok("Password changed successfully."));
        }

        /// <summary>
        /// Permanently deletes the authenticated user's account.
        /// </summary>
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = GetUserId();
            await _settingsService.DeleteAccountAsync(userId);
            return NoContent();
        }
    }
}
