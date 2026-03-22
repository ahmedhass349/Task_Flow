using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IO;
using System;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(
                    _configuration["EmailSettings:SenderName"] ?? "Task Flow",
                    _configuration["EmailSettings:SenderEmail"] ?? "noreply@taskflow.com"
                ));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = htmlBody,
                    TextBody = HtmlToText(htmlBody)
                };

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    _configuration["EmailSettings:SmtpHost"],
                    int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587"),
                    MailKit.Security.SecureSocketOptions.StartTls
                );
                await smtp.AuthenticateAsync(
                    _configuration["EmailSettings:SmtpUser"],
                    _configuration["EmailSettings:SmtpPass"]
                );
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {To}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", to);
                throw;
            }
        }

        public async Task SendWelcomeEmailAsync(string to, string firstName)
        {
            var template = await LoadEmailTemplate("WelcomeEmail.html");
            var htmlBody = template
                .Replace("{{FirstName}}", firstName)
                .Replace("{{AppUrl}}", _configuration["AppSettings:BaseUrl"] ?? "http://localhost:3000");

            await SendEmailAsync(to, "Welcome to Task Flow!", htmlBody);
        }

        public async Task SendTaskReminderEmailAsync(string to, string firstName, string taskTitle, DateTime dueDate, string taskUrl)
        {
            var template = await LoadEmailTemplate("TaskReminderEmail.html");
            var htmlBody = template
                .Replace("{{FirstName}}", firstName)
                .Replace("{{TaskTitle}}", taskTitle)
                .Replace("{{DueDate}}", dueDate.ToString("MMM dd, yyyy 'at' h:mm tt"))
                .Replace("{{TaskUrl}}", taskUrl);

            await SendEmailAsync(to, $"Task Reminder: {taskTitle}", htmlBody);
        }

        public async Task SendTaskDueSoonEmailAsync(string to, string firstName, string taskTitle, string timeframe, string taskUrl)
        {
            var template = await LoadEmailTemplate("TaskDueSoonEmail.html");
            var htmlBody = template
                .Replace("{{FirstName}}", firstName)
                .Replace("{{TaskTitle}}", taskTitle)
                .Replace("{{Timeframe}}", timeframe)
                .Replace("{{TaskUrl}}", taskUrl);

            await SendEmailAsync(to, $"Task Due {timeframe}: {taskTitle}", htmlBody);
        }

        public async Task SendTaskOverdueEmailAsync(string to, string firstName, string taskTitle, string taskUrl)
        {
            var template = await LoadEmailTemplate("TaskOverdueEmail.html");
            var htmlBody = template
                .Replace("{{FirstName}}", firstName)
                .Replace("{{TaskTitle}}", taskTitle)
                .Replace("{{TaskUrl}}", taskUrl);

            await SendEmailAsync(to, $"Task Overdue: {taskTitle}", htmlBody);
        }

        private async Task<string> LoadEmailTemplate(string templateName)
        {
            var templatePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Templates",
                "Emails",
                templateName
            );

            if (!File.Exists(templatePath))
            {
                _logger.LogWarning("Email template not found: {TemplatePath}", templatePath);
                return "<html><body><h1>Email Template Not Found</h1><p>Please configure the email templates.</p></body></html>";
            }

            return await File.ReadAllTextAsync(templatePath);
        }

        private string HtmlToText(string html)
        {
            // Simple HTML to text conversion - in production, consider using a proper library
            return System.Text.RegularExpressions.Regex.Replace(html, "<[^>]*>", string.Empty)
                .Replace("&nbsp;", " ")
                .Replace("&lt;", "<")
                .Replace("&gt;", ">")
                .Replace("&amp;", "&")
                .Trim();
        }
    }
}
