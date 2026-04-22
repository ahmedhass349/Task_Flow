using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using taskflow.Data;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// Development-only controller for resetting application state during testing.
    /// All endpoints return 404 in non-development environments.
    /// </summary>
    [ApiController]
    [Route("api/dev")]
    [Authorize]
    public class DevController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _db;
        private readonly IMongoService _mongo;

        public DevController(IWebHostEnvironment env, AppDbContext db, IMongoService mongo)
        {
            _env = env;
            _db = db;
            _mongo = mongo;
        }

        private IActionResult DevOnly()
        {
            if (!_env.IsDevelopment())
                return NotFound();
            return null!; // caller checks
        }

        /// <summary>
        /// Clears the MongoDB relay (user_presence, team_invitations, team_members).
        /// </summary>
        [HttpPost("reset-mongo")]
        public async Task<IActionResult> ResetMongo()
        {
            if (!_env.IsDevelopment()) return NotFound();

            await _mongo.ClearAllAsync();
            return Ok(ApiResponse<string>.Ok("Cleared", "MongoDB collections cleared"));
        }

        /// <summary>
        /// Clears SQLite tables (teams, tasks, projects etc.).
        /// AppUsers are preserved unless ?users=true is passed.
        /// </summary>
        [HttpPost("reset-sqlite")]
        public async Task<IActionResult> ResetSqlite([FromQuery] bool users = false)
        {
            if (!_env.IsDevelopment()) return NotFound();

            // Delete in FK-safe order (children before parents)
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ChatbotMessages");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ChatbotConversations");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TaskComments");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TaskItems");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ProjectMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Projects");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TeamMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Teams");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Messages");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Notifications");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Reminders");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM CalendarEvents");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM LocalTeamMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM LocalInvitations");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM SyncOutboxEntries");

            if (users)
                await _db.Database.ExecuteSqlRawAsync("DELETE FROM AppUsers");

            return Ok(ApiResponse<string>.Ok("Cleared", users
                ? "SQLite fully cleared (including users)"
                : "SQLite cleared (users preserved)"));
        }

        /// <summary>
        /// Clears both SQLite and MongoDB in one call.
        /// Pass ?users=true to also wipe all user accounts.
        /// </summary>
        [HttpPost("reset-all")]
        public async Task<IActionResult> ResetAll([FromQuery] bool users = false)
        {
            if (!_env.IsDevelopment()) return NotFound();

            // MongoDB
            await _mongo.ClearAllAsync();

            // SQLite
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ChatbotMessages");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ChatbotConversations");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TaskComments");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TaskItems");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM ProjectMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Projects");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM TeamMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Teams");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Messages");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Notifications");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM Reminders");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM CalendarEvents");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM LocalTeamMembers");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM LocalInvitations");
            await _db.Database.ExecuteSqlRawAsync("DELETE FROM SyncOutboxEntries");

            if (users)
                await _db.Database.ExecuteSqlRawAsync("DELETE FROM AppUsers");

            return Ok(ApiResponse<string>.Ok("Cleared", users
                ? "Both databases fully cleared"
                : "Both databases cleared (users preserved)"));
        }
    }
}
