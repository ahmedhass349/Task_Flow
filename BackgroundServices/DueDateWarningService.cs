using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Services.Interfaces;
using TaskStatus = taskflow.Data.Entities.TaskStatus;

namespace taskflow.BackgroundServices
{
    public class DueDateWarningService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DueDateWarningService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

        public DueDateWarningService(IServiceProvider serviceProvider, ILogger<DueDateWarningService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Due date warning service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                    await ProcessDueDateWarnings(dbContext, notificationService);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing due date warnings");
                }

                await Task.Delay(_interval, stoppingToken);
            }

            _logger.LogInformation("Due date warning service stopped");
        }

        // B-03: Dedup is now DB-backed (Notifications table) so it survives restarts.
        // Notification title format: "Task Due 24 hours" / "Task Due 1 hour" (set by NotificationService).
        private async Task ProcessDueDateWarnings(AppDbContext dbContext, INotificationService notificationService)
        {
            var now = DateTime.UtcNow;

            // 24 hour warnings
            var tasksDueIn24Hours = await dbContext.TaskItems
                .AsNoTracking()
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId.HasValue &&
                           t.DueDate.HasValue &&
                           t.DueDate.Value > now &&
                           t.DueDate.Value <= now.AddHours(24) &&
                           t.Status != TaskStatus.Completed)
                .ToListAsync();

            foreach (var task in tasksDueIn24Hours)
            {
                if (!await AlreadyNotifiedAsync(dbContext, task.AssigneeId!.Value, task.Id,
                        NotificationType.TaskDueSoon, "24 hours", TimeSpan.FromHours(23)))
                {
                    await notificationService.NotifyTaskDueSoonAsync(task.AssigneeId!.Value, task, "24 hours");
                    _logger.LogInformation("Sent 24-hour due warning for task {TaskId}", task.Id);
                }
            }

            // 1 hour warnings
            var tasksDueIn1Hour = await dbContext.TaskItems
                .AsNoTracking()
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId.HasValue &&
                           t.DueDate.HasValue &&
                           t.DueDate.Value > now &&
                           t.DueDate.Value <= now.AddHours(1) &&
                           t.Status != TaskStatus.Completed)
                .ToListAsync();

            foreach (var task in tasksDueIn1Hour)
            {
                if (!await AlreadyNotifiedAsync(dbContext, task.AssigneeId!.Value, task.Id,
                        NotificationType.TaskDueSoon, "1 hour", TimeSpan.FromMinutes(55)))
                {
                    await notificationService.NotifyTaskDueSoonAsync(task.AssigneeId!.Value, task, "1 hour");
                    _logger.LogInformation("Sent 1-hour due warning for task {TaskId}", task.Id);
                }
            }

            // Overdue tasks
            var overdueTasks = await dbContext.TaskItems
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId.HasValue &&
                           t.DueDate.HasValue &&
                           t.DueDate.Value < now &&
                           t.Status != TaskStatus.Completed)
                .ToListAsync();

            foreach (var task in overdueTasks)
            {
                if (task.Status != TaskStatus.Overdue)
                    task.Status = TaskStatus.Overdue;

                if (!await AlreadyNotifiedAsync(dbContext, task.AssigneeId!.Value, task.Id,
                        NotificationType.TaskOverdue, null, TimeSpan.FromHours(23)))
                {
                    await notificationService.NotifyTaskOverdueAsync(task.AssigneeId!.Value, task);
                    _logger.LogInformation("Sent overdue notification for task {TaskId}", task.Id);
                }
            }

            if (overdueTasks.Count > 0)
                await dbContext.SaveChangesAsync();
        }

        // Checks whether a notification of the given type+title already exists within `window`.
        // Using the Notifications table means the dedup state survives process restarts.
        private static async Task<bool> AlreadyNotifiedAsync(
            AppDbContext db, int userId, int taskId,
            NotificationType type, string? titlePart, TimeSpan window)
        {
            var cutoff = DateTime.UtcNow - window;
            IQueryable<Notification> query = db.Notifications.AsNoTracking()
                .Where(n => n.UserId == userId
                         && n.RelatedTaskId == taskId
                         && n.Type == type
                         && n.CreatedAt > cutoff);
            if (titlePart != null)
                query = query.Where(n => n.Title.Contains(titlePart));
            return await query.AnyAsync();
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Due date warning service stopping...");
            await base.StopAsync(cancellationToken);
        }
    }
}
