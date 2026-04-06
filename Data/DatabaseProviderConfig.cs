/*
  FILE: Data/DatabaseProviderConfig.cs
  PHASE: Phase 1
  PURPOSE: Provides configurable EF Core provider selection between SQLite and SQL Server.
  CHANGED FROM: New file
*/

using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace taskflow.Data
{
    public enum DatabaseProvider
    {
        SQLite,
        SqlServer
    }

    public static class DatabaseProviderExtensions
    {
        public static IServiceCollection AddConfiguredDatabase(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var provider = configuration.GetValue<string>("DatabaseProvider") ?? "SQLite";
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
            {
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(connectionString));
            }
            else
            {
                var dbPath = ResolveSqlitePath(connectionString, configuration);
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlite($"Data Source={dbPath}"));
            }

            return services;
        }

        private static string ResolveSqlitePath(
            string? connectionString,
            IConfiguration configuration)
        {
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
