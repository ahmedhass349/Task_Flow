using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.IO.Compression;
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

            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.Console()
              .WriteTo.File("App_Data/Logs/log-.txt",
                  rollingInterval: RollingInterval.Day,
                  fileSizeLimitBytes: 536870912,
                  retainedFileCountLimit: 7)
              .CreateLogger();
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
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // ── AutoMapper ───────────────────────────────────────────────────
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            // ── JWT Authentication ───────────────────────────────────────────
            var jwtKey = Configuration["Jwt:Key"]!;
            var jwtIssuer = Configuration["Jwt:Issuer"]!;
            var jwtAudience = Configuration["Jwt:Audience"]!;

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });

            services.AddAuthorization();

            // ── CORS ─────────────────────────────────────────────────────────
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            // ── Controllers + JSON ───────────────────────────────────────────
            services.AddControllersWithViews()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // ── FluentValidation ─────────────────────────────────────────────
            services.AddFluentValidationAutoValidation();
            services.AddFluentValidationClientsideAdapters();
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // ── Swagger ──────────────────────────────────────────────────────
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
            });

            // ── Repositories (DI) ────────────────────────────────────────────
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IChatbotRepository, ChatbotRepository>();
            services.AddScoped<ITaskCommentRepository, TaskCommentRepository>();

            // ── Services (DI) ────────────────────────────────────────────────
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITaskService, TaskService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<ICalendarService, CalendarService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<ISettingsService, SettingsService>();
            services.AddScoped<IChatbotService, ChatbotService>();
            services.AddScoped<ITaskCommentService, TaskCommentService>();

            // ── Helpers (DI) ─────────────────────────────────────────────────
            services.AddScoped<JwtHelper>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IHostApplicationLifetime appLifetime)
        {
            loggerFactory.AddSerilog();

            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

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

            // ── Swagger (available in all environments) ──────────────────────
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskFlow API v1");
                options.RoutePrefix = "swagger";
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseResponseCompression();

            app.UseRouting();

            // ── CORS ─────────────────────────────────────────────────────────
            app.UseCors("AllowAll");

            // ── Auth middleware (order matters: after routing, before endpoints)
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}/{status?}");

                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
