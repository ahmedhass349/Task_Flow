# Connect TaskFlow to LocalDB via Entity Framework Core 8

The app currently has no database layer. This plan adds EF Core 8 (SQL Server provider), creates entity models that match the app's pages, registers the `DbContext`, stores the connection string in `appsettings.json`, and runs a migration to create the schema.

## Proposed Changes

---

### NuGet Packages

#### [MODIFY] [TaskFlow.csproj](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/TaskFlow.csproj)

Add three new package references:
- `Microsoft.EntityFrameworkCore.SqlServer` v8.0.0
- `Microsoft.EntityFrameworkCore.Tools` v8.0.0 (for migrations)
- `Microsoft.EntityFrameworkCore.Design` v8.0.0 (for `dotnet ef` CLI tool)

---

### Configuration

#### [NEW] [appsettings.json](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\SQTMS_DB;Initial Catalog=Task_Flow;Integrated Security=True;Pooling=False;Connect Timeout=30;Encrypt=True;Trust Server Certificate=True"
  },
  "Logging": { ... }
}
```

#### [NEW] [appsettings.Development.json](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/appsettings.Development.json)

Inherits from above, can override for dev (logging level, etc.)

---

### Data Layer

#### [NEW] `Data/Entities/` — Entity Models

| Entity | Key Fields |
|--------|-----------|
| `AppUser` | Id, FullName, Email, PasswordHash, AvatarUrl, CreatedAt |
| `Project` | Id, Name, Description, OwnerId, Color, CreatedAt |
| `ProjectMember` | ProjectId, UserId, Role |
| `TaskItem` | Id, Title, Description, ProjectId, AssigneeId, Priority, Status, DueDate, CreatedAt |
| `TaskComment` | Id, TaskId, AuthorId, Body, CreatedAt |
| `Team` | Id, Name, Description, OwnerId |
| `TeamMember` | TeamId, UserId, Role |
| `Message` | Id, SenderId, ReceiverId, Body, SentAt, IsRead |
| `Notification` | Id, UserId, Title, Body, IsRead, CreatedAt |
| `CalendarEvent` | Id, OwnerId, Title, StartAt, EndAt, Color |

#### [NEW] `Data/AppDbContext.cs`

Single `DbContext` with all `DbSet<>` properties, `OnModelCreating` for:
- Composite keys (ProjectMember, TeamMember)
- FK relationships and cascade behaviour
- Enum → `nvarchar` conversion for [Priority](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/ReactApp/pages/MyWork.tsx#9-10) / [Status](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/ReactApp/pages/MyWork.tsx#10-11)

---

### DI Registration

#### [MODIFY] [Startup.cs](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/Startup.cs)

In [ConfigureServices](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/Startup.cs#33-46), add:
```csharp
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
```

---

## Verification Plan

### Automated (Build)
```powershell
# From the project root:
dotnet build
```
> ✅ Must compile with 0 errors.

### Migration & Schema Creation
```powershell
# Install the EF CLI tool globally (one-time):
dotnet tool install --global dotnet-ef

# Create the initial migration:
dotnet ef migrations add InitialCreate

# Apply it to the LocalDB:
dotnet ef database update
```
> ✅ The `Task_Flow` database must appear in LocalDB with all tables.

### Manual Verification (SQL Server Object Explorer in VS Code / SSMS)
1. Open **SQL Server Object Explorer** (or run `sqllocaldb info SQTMS_DB` in a terminal to confirm the instance is running).
2. Connect to [(localdb)\SQTMS_DB](file:///c:/Users/Ahmed%20Abdelbarr/OneDrive/Documents/GitHub/Ahmed-Abdelbarr/ASP%20.NET%20Core/Task_Flow/ReactApp/pages/MyWork.tsx#11-12) → Database `Task_Flow`.
3. Expand **Tables** — you should see: `AppUsers`, `Projects`, `ProjectMembers`, `TaskItems`, `TaskComments`, `Teams`, `TeamMembers`, `Messages`, `Notifications`, `CalendarEvents`, `__EFMigrationsHistory`.
