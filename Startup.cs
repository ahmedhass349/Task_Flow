using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Newtonsoft.Json;
using Microsoft.OpenApi.Models;
using Serilog;
using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text;
using taskflow.Data;
using taskflow.Helpers;
using taskflow.Mapping;
using taskflow.Middleware;
using taskflow.Repositories;
using taskflow.Repositories.Interfaces;
using taskflow.Services;
using taskflow.Services.Interfaces;

namespace taskflow
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Environment = env;
            Configuration = configuration;

            var logDirectory = env.IsProduction()
                ? Path.Combine(
                    System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData),
                    "TaskFlow",
                    "Logs")
                : Path.Combine("App_Data", "Logs");

            Directory.CreateDirectory(logDirectory);
            var logFilePath = Path.Combine(logDirectory, "log-.txt");

            // D-01: Console sink is dev-only — production output goes to the rolling log file only.
            var logConfig = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.File(logFilePath,
                  rollingInterval: RollingInterval.Day,
                  fileSizeLimitBytes: 536870912,
                  retainedFileCountLimit: 7);

            if (env.IsDevelopment())
                logConfig = logConfig.WriteTo.Console();

            Log.Logger = logConfig.CreateLogger();
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            // ── Response Compression ─────────────────────────────────────────
            services.Configure<GzipCompressionProviderOptions>
                (options => options.Level = CompressionLevel.Fastest);

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
            });

            // ── Entity Framework ─────────────────────────────────────────────
            services.AddConfiguredDatabase(Configuration);

            // ── AutoMapper ───────────────────────────────────────────────────
            services.AddAutoMapper(_ => { }, typeof(MappingProfile).Assembly);

            // ── CORS ─────────────────────────────────────────────────────────
            // In Tauri production the React renderer loads from tauri://localhost origin.
            // The backend only binds to 127.0.0.1 so permitting any origin is safe —
            // no external machine can reach the API.
            // SetIsOriginAllowed (not AllowAnyOrigin) is used so AllowCredentials()
            // is still valid, which is required for SignalR hub connections.
            services.AddCors(options =>
            {
                options.AddPolicy("AllowConfigured", builder =>
                {
                    builder.SetIsOriginAllowed(_ => true)
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            // ── Controllers + JSON ───────────────────────────────────────────
            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver =
                        new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // ── FluentValidation ─────────────────────────────────────────────
            services.AddFluentValidationAutoValidation();
            services.AddFluentValidationClientsideAdapters();
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // ── Swagger (Development-only) ────────────────────────────────
            if (Environment.IsDevelopment())
            {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "TaskFlow API",
                    Version = "v1",
                    Description = "Task Flow application API"
                });

                // JWT auth in Swagger
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        System.Array.Empty<string>()
                    }
                });
            }); // AddSwaggerGen
            } // if (IsDevelopment)

            // ── Repositories (DI) ────────────────────────────────────────────
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IReminderRepository, ReminderRepository>();
            services.AddScoped<IChatbotRepository, ChatbotRepository>();
            services.AddScoped<ITaskCommentRepository, TaskCommentRepository>();
            services.AddScoped<IGroupChatRepository, GroupChatRepository>();

            // ── Services (DI) ────────────────────────────────────────────────
            services.AddScoped<IAccountRestorationService, AccountRestorationService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITaskService, TaskService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<ICalendarService, CalendarService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IReminderService, ReminderService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<ISettingsService, SettingsService>();
            services.AddScoped<IChatbotService, ChatbotService>();
            services.AddScoped<ITaskCommentService, TaskCommentService>();
            services.AddScoped<IGroupChatService, GroupChatService>();
            services.AddScoped<IMistralChatService, MistralChatService>();

            // ── MongoDB relay + offline/online sync ──────────────────────────
            // Register concrete MongoService first so it can be injected directly
            services.AddSingleton<MongoService>();
            // ConnectivityService depends on MongoService (concrete) for pinging
            services.AddSingleton<IConnectivityService, ConnectivityService>();
            // OfflineAwareMongoService wraps MongoService with offline read/write
            services.AddSingleton<IMongoService, OfflineAwareMongoService>();
            // MirrorService mirrors every SQLite write to MongoDB (fire-and-forget)
            services.AddSingleton<IMirrorService, MirrorService>();
            // Phase 2: pull-down service for cross-device sync on login
            services.AddSingleton<IUserDataSyncService, UserDataSyncService>();

            // ── HTTP Client for Mistral API ──────────────────────────────────
            services.AddHttpClient("MistralClient", client =>
            {
                client.BaseAddress = new System.Uri("https://api.mistral.ai/");
                client.Timeout = System.TimeSpan.FromMinutes(5);
            });

            // ── File upload limit (50 MB) ────────────────────────────────────
            services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o =>
            {
                o.MultipartBodyLengthLimit = 52_428_800;
            });

            // ── SignalR ─────────────────────────────────────────────────────
            services.AddSignalR();

            // ── Rate limiting ───────────────────────────────────────────────
            // C-01: GlobalLimiter — sliding window, 300 req/min per authenticated userId.
            // Falls back to remote IP for anonymous requests.
            services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("auth", o =>
                {
                    o.PermitLimit = 10;
                    o.Window = TimeSpan.FromMinutes(1);
                    o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    o.QueueLimit = 0;
                });

                // C-01: Per-user global cap — partitioned by JWT userId so each user
                // gets their own bucket rather than all local users sharing one IP bucket.
                options.GlobalLimiter = PartitionedRateLimiter.Create<Microsoft.AspNetCore.Http.HttpContext, string>(ctx =>
                {
                    var userId = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                                 ?? ctx.Connection.RemoteIpAddress?.ToString()
                                 ?? "anon";
                    return RateLimitPartition.GetSlidingWindowLimiter(userId, _ => new SlidingWindowRateLimiterOptions
                    {
                        PermitLimit          = 300,
                        Window               = TimeSpan.FromMinutes(1),
                        SegmentsPerWindow    = 6,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit           = 0,
                    });
                });

                options.RejectionStatusCode = 429;
            });

            // ── Background Services ───────────────────────────────────────────
            services.AddHostedService<BackgroundServices.ReminderProcessorService>();
            services.AddHostedService<BackgroundServices.DueDateWarningService>();
            services.AddHostedService<BackgroundServices.OfflineSyncService>();
            services.AddHostedService<BackgroundServices.BulkSyncStartupService>();
            services.AddHostedService<BackgroundServices.DatabaseCleanupService>();
            services.AddHostedService<BackgroundServices.CrossNotificationPollerService>();

            // ── Helpers (DI) ─────────────────────────────────────────────────
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IHostApplicationLifetime appLifetime)
        {
            // ── Security Headers ────────────────────────────────────────────────
            app.Use(async (context, next) =>
            {
                context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
                context.Response.Headers["X-Content-Type-Options"] = "nosniff";
                context.Response.Headers["X-Frame-Options"] = "DENY";
                context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
                context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
                await next();
            });

            loggerFactory.AddSerilog();

            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);
            appLifetime.ApplicationStarted.Register(() =>
            {
                var address = app.ServerFeatures.Get<IServerAddressesFeature>()?.Addresses.FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(address))
                {
                    // Emit the bound address verbatim — ASPNETCORE_URLS is always set to
                    // "http://127.0.0.1:0" so the address is already an IPv4 loopback URL.
                    // Normalising to "localhost" is avoided because on Windows it can resolve
                    // to ::1 (IPv6), causing Tauri's WebView to connect to the wrong interface.
                    Console.WriteLine($"TASKFLOW_BACKEND_READY:{address}");
                    Console.Out.Flush();
                }
            });

            using (var scope = app.ApplicationServices.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                try
                {
                    // P1.3: Only run migrations when there are actually pending migrations.
                    // GetPendingMigrations() does a lightweight schema-version check against
                    // __EFMigrationsHistory. Skipping Migrate() when the DB is current removes
                    // ~100–300ms from the critical path on every launch after initial setup.
                    var pendingMigrations = db.Database.GetPendingMigrations().ToList();
                    if (pendingMigrations.Any())
                    {
                        Log.Information("Running {Count} pending migration(s): {Names}",
                            pendingMigrations.Count, string.Join(", ", pendingMigrations));
                        db.Database.Migrate();
                    }
                    else
                    {
                        Log.Debug("Database schema is current — migration skipped");
                    }
                    Console.WriteLine("TASKFLOW_DB_READY");
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"TASKFLOW_DB_ERROR:{ex.Message}");
                    try
                    {
                        db.Database.EnsureCreated();
                    }
                    catch (Exception ensureEx)
                    {
                        // S-08: log rather than silently swallow.
                        Log.Error(ensureEx, "Database EnsureCreated fallback also failed.");
                    }
                }
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseWhen(x => !x.Request.Path.Value!.StartsWith("/api"), builder =>
                {
                    builder.UseExceptionHandler("/Home/Error");
                });
            }

            // ── Global Exception Handling ─────────────────────────────────
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            // ── Swagger (Development-only) ─────────────────────────────────
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskFlow API v1");
                    options.RoutePrefix = "swagger";
                });
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseResponseCompression();

            app.UseRouting();

            // ── CORS ─────────────────────────────────────────────────────────
            app.UseCors("AllowConfigured");

            // S-09: Rate limiter must sit after routing so endpoint metadata is resolved.
            app.UseRateLimiter();

            // ── Default user identity (replaces JWT auth) ────────────────────
            app.Use(async (context, next) =>
            {
                if (context.User.Identity?.IsAuthenticated != true)
                {
                    var userId = "1";
                    try
                    {
                        var userRepo = context.RequestServices.GetRequiredService<taskflow.Repositories.Interfaces.IUserRepository>();
                        var firstUser = (await userRepo.GetAllAsync()).FirstOrDefault();
                        if (firstUser != null)
                            userId = firstUser.Id.ToString();
                    }
                    catch { /* use default */ }
                    var claims = new[]
                    {
                        new System.Security.Claims.Claim(
                            System.Security.Claims.ClaimTypes.NameIdentifier, userId),
                        new System.Security.Claims.Claim(
                            System.Security.Claims.ClaimTypes.Email, "user@local"),
                        new System.Security.Claims.Claim(
                            System.Security.Claims.ClaimTypes.Name, "Local User"),
                    };
                    var identity = new System.Security.Claims.ClaimsIdentity(claims, "local");
                    context.User = new System.Security.Claims.ClaimsPrincipal(identity);
                }
                await next();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}/{status?}");

                endpoints.MapHub<taskflow.Hubs.NotificationHub>("/hubs/notifications");
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
