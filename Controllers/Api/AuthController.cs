// FILE: Controllers/Api/AuthController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() to return 401 (#3), removed try-catch blocks (#15), cleaned usings (#17),
//          added fire-and-forget presence upsert to MongoDB relay on login/register (Phase 2)

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Auth;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// Handles authentication operations including login, registration, and password management.
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMongoService _mongoService;
        private readonly IUserDataSyncService _userDataSync;

        public AuthController(IAuthService authService, IMongoService mongoService, IUserDataSyncService userDataSync)
        {
            _authService  = authService;
            _mongoService = mongoService;
            _userDataSync = userDataSync;
        }

        /// <summary>
        /// Extracts the authenticated user's ID from the JWT claims.
        /// Throws <see cref="UnauthorizedAccessException"/> if the claim is missing.
        /// </summary>
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        /// <summary>
        /// Authenticates a user with email and password credentials.
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            // Fire-and-forget presence upsert — MongoDB failure must not block login
            _ = Task.Run(async () =>
            {
                try { await _mongoService.UpsertPresenceAsync(result.User.Email, result.User.FullName, result.User.AvatarUrl ?? string.Empty); }
                catch { /* intentionally swallowed */ }
            });

            // Phase 2: pull down cross-device data for this user (fire-and-forget)
            _ = Task.Run(async () =>
            {
                try { await _userDataSync.PullForUserAsync(result.User.Id); }
                catch { /* intentionally swallowed */ }
            });

            return Ok(ApiResponse<AuthResponse>.Ok(result, "Login successful"));
        }

        /// <summary>
        /// Registers a new user account.
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);

            // Fire-and-forget presence upsert — MongoDB failure must not block registration
            _ = Task.Run(async () =>
            {
                try { await _mongoService.UpsertPresenceAsync(result.User.Email, result.User.FullName, result.User.AvatarUrl ?? string.Empty); }
                catch { /* intentionally swallowed */ }
            });

            return StatusCode(201, ApiResponse<AuthResponse>.Ok(result, "Registration successful"));
        }

        /// <summary>
        /// Initiates a password reset flow by sending an email with a reset token.
        /// </summary>
        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            await _authService.ForgotPasswordAsync(request);
            return Ok(ApiResponse<string>.Ok("", "Recovery code generated. Please check the app window."));
        }

        /// <summary>
        /// Resets a user's password using a previously issued reset token.
        /// </summary>
        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(ApiResponse<string>.Ok("Password has been reset", "Password reset successful"));
        }

        /// <summary>
        /// Retrieves the currently authenticated user's profile information.
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = GetUserId();
            try
            {
                var user = await _authService.GetCurrentUserAsync(userId);
                return Ok(ApiResponse<UserDto>.Ok(user));
            }
            catch (KeyNotFoundException)
            {
                // The JWT was structurally valid but the account no longer exists in the DB
                // (e.g. DB was reset). Treat this as an auth failure so the client clears
                // the stale token rather than getting an ambiguous 404.
                return Unauthorized(ApiResponse<string>.Fail("Your session is no longer valid. Please log in again."));
            }
        }

        /// <summary>
        /// Logs out the current user. Since JWT is stateless, this endpoint simply acknowledges the logout request.
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(ApiResponse<string>.Ok("Logged out", "Logout successful"));
        }
    }
}
