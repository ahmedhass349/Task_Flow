import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Clock, AlertCircle, Search, SlidersHorizontal, Star, CircleEllipsis } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import TaskItem from "../Components/TaskItem";
import NewTaskCard from "../Components/NewTaskCard";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "inProgress" | "review" | "completed";
type Tab = "assigned" | "today" | "upcoming" | "completed";
type ViewMode = "default" | "kanban" | "table" | "gantt" | "calendar";

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDateLabel: string;
  dueOrder: number;
  dueDay?: number;
  priority: Priority;
  status: Status;
  starred?: boolean;
}

export default function MyWork() {
  const [activeTab, setActiveTab] = useState<Tab>("assigned");
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);

  useEffect(() => {
    if (!showNewTaskCard) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showNewTaskCard]);

  const tasks: Task[] = [
    {
      id: "t-001",
      title: "Finalize onboarding empty states",
      project: "Marketing Site",
      assignee: "You",
      dueDateLabel: "Overdue · Mar 10",
      dueOrder: 0,
      dueDay: 10,
      priority: "high",
      status: "inProgress",
      starred: true,
    },
    {
      id: "t-002",
      title: "Fix webhook retry edge-case",
      project: "API Service",
      assignee: "You",
      dueDateLabel: "Overdue · Mar 11",
      dueOrder: 0,
      dueDay: 11,
      priority: "high",
      status: "review",
    },
    {
      id: "t-003",
      title: "Prepare sprint retro notes",
      project: "Team Ops",
      assignee: "You",
      dueDateLabel: "Today",
      dueOrder: 1,
      dueDay: 14,
      priority: "medium",
      status: "todo",
    },
    {
      id: "t-004",
      title: "Review auth PR #184",
      project: "User Service",
      assignee: "You",
      dueDateLabel: "Today",
      dueOrder: 1,
      dueDay: 14,
      priority: "high",
      status: "review",
      starred: true,
    },
    {
      id: "t-005",
      title: "Define task timeline animation",
      project: "Mobile App",
      assignee: "You",
      dueDateLabel: "Mar 16",
      dueOrder: 2,
      dueDay: 16,
      priority: "low",
      status: "inProgress",
    },
    {
      id: "t-006",
      title: "Clean up stale feature flags",
      project: "Admin Panel",
      assignee: "You",
      dueDateLabel: "Mar 17",
      dueOrder: 2,
      dueDay: 17,
      priority: "medium",
      status: "todo",
    },
    {
      id: "t-007",
      title: "Write release changelog",
      project: "Developer Portal",
      assignee: "You",
      dueDateLabel: "Mar 19",
      dueOrder: 3,
      dueDay: 19,
      priority: "low",
      status: "todo",
    },
    {
      id: "t-008",
      title: "QA pass for notifications drawer",
      project: "TaskFlow Web",
      assignee: "You",
      dueDateLabel: "Mar 20",
      dueOrder: 3,
      dueDay: 20,
      priority: "medium",
      status: "inProgress",
    },
    {
      id: "t-009",
      title: "Refactor dashboard card styles",
      project: "Design System",
      assignee: "You",
      dueDateLabel: "Completed · Mar 13",
      dueOrder: 4,
      dueDay: 13,
      priority: "medium",
      status: "completed",
    },
    {
      id: "t-010",
      title: "Patch timezone parsing bug",
      project: "Calendar",
      assignee: "You",
      dueDateLabel: "Completed · Mar 12",
      dueOrder: 4,
      dueDay: 12,
      priority: "high",
      status: "completed",
    },
  ];

  const tabFilteredTasks = useMemo(() => {
    switch (activeTab) {
      case "today":
        return tasks.filter((task) => task.dueOrder <= 1 && task.status !== "completed");
      case "upcoming":
        return tasks.filter((task) => task.dueOrder >= 2 && task.status !== "completed");
      case "completed":
        return tasks.filter((task) => task.status === "completed");
      default:
        return tasks;
    }
  }, [activeTab, tasks]);

  const visibleTasks = useMemo(() => {
    return tabFilteredTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tabFilteredTasks, searchQuery, priorityFilter]);

  const grouped = useMemo(() => {
    const base = {
      overdue: [] as Task[],
      today: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
      completed: [] as Task[],
    };

    visibleTasks.forEach((task) => {
      if (task.status === "completed") {
        base.completed.push(task);
        return;
      }

      if (task.dueOrder === 0) {
        base.overdue.push(task);
      } else if (task.dueOrder === 1) {
        base.today.push(task);
      } else if (task.dueOrder === 2) {
        base.thisWeek.push(task);
      } else {
        base.later.push(task);
      }
    });

    return base;
  }, [visibleTasks]);

  const allOpen = visibleTasks.filter((task) => task.status !== "completed").length;
  const highPriority = visibleTasks.filter((task) => task.priority === "high" && task.status !== "completed").length;
  const inReview = visibleTasks.filter((task) => task.status === "review").length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "assigned", label: "Assigned to me", count: tasks.length },
    { key: "today", label: "Today", count: tasks.filter((task) => task.dueOrder <= 1 && task.status !== "completed").length },
    { key: "upcoming", label: "Upcoming", count: tasks.filter((task) => task.dueOrder >= 2 && task.status !== "completed").length },
    { key: "completed", label: "Completed", count: tasks.filter((task) => task.status === "completed").length },
  ];

  const views: { key: ViewMode; label: string }[] = [
    { key: "default", label: "Default" },
    { key: "kanban", label: "Kanban" },
    { key: "table", label: "Table" },
    { key: "gantt", label: "Gantt" },
    { key: "calendar", label: "Calendar" },
  ];

  const priorityTone = (priority: Priority) => {
    if (priority === "high") return "bg-red-100 text-red-700 border-red-200";
    if (priority === "medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-sky-100 text-sky-700 border-sky-200";
  };

  const statusTone = (status: Status) => {
    if (status === "todo") return "bg-slate-100 text-slate-700";
    if (status === "inProgress") return "bg-blue-100 text-blue-700";
    if (status === "review") return "bg-violet-100 text-violet-700";
    return "bg-green-100 text-green-700";
  };

  const renderTaskGroup = (title: string, icon: React.ReactNode, groupTasks: Task[], tone: "neutral" | "warning" | "danger" = "neutral") => {
    if (!groupTasks.length) {
      return null;
    }

    const headerTone =
      tone === "danger"
        ? "bg-red-50 border-red-200 text-red-900"
        : tone === "warning"
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-white border-gray-200 text-gray-900";

    return (
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className={`border-b px-6 py-4 flex items-center justify-between ${headerTone}`}>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">{title}</h2>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/80 border border-gray-200">
            {groupTasks.length} task{groupTasks.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4 space-y-1">
          {groupTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-lg border border-transparent hover:border-gray-100">
              <div className="flex-1 min-w-0">
                <TaskItem
                  title={task.title}
                  project={task.project}
                  dueDate={task.dueDateLabel}
                  assignee={task.assignee}
                  priority={task.status === "completed" ? undefined : task.priority}
                  completed={task.status === "completed"}
                />
              </div>

              <button
                aria-label={task.starred ? "Unstar task" : "Star task"}
                className="mr-4 p-1.5 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Star className={`size-4 ${task.starred ? "fill-yellow-400 text-yellow-500" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderView = () => {
    if (visibleTasks.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <CircleEllipsis className="size-7 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 mt-3">No tasks match your filters</h3>
          <p className="text-sm text-gray-500 mt-1">Try changing the search text or priority filter.</p>
        </div>
      );
    }

    if (viewMode === "default") {
      return (
        <div className="space-y-5">
          {activeTab !== "completed" && (
            <>
              {renderTaskGroup("Overdue", <AlertCircle className="size-5 text-red-600" />, grouped.overdue, "danger")}
              {renderTaskGroup("Today", <Clock className="size-5 text-amber-600" />, grouped.today, "warning")}
              {renderTaskGroup("This Week", <CheckSquare className="size-5 text-blue-600" />, grouped.thisWeek)}
              {renderTaskGroup("Later", <Clock className="size-5 text-gray-500" />, grouped.later)}
            </>
          )}

          {renderTaskGroup("Completed", <CheckSquare className="size-5 text-green-600" />, grouped.completed)}
        </div>
      );
    }

    if (viewMode === "kanban") {
      const columns = [
        { key: "todo" as Status, title: "To Do" },
        { key: "inProgress" as Status, title: "In Progress" },
        { key: "review" as Status, title: "In Review" },
        { key: "completed" as Status, title: "Completed" },
      ];

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = visibleTasks.filter((task) => task.status === column.key);
            return (
              <section key={column.key} className="bg-white border border-gray-200 rounded-xl p-3 space-y-3">
                <header className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-gray-900">{column.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{columnTasks.length}</span>
                </header>

                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <article key={task.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.project}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded border ${priorityTone(task.priority)}`}>{task.priority}</span>
                        <span className="text-xs text-gray-500">{task.dueDateLabel}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      );
    }

    if (viewMode === "table") {
      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Assignee</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{task.title}</td>
                    <td className="px-4 py-3 text-gray-600">{task.project}</td>
                    <td className="px-4 py-3 text-gray-600">{task.assignee}</td>
                    <td className="px-4 py-3 text-gray-600">{task.dueDateLabel}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${priorityTone(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusTone(task.status)}`}>
                        {task.status === "inProgress" ? "In Progress" : task.status === "todo" ? "To Do" : task.status === "review" ? "Review" : "Completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (viewMode === "gantt") {
      const timeAxis = ["W1", "W2", "W3", "W4", "W5"];

      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[minmax(220px,1fr)_2fr] border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">
            <div className="px-4 py-3">Task</div>
            <div className="px-4 py-3 grid grid-cols-5 gap-2">
              {timeAxis.map((slot) => (
                <span key={slot}>{slot}</span>
              ))}
            </div>
          </div>

          <div>
            {visibleTasks.map((task) => {
              const start = Math.min(Math.max(task.dueOrder, 0), 4);
              const width = task.status === "completed" ? 1 : task.priority === "high" ? 2 : 1;
              return (
                <div key={task.id} className="grid grid-cols-[minmax(220px,1fr)_2fr] border-b border-gray-100 last:border-0">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.project}</p>
                  </div>
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-5 gap-2 h-full items-center">
                      {timeAxis.map((_, index) => {
                        const active = index >= start && index < start + width;
                        return (
                          <div
                            key={`${task.id}-${index}`}
                            className={`h-7 rounded ${active ? "bg-blue-500/80" : "bg-gray-100"}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ─── Calendar view data ───────────────────────────────────────────────────
    const today = 14; // "today" in our demo = March 14

    // Mini-calendar: task dots per day (March 2026)
    const taskDotsByDay = visibleTasks.reduce<Record<number, string[]>>((acc, task) => {
      if (!task.dueDay) return acc;
      if (!acc[task.dueDay]) acc[task.dueDay] = [];
      const color =
        task.priority === "high"
          ? "#EF4444"
          : task.priority === "medium"
            ? "#A855F7"
            : "#2DD4BF";
      acc[task.dueDay].push(color);
      return acc;
    }, {});

    // Week: Sun Mar 9 → Sat Mar 15 (week containing "today" = 14)
    const weekDays = [
      { label: "SUN", day: 9 },
      { label: "MON", day: 10 },
      { label: "TUE", day: 11 },
      { label: "WED", day: 12 },
      { label: "THU", day: 13 },
      { label: "FRI", day: 14 }, // today
      { label: "SAT", day: 15 },
    ];

    // Events mapped to the week grid (column index 0-6, startHour 7-17)
    interface CalEvent {
      col: number;
      startHour: number;
      durationHours: number;
      title: string;
      color: "blue" | "violet" | "amber";
      hasLink?: boolean;
    }

    const calEvents: CalEvent[] = [
      { col: 1, startHour: 8, durationHours: 1, title: "Monthly catch-up", color: "blue", hasLink: true },
      { col: 1, startHour: 9, durationHours: 1, title: "Quarterly review", color: "blue", hasLink: true },
      { col: 1, startHour: 10, durationHours: 1.5, title: "🍔 New Employee Welcome Lunch!", color: "violet" },
      { col: 2, startHour: 9, durationHours: 1, title: "City Sales Pitch", color: "blue" },
      { col: 3, startHour: 10, durationHours: 1, title: "Design Review", color: "blue", hasLink: true },
      { col: 4, startHour: 8, durationHours: 1, title: "Follow up proposal", color: "amber", hasLink: true },
      { col: 4, startHour: 11, durationHours: 1, title: "Visit to discuss improvements", color: "blue" },
      { col: 5, startHour: 9, durationHours: 1, title: "Presentation of new products", color: "blue" },
      { col: 5, startHour: 13, durationHours: 1, title: "Design Review", color: "blue", hasLink: true },
      { col: 6, startHour: 10, durationHours: 1, title: "1:1 with Jon", color: "amber", hasLink: true },
    ];

    const colorClasses = {
      blue: {
        bg: "bg-sky-50",
        bar: "bg-sky-400",
        text: "text-sky-700",
        time: "text-sky-600",
      },
      violet: {
        bg: "bg-violet-50",
        bar: "bg-violet-500",
        text: "text-violet-700",
        time: "text-violet-600",
      },
      amber: {
        bg: "bg-amber-50",
        bar: "bg-amber-400",
        text: "text-amber-700",
        time: "text-amber-600",
      },
    };

    // Hour rows 7 AM → 5 PM (inclusive = 11 rows)
    const hourRows = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const ROW_HEIGHT = 64; // px per hour
    const START_HOUR = 7;

    // Mini-calendar helpers (March 2026 starts on Sunday)
    const miniCalDays: (number | null)[] = [
      ...Array(0).fill(null), // March starts on Sunday (offset = 0)
      ...Array.from({ length: 31 }, (_, i) => i + 1),
    ];
    // Pad to complete last week
    while (miniCalDays.length % 7 !== 0) miniCalDays.push(null);

    return (
      <div
        className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ display: "flex", minHeight: 700, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Dark left sidebar ─────────────────────────────────────────────── */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            background: "#18181B",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 16,
            overflowY: "auto",
          }}
        >
          {/* Traffic-light dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[
              { bg: "#ED6B60", border: "#D05147" },
              { bg: "#F5C250", border: "#D6A343" },
              { bg: "#62C656", border: "#52A842" },
            ].map((c, i) => (
              <span
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  display: "inline-block",
                }}
              />
            ))}
          </div>

          {/* Month + year */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, alignItems: "baseline" }}>
              <span style={{ color: "white", fontSize: 22, fontWeight: 400 }}>March</span>
              <span style={{ color: "#EF4444", fontSize: 22, fontWeight: 400 }}>2026</span>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {["‹", "›"].map((ch, i) => (
                <button
                  key={i}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: 18,
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                    opacity: 0.7,
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Mini calendar */}
          <div>
            {/* Day-of-week headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: 2,
              }}
            >
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#71717A",
                    padding: "2px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            {Array.from({ length: miniCalDays.length / 7 }, (_, week) => (
              <div
                key={week}
                style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
              >
                {miniCalDays.slice(week * 7, week * 7 + 7).map((day, cellIdx) => {
                  const dots = day ? (taskDotsByDay[day] ?? []) : [];
                  const isToday = day === today;
                  const isOtherMonth = day === null;
                  return (
                    <div
                      key={cellIdx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "2px 0",
                      }}
                    >
                      {isToday ? (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "#3B82F6",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: 10, fontWeight: 700, color: "white", lineHeight: 1 }}>
                            {day}
                          </span>
                          {dots.length > 0 && (
                            <span
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: "white",
                                marginTop: 1,
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: isOtherMonth ? "#3F3F46" : day ? "white" : "transparent",
                              lineHeight: "16px",
                            }}
                          >
                            {day ?? ""}
                          </span>
                          {dots.length > 0 && (
                            <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
                              {dots.slice(0, 3).map((dotColor, di) => (
                                <span
                                  key={di}
                                  style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    background: dotColor,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          {dots.length === 0 && (
                            <div style={{ height: 6 }} /> // spacing placeholder
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#27272A" }} />

          {/* Upcoming events list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            {/* TODAY */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6" }}>TODAY</span>
                <span style={{ fontSize: 12, color: "#3B82F6" }}>3/14/2026</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                  ☀️ 55°<span style={{ fontWeight: 400 }}>/40°</span>
                </span>
              </div>
            </div>

            {[
              { time: "8:30 AM", title: "Monthly catch-up", color: "#3B82F6", link: true },
              { time: "9:00 AM", title: "Quarterly review", color: "#3B82F6", link: true },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: ev.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 10, color: "#A1A1AA", fontWeight: 600 }}>{ev.time}</span>
                  {ev.link && (
                    <span
                      style={{
                        fontSize: 9,
                        background: "#A1A1AA",
                        borderRadius: "50%",
                        width: 12,
                        height: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#18181B",
                        fontWeight: 700,
                      }}
                    >
                      ⤴
                    </span>
                  )}
                </div>
                <div style={{ paddingLeft: 16, fontSize: 11, color: "white" }}>{ev.title}</div>
              </div>
            ))}

            {/* Upcoming day headers */}
            {[
              {
                label: "TOMORROW",
                date: "3/15/2026",
                events: [{ time: "9:00 AM", title: "City Sales Pitch", color: "#EC4899", link: true }],
              },
              {
                label: "MONDAY",
                date: "3/16/2026",
                events: [
                  { time: "10:00 AM", title: "Design Review", color: "#3B82F6", link: true },
                  { time: "2:00 PM", title: "1:1 with Jon", color: "#FBBF24", link: true },
                ],
              },
            ].map((section, si) => (
              <div key={si} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                      {section.label}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{section.date}</span>
                  </div>
                </div>
                {section.events.map((ev, ei) => (
                  <div key={ei} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: ev.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 10, color: "#A1A1AA", fontWeight: 600 }}>{ev.time}</span>
                    </div>
                    <div style={{ paddingLeft: 16, fontSize: 11, color: "white" }}>{ev.title}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main week grid ────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            background: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top toolbar */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              background: "white",
            }}
          >
            {/* Prev / Today / Next */}
            <div style={{ display: "flex", gap: 1 }}>
              {["‹", "Today", "›"].map((label, li) => (
                <button
                  key={li}
                  style={{
                    padding: label === "Today" ? "4px 12px" : "4px 8px",
                    background: "#F4F4F5",
                    border: "none",
                    borderRadius: li === 0 ? "6px 0 0 6px" : li === 2 ? "0 6px 6px 0" : 0,
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#18181B",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Day / Week / Month / Year */}
            <div style={{ display: "flex", gap: 4 }}>
              {["Day", "Week", "Month", "Year"].map((label) => (
                <button
                  key={label}
                  style={{
                    padding: "4px 14px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    background: label === "Week" ? "#DC2626" : "transparent",
                    color: label === "Week" ? "white" : "#71717A",
                    fontWeight: label === "Week" ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#F4F4F5",
                borderRadius: 6,
                padding: "4px 8px",
                minWidth: 160,
              }}
            >
              <Search className="size-3.5 text-gray-400" />
              <span style={{ fontSize: 12, color: "#A1A1AA" }}>Search</span>
            </div>
          </div>

          {/* Grid area */}
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {/* Day column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `48px repeat(7, 1fr)`,
                borderBottom: "1px solid #E5E7EB",
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 10,
              }}
            >
              {/* timezone offset cell */}
              <div
                style={{
                  padding: "6px 4px 4px",
                  textAlign: "right",
                  fontSize: 10,
                  color: "#71717A",
                  borderRight: "1px solid #E5E7EB",
                }}
              >
                <div>EST</div>
                <div>GMT-5</div>
              </div>

              {weekDays.map((wd) => {
                const isWeekToday = wd.day === today;
                return (
                  <div
                    key={wd.day}
                    style={{
                      padding: "6px 8px 4px",
                      borderLeft: "1px solid #E5E7EB",
                      background: isWeekToday ? "#EFF6FF" : wd.label === "SUN" || wd.label === "SAT" ? "#FAFAFA" : "white",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#71717A",
                        textTransform: "uppercase",
                      }}
                    >
                      {wd.label}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 400,
                        color: isWeekToday ? "#1D4ED8" : "#111827",
                        lineHeight: 1.2,
                      }}
                    >
                      {wd.day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time + column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `48px repeat(7, 1fr)`,
                position: "relative",
              }}
            >
              {/* Time labels column */}
              <div style={{ borderRight: "1px solid #E5E7EB" }}>
                {hourRows.map((hour) => (
                  <div
                    key={hour}
                    style={{
                      height: ROW_HEIGHT,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                      paddingRight: 6,
                      paddingTop: 4,
                      fontSize: 11,
                      color: "#71717A",
                      borderTop: "1px solid #E5E7EB",
                      boxSizing: "border-box",
                    }}
                  >
                    {hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((wd, colIdx) => {
                const isWeekend = wd.label === "SUN" || wd.label === "SAT";
                const isWeekToday = wd.day === today;
                const columnEvents = calEvents.filter((e) => e.col === colIdx);

                return (
                  <div
                    key={wd.day}
                    style={{
                      position: "relative",
                      borderLeft: "1px solid #E5E7EB",
                      background: isWeekToday ? "#EFF6FF" : isWeekend ? "#FAFAFA" : "white",
                    }}
                  >
                    {/* Hour-slot rows (just horizontal lines) */}
                    {hourRows.map((hour) => (
                      <div
                        key={hour}
                        style={{
                          height: ROW_HEIGHT,
                          borderTop: "1px solid #E5E7EB",
                          boxSizing: "border-box",
                        }}
                      >
                        {/* half-hour divider */}
                        <div
                          style={{
                            marginTop: ROW_HEIGHT / 2 - 1,
                            borderTop: "1px dashed #F3F4F6",
                          }}
                        />
                      </div>
                    ))}

                    {/* Event blocks absolutely positioned */}
                    {columnEvents.map((ev, ei) => {
                      const topPx = (ev.startHour - START_HOUR) * ROW_HEIGHT + 1;
                      const heightPx = ev.durationHours * ROW_HEIGHT - 4;
                      const cc = colorClasses[ev.color];
                      const startLabel =
                        ev.startHour < 12
                          ? `${ev.startHour}:00 AM`
                          : ev.startHour === 12
                            ? "12:00 PM"
                            : `${ev.startHour - 12}:00 PM`;
                      return (
                        <div
                          key={ei}
                          style={{
                            position: "absolute",
                            top: topPx,
                            left: 2,
                            right: 2,
                            height: heightPx,
                            borderRadius: 6,
                            overflow: "hidden",
                            display: "flex",
                            cursor: "pointer",
                          }}
                          className={cc.bg}
                        >
                          {/* Colored left bar */}
                          <div
                            style={{ width: 3, flexShrink: 0 }}
                            className={cc.bar}
                          />
                          <div
                            style={{
                              flex: 1,
                              padding: "4px 5px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center", gap: 3 }}
                            >
                              <span
                                style={{ fontSize: 10, fontWeight: 600 }}
                                className={cc.time}
                              >
                                {startLabel}
                              </span>
                              {ev.hasLink && (
                                <span
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 8,
                                    flexShrink: 0,
                                  }}
                                  className={`${cc.bar} text-white`}
                                >
                                  ⤴
                                </span>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                lineHeight: 1.3,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                              className={cc.text}
                            >
                              {ev.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-gray-600 mt-1">Prioritize and track everything currently on your plate</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Export
                </button>
                <button
                  onClick={() => setShowNewTaskCard(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Task
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Open Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{allOpen}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">High Priority</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{highPriority}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">In Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{inReview}</p>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-5">
                {tabs.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
                        active
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex flex-wrap gap-2">
                {views.map((view) => {
                  const active = viewMode === view.key;
                  return (
                    <button
                      key={view.key}
                      onClick={() => setViewMode(view.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        active
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {view.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tasks or projects"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPriorityFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    priorityFilter === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPriorityFilter("high")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    priorityFilter === "high"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setPriorityFilter("medium")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    priorityFilter === "medium"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setPriorityFilter("low")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    priorityFilter === "low"
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Low
                </button>

                <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50" aria-label="More filters">
                  <SlidersHorizontal className="size-4" />
                </button>
              </div>
            </div>

            {renderView()}
          </div>
          <Footer />
        </main>
      </div>

      {showNewTaskCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/30 backdrop-blur-sm px-4"
          onClick={() => setShowNewTaskCard(false)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <NewTaskCard
              onCancel={() => setShowNewTaskCard(false)}
              onCreate={() => setShowNewTaskCard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
