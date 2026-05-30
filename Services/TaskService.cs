/*
  FILE: Services/TaskService.cs
  PHASE: 2
  DEFECT: 3-Persistence
  CHANGES:
    - CreateTaskAsync: resolve creator's email (userId -> email) and populate CreatedByEmail on
      the new TaskItem so MirrorService writes it to MongoDB. Reuses the already-fetched assignee
      record when the creator is also the assignee (self-assignment) to avoid an extra query.
    - AssignTaskAsync: resolve assigner's email (assignerUserId -> email) and populate
      CreatedByEmail so the task creator can be identified cross-device in UserDataSyncService's
      OR filter (AssigneeEmail OR CreatedByEmail).
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using taskflow.Data.Entities;
using taskflow.DTOs.Tasks;
using taskflow.DTOs.Notifications;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;
using TaskStatus = taskflow.Data.Entities.TaskStatus;

namespace taskflow.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<TaskService> _logger;
        private readonly INotificationService _notificationService;
        private readonly IReminderService _reminderService;
        private readonly IMirrorService _mirror;
        private readonly IUserRepository _userRepository;
        private readonly IMongoService _mongoService;

        public TaskService(ITaskRepository taskRepository, IMapper mapper, ILogger<TaskService> logger, INotificationService notificationService, IReminderService reminderService, IMirrorService mirror, IUserRepository userRepository, IMongoService mongoService)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
            _logger = logger;
            _notificationService = notificationService;
            _reminderService = reminderService;
            _mirror = mirror;
            _userRepository = userRepository;
            _mongoService = mongoService;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterRequest filter)
        {
            string? statusStr = filter.Status?.ToString();
            string? priorityStr = filter.Priority?.ToString();

            // Fix #8: Add search to the DB query instead of in-memory
            var query = _taskRepository.Query()
                .Include(t => t.Project)
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId == userId);

            if (!string.IsNullOrEmpty(statusStr))
            {
                if (Enum.TryParse<TaskStatus>(statusStr, ignoreCase: true, out var parsedStatus))
                {
                    query = query.Where(t => t.Status == parsedStatus);
                }
            }

            if (!string.IsNullOrEmpty(priorityStr))
            {
                if (Enum.TryParse<TaskPriority>(priorityStr, ignoreCase: true, out var parsedPriority))
                {
                    query = query.Where(t => t.Priority == parsedPriority);
                }
            }

            if (filter.ProjectId.HasValue)
            {
                query = query.Where(t => t.ProjectId == filter.ProjectId.Value);
            }

            if (filter.IsStarred.HasValue)
            {
                query = query.Where(t => t.IsStarred == filter.IsStarred.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(search) ||
                                         (t.Description != null && t.Description.ToLower().Contains(search)));
            }

            var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<TaskDto> GetTaskByIdAsync(int userId, int taskId)
        {
            var task = await _taskRepository.Query()
                .Include(t => t.Project)
                .Include(t => t.Assignee)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            if (task.AssigneeId != userId)
                throw new UnauthorizedAccessException("You do not have permission to view this task.");

            return _mapper.Map<TaskDto>(task);
        }

        public async Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request)
        {
            if (request.DueDate.HasValue && request.DueDate.Value.Date < DateTime.UtcNow.Date)
                throw new ArgumentException("Due date cannot be before today.");

            // Phase 2: look up assignee email for cross-device MongoDB queries
            int effectiveAssigneeId = request.AssigneeId ?? userId;
            var assignee = await _userRepository.GetByIdAsync(effectiveAssigneeId);
            // Avoid a second query when creator == assignee (self-assignment)
            var creatorEmail = (effectiveAssigneeId == userId)
                ? assignee?.Email
                : (await _userRepository.GetByIdAsync(userId))?.Email;

            var task = new TaskItem
            {
                Title = request.Title,
                Description = request.Description,
                ProjectId = request.ProjectId,
                AssigneeId = effectiveAssigneeId,
                AssigneeEmail = assignee?.Email,  // Phase 2
                CreatedById = userId,  // Phase 4: track creator
                CreatedByEmail = creatorEmail,    // Phase 2: stable cross-device creator key
                Priority = request.Priority,
                Status = request.Status,
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow
            };

            await _taskRepository.AddAsync(task);
            await _taskRepository.SaveChangesAsync();
            _mirror.Mirror("tasks", task.Id, task);

            // Schedule reminders if provided
            if (request.ReminderMap != null && (request.NotifyEmail || request.NotifyInApp))
            {
                try
                {
                    var reminderDto = new CreateReminderDto
                    {
                        TaskId = task.Id,
                        ReminderMap = request.ReminderMap,
                        DueDate = request.DueDate,
                        NotifyEmail = request.NotifyEmail,
                        NotifyInApp = request.NotifyInApp
                    };
                    await _reminderService.SaveRemindersAsync(reminderDto, userId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to schedule reminders for task {Id}", task.Id);
                    // Don't fail task creation if reminder scheduling fails
                }
            }

            // Send notification
            try
            {
                await _notificationService.NotifyTaskCreatedAsync(userId, task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send notification for task {Id}", task.Id);
                // Don't fail task creation if notification fails
            }

            return await GetTaskByIdAsync(userId, task.Id);
        }

        // PHASE 3: Assign a task to a team member by their email on behalf of a leader.
        public async Task<TaskDto> AssignTaskAsync(int assignerUserId, AssignTaskRequest request)
        {
            var assignee = await _userRepository.GetByEmailAsync(request.AssigneeEmail)
                ?? throw new KeyNotFoundException($"User with email '{request.AssigneeEmail}' not found.");

            if (request.DueDate.HasValue && request.DueDate.Value.Date < DateTime.UtcNow.Date)
                throw new ArgumentException("Due date cannot be before today.");

            // Resolve assigner email so the task records its creator cross-device
            var assigner = await _userRepository.GetByIdAsync(assignerUserId);
            if (assigner == null)
                throw new UnauthorizedAccessException("Assigner account not found.");

            var assignerEmail = assigner.Email ?? string.Empty;
            if (!string.IsNullOrWhiteSpace(assignerEmail))
            {
                var assignerMembers = await _mongoService.GetAllTeamMembersAsync(assignerEmail);
                var assigneeRecord = assignerMembers.FirstOrDefault(m =>
                    string.Equals(m.UserEmail, assignee.Email, StringComparison.OrdinalIgnoreCase));

                if (assigneeRecord != null)
                {
                    var role = assigneeRecord.Role?.Trim().ToLowerInvariant() ?? string.Empty;
                    if (role is "leader" or "owner" or "admin")
                        throw new InvalidOperationException("Team leaders cannot be assigned tasks.");
                }
            }

            var task = new TaskItem
            {
                Title = request.Title,
                Description = request.Description,
                ProjectId = request.ProjectId,
                AssigneeId = assignee.Id,
                AssigneeEmail = assignee.Email,  // Phase 2
                CreatedById = assignerUserId,  // Phase 4: track who assigned
                CreatedByEmail = assigner.Email, // Phase 2: stable cross-device creator key
                Priority = request.Priority,
                Status = request.Status,
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow,
                LastModifiedBy = assignee.Email
            };

            await _taskRepository.AddAsync(task);
            await _taskRepository.SaveChangesAsync();
            _mirror.Mirror("tasks", task.Id, task);

            // Schedule reminders under the assignee's account
            if (request.ReminderMap != null && (request.NotifyEmail || request.NotifyInApp))
            {
                try
                {
                    var reminderDto = new CreateReminderDto
                    {
                        TaskId = task.Id,
                        ReminderMap = request.ReminderMap,
                        DueDate = request.DueDate,
                        NotifyEmail = request.NotifyEmail,
                        NotifyInApp = request.NotifyInApp
                    };
                    await _reminderService.SaveRemindersAsync(reminderDto, assignee.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to schedule reminders for assigned task {Id}", task.Id);
                }
            }

            // Notify the assignee
            try
            {
                await _notificationService.NotifyTaskCreatedAsync(assignee.Id, task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send notification for assigned task {Id}", task.Id);
            }

            // Return DTO visible to the assigner (bypass ownership check)
            var created = await _taskRepository.Query()
                .Include(t => t.Project)
                .Include(t => t.Assignee)
                .FirstOrDefaultAsync(t => t.Id == task.Id);
            return _mapper.Map<TaskDto>(created!);
        }

        public async Task<TaskDto> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            if (request.DueDate.HasValue && request.DueDate.Value.Date < DateTime.UtcNow.Date)
                throw new ArgumentException("Due date cannot be before today.");

            // Ownership check (#2)
            if (task.AssigneeId != userId)
                throw new UnauthorizedAccessException("You do not have permission to update this task.");

            var changes = new List<string>();

            if (!string.Equals(task.Title, request.Title, StringComparison.Ordinal))
                changes.Add($"title: '{task.Title}' -> '{request.Title}'");

            if (!string.Equals(task.Description ?? string.Empty, request.Description ?? string.Empty, StringComparison.Ordinal))
                changes.Add("description");

            if (task.Priority != request.Priority)
                changes.Add($"priority: {task.Priority} -> {request.Priority}");

            if (task.Status != request.Status)
                changes.Add($"status: {task.Status} -> {request.Status}");

            if (task.DueDate != request.DueDate)
            {
                var fromDue = task.DueDate.HasValue ? task.DueDate.Value.ToString("MMM dd, yyyy h:mm tt") : "none";
                var toDue = request.DueDate.HasValue ? request.DueDate.Value.ToString("MMM dd, yyyy h:mm tt") : "none";
                changes.Add($"due date: {fromDue} -> {toDue}");
            }

            task.Title = request.Title;
            task.Description = request.Description;
            // Phase 2: update AssigneeEmail when AssigneeId changes for cross-device sync
            if (request.AssigneeId.HasValue && request.AssigneeId.Value != task.AssigneeId)
            {
                var newAssignee = await _userRepository.GetByIdAsync(request.AssigneeId.Value);
                task.AssigneeEmail = newAssignee?.Email;
            }
            task.AssigneeId = request.AssigneeId ?? task.AssigneeId;
            task.Priority = request.Priority;
            task.Status = request.Status;
            task.DueDate = request.DueDate;

            _taskRepository.Update(task);
            await _taskRepository.SaveChangesAsync();
            _mirror.Mirror("tasks", task.Id, task);

            if (request.ReminderMap != null)
            {
                try
                {
                    var reminderDto = new CreateReminderDto
                    {
                        TaskId = task.Id,
                        ReminderMap = request.ReminderMap,
                        DueDate = request.DueDate,
                        NotifyEmail = request.NotifyEmail,
                        NotifyInApp = request.NotifyInApp
                    };

                    await _reminderService.SaveRemindersAsync(reminderDto, userId);
                    changes.Add("reminders");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to update reminders for task {Id}", task.Id);
                }
            }

            try
            {
                var changeSummary = changes.Count > 0 ? string.Join(", ", changes) : "details updated";
                await _notificationService.NotifyTaskUpdatedAsync(userId, task, changeSummary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send update notification for task {Id}", task.Id);
            }

            return await GetTaskByIdAsync(userId, task.Id);
        }

        public async Task DeleteTaskAsync(int userId, int taskId)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            // Ownership check (#2)
            if (task.AssigneeId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete this task.");

            // Queue MongoDB erase before SQLite remove so the outbox entry exists
            // if the app crashes between the two operations (D1 atomicity fix).
            _mirror.EraseSync("tasks", task.SyncId);
            _taskRepository.Remove(task);
            await _taskRepository.SaveChangesAsync();
        }

        public async Task<TaskDto> ToggleStarAsync(int userId, int taskId)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            // Ownership check (#2)
            if (task.AssigneeId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this task.");

            task.IsStarred = !task.IsStarred;

            _taskRepository.Update(task);
            await _taskRepository.SaveChangesAsync();
            _mirror.Mirror("tasks", task.Id, task);

            return await GetTaskByIdAsync(userId, task.Id);
        }

        public async Task<TaskDto> UpdateStatusAsync(int userId, int taskId, string status)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            // Ownership check (#2)
            if (task.AssigneeId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this task.");

            if (!Enum.TryParse<TaskStatus>(status, ignoreCase: true, out var parsedStatus))
                throw new ArgumentException($"Invalid status value: {status}");

            task.Status = parsedStatus;

            _taskRepository.Update(task);
            await _taskRepository.SaveChangesAsync();
            _mirror.Mirror("tasks", task.Id, task);

            return await GetTaskByIdAsync(userId, task.Id);
        }
    }
}
