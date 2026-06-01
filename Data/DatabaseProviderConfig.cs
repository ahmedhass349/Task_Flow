/*
  FILE: Data/DatabaseProviderConfig.cs
  PHASE: 1
  MISSION: 3-Backend
  CHANGES:
    - Removed SqlServer branch (Microsoft.EntityFrameworkCore.SqlServer was a dead
      dependency — this project is SQLite-only; the package is no longer referenced)
*/

using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace taskflow.Data
{
    public static class DatabaseProviderExtensions
    {
        public static IServiceCollection AddConfiguredDatabase(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            var dbPath = ResolveSqlitePath(connectionString, configuration);
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite($"Data Source={dbPath}"));
            return services;
        }

        private static string ResolveSqlitePath(
            string? connectionString,
            IConfiguration configuration)
        {
            // Tauri sets TASKFLOW_DB_PATH to app.path().appDataDir() in production
            // so the SQLite database is written to the user's profile, not the read-only install dir.
            var envDbPath = Environment.GetEnvironmentVariable("TASKFLOW_DB_PATH");
            if (!string.IsNullOrWhiteSpace(envDbPath))
            {
                Directory.CreateDirectory(envDbPath);
                return Path.Combine(envDbPath, "taskflow.db");
            }

            if (!string.IsNullOrWhiteSpace(connectionString)
                && connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
            {
                var path = connectionString.Replace("Data Source=", string.Empty, StringComparison.OrdinalIgnoreCase).Trim();
                if (Path.IsPathRooted(path))
                {
                    return path;
                }

                var configuredRoot = configuration.GetValue<string>("DatabaseRootPath");
                if (!string.IsNullOrWhiteSpace(configuredRoot))
                {
                    Directory.CreateDirectory(configuredRoot);
                    return Path.Combine(configuredRoot, path);
                }

                return Path.GetFullPath(path);
            }

            var appDataDir = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            var appDir = Path.Combine(appDataDir, "TaskFlow");
            Directory.CreateDirectory(appDir);
            return Path.Combine(appDir, "taskflow.db");
        }
    }
}
