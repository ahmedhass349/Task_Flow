// FILE: Controllers/Api/TasksController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), pass userId to Update/Delete/ToggleStar/UpdateStatus (#2),
//          replaced inline UpdateStatusBody with UpdateStatusRequest DTO (#5), cleaned usings (#17)

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using taskflow.DTOs.Tasks;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// Manages task operations including CRUD, filtering, starring, and status updates.
    /// </summary>
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IMistralChatService _mistral;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService taskService, IMistralChatService mistral, ILogger<TasksController> logger)
        {
            _taskService = taskService;
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
        /// Retrieves a filtered list of tasks for the authenticated user.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] TaskFilterRequest filter)
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetTasksAsync(userId, filter);
            return Ok(ApiResponse<IEnumerable<TaskDto>>.Ok(tasks));
        }

        /// <summary>
        /// Retrieves a single task by its identifier.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var userId = GetUserId();
            var task = await _taskService.GetTaskByIdAsync(userId, id);
            return Ok(ApiResponse<TaskDto>.Ok(task));
        }

        /// <summary>
        /// Creates a new task for the authenticated user.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
        {
            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(userId, request);
            return StatusCode(201, ApiResponse<TaskDto>.Ok(task, "Task created successfully"));
        }

        /// <summary>
        /// Updates an existing task by its identifier.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
        {
            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(userId, id, request);
            return Ok(ApiResponse<TaskDto>.Ok(task, "Task updated successfully"));
        }

        /// <summary>
        /// Deletes a task by its identifier.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetUserId();
            await _taskService.DeleteTaskAsync(userId, id);
            return NoContent();
        }

        /// <summary>
        /// Toggles the starred status of a task.
        /// </summary>
        [HttpPatch("{id}/star")]
        public async Task<IActionResult> ToggleStar(int id)
        {
            var userId = GetUserId();
            var task = await _taskService.ToggleStarAsync(userId, id);
            return Ok(ApiResponse<TaskDto>.Ok(task, "Task star toggled"));
        }

        /// <summary>
        /// Updates the status of a task.
        /// </summary>
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var userId = GetUserId();
            var task = await _taskService.UpdateStatusAsync(userId, id, request.Status);
            return Ok(ApiResponse<TaskDto>.Ok(task, "Task status updated"));
        }

        /// <summary>
        /// Uses the AI scanner to extract task fields from an uploaded image or PDF.
        /// Returns a SmartFillResult with title, description, priority, dueDate, and assignee.
        /// </summary>
        [HttpPost("smart-fill")]
        public async Task<IActionResult> SmartFill([FromBody] SmartFillRequest request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.FileBase64) || string.IsNullOrWhiteSpace(request.MimeType))
                return BadRequest(ApiResponse<SmartFillResult>.Fail("fileBase64 and mimeType are required."));

            // Get today's date for relative-date resolution
            var today = DateTime.Today;
            var todayStr = today.ToString("MMMM d, yyyy");
            var tomorrowStr = today.AddDays(1).ToString("yyyy-MM-dd");
            var nextMondayStr = today.AddDays((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) is var nm
                                    ? today.AddDays(((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7 == 0 ? 7 : ((int)DayOfWeek.Monday - (int)today.DayOfWeek + 7) % 7).ToString("yyyy-MM-dd")
                                    : "";
            _ = nm; // suppress unused warning

            var systemPrompt =
                $"You are a precise task-extraction AI. Your only job is to read ALL text in the provided document or image and extract task information.\n\n" +
                $"TODAY'S DATE: {todayStr}\n\n" +
                "FIELD EXTRACTION RULES:\n" +
                "• title: A concise (≤10 words), action-oriented summary of the main task. Use imperative form (e.g. \"Fix login bug\", \"Submit Q3 report\", \"Design onboarding flow\"). NEVER leave empty — always infer from the content.\n" +
                "• description: All relevant details: requirements, context, steps, notes, or instructions visible in the document. Be thorough — include everything useful.\n" +
                "• priority: Must be EXACTLY one of: \"Low\", \"Medium\", \"High\", \"Urgent\". Infer as follows:\n" +
                "  - \"urgent\", \"ASAP\", \"immediately\", \"critical\", \"emergency\", \"blocker\" → \"Urgent\"\n" +
                "  - \"important\", \"high priority\", \"soon\", deadline within 3 days → \"High\"\n" +
                "  - \"normal\", \"regular\", \"standard\", no clear signal → \"Medium\"\n" +
                "  - \"low priority\", \"someday\", \"backlog\", \"nice to have\" → \"Low\"\n" +
                "• dueDate: Any deadline, due date, or target date. Convert to ISO 8601 format \"YYYY-MM-DDTHH:mm:ss\". If only a date is given, append T23:59:00. Resolve relative dates: \"tomorrow\" = " + tomorrowStr + ", \"next week\" = add 7 days, \"end of month\" = last day of current month. Return \"\" if no date is mentioned.\n" +
                "• assignee: Full name of the person assigned to or responsible for this task. Return \"\" if not found.\n" +
                "• subtasks: An array of individual checklist items, steps, sub-items, or bullet points found in the document. Each entry should be a short, plain-text action item. Return an empty array [] if none exist.\n\n" +
                "CRITICAL INSTRUCTIONS:\n" +
                "1. Read EVERY word in the image or document — do not skip any text, labels, headers, or annotations.\n" +
                "2. Return ONLY a raw JSON object. No markdown code fences, no explanation, no extra text before or after.\n" +
                "3. Output format must be exactly: {\"title\":\"...\",\"description\":\"...\",\"priority\":\"...\",\"dueDate\":\"...\",\"assignee\":\"...\",\"subtasks\":[\"...\",\"...\"]}";

            const string userPrompt =
                "Examine every piece of text in this document or image thoroughly. Extract all task-relevant information and return it as a JSON object. " +
                "Do not skip any text. Pay close attention to headings, labels, dates, names, and any prioritization keywords.";

            var raw = await _mistral.ChatWithFileAsync(userPrompt, request.FileBase64, request.MimeType, systemPrompt, ct);

            // Strip markdown code fences if the model wrapped the JSON
            var json = raw.Trim();
            if (json.StartsWith("```"))
            {
                var start = json.IndexOf('{');
                var end   = json.LastIndexOf('}');
                json = start >= 0 && end > start ? json[start..(end + 1)] : json;
            }

            SmartFillResult result;
            try
            {
                result = JsonSerializer.Deserialize<SmartFillResult>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new SmartFillResult();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Smart-fill JSON parse failed. Raw response: {Raw}", raw);
                result = new SmartFillResult();
            }

            return Ok(ApiResponse<SmartFillResult>.Ok(result, "Fields extracted successfully."));
        }
    }
}
