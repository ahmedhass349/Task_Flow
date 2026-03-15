// ── MyWork page: orchestrator ────────────────────────────────────────────
//
// Main "My Tasks" page. Manages state, tabs, filters, and delegates
// rendering to extracted view components:
//   - DefaultView  — grouped task list
//   - KanbanView   — status-column board
//   - TableView    — spreadsheet with sub-tasks
//   - GanttView    — timeline chart
//   - CalendarView — weekly time-grid
//
// Reduced from ~1823 lines to ~350 by extracting views into
// ReactApp/Components/MyWork/*.tsx

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ClipboardList } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import NewTaskCard, { type NewTaskData } from "../Components/NewTaskCard";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";

import type { MyWorkTask, Priority, Status } from "../Components/MyWork/types";
import DefaultView from "../Components/MyWork/DefaultView";
import KanbanView from "../Components/MyWork/KanbanView";
import TableView from "../Components/MyWork/TableView";
import GanttView from "../Components/MyWork/GanttView";
import CalendarView from "../Components/MyWork/CalendarView";

type Tab = "assigned" | "today" | "upcoming" | "completed";
type ViewMode = "default" | "kanban" | "table" | "gantt" | "calendar";

// ── Seed data (will be replaced by API call) ─────────────────────────────

const SEED_TASKS: MyWorkTask[] = [
  {
    id: "t-001",
    title: "Finalize onboarding empty states",
    project: "Marketing Site",
    assignee: "You",
    dueDateLabel: "Overdue \u00B7 Mar 10",
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
    dueDateLabel: "Overdue \u00B7 Mar 11",
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
    dueDateLabel: "Completed \u00B7 Mar 13",
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
    dueDateLabel: "Completed \u00B7 Mar 12",
    dueOrder: 4,
    dueDay: 12,
    priority: "high",
    status: "completed",
  },
];

// ── Component ────────────────────────────────────────────────────────────

export default function MyWork() {
  const [tasks, setTasks] = useState<MyWorkTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("assigned");
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (!cancelled) {
        setTasks(SEED_TASKS);
        setIsLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setTasks(SEED_TASKS);
      setIsLoading(false);
    }, 0);
  };

  // Lock body scroll when new-task modal is open
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

  // ── Derived data ────────────────────────────────────────────────────────

  const tabFilteredTasks = useMemo(() => {
    switch (activeTab) {
      case "today":
        return tasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed");
      case "upcoming":
        return tasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed");
      case "completed":
        return tasks.filter((t) => t.status === "completed");
      default:
        return tasks;
    }
  }, [activeTab, tasks]);

  const visibleTasks = useMemo(() => {
    return tabFilteredTasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tabFilteredTasks, searchQuery, priorityFilter]);

  const grouped = useMemo(() => {
    const base = {
      overdue: [] as MyWorkTask[],
      today: [] as MyWorkTask[],
      thisWeek: [] as MyWorkTask[],
      later: [] as MyWorkTask[],
      completed: [] as MyWorkTask[],
    };

    visibleTasks.forEach((t) => {
      if (t.status === "completed") { base.completed.push(t); return; }
      if (t.dueOrder === 0)      base.overdue.push(t);
      else if (t.dueOrder === 1) base.today.push(t);
      else if (t.dueOrder === 2) base.thisWeek.push(t);
      else                       base.later.push(t);
    });

    return base;
  }, [visibleTasks]);

  const allOpen = visibleTasks.filter((t) => t.status !== "completed").length;
  const highPriority = visibleTasks.filter((t) => t.priority === "high" && t.status !== "completed").length;
  const inReview = visibleTasks.filter((t) => t.status === "review").length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "assigned",  label: "Assigned to me", count: tasks.length },
    { key: "today",     label: "Today",          count: tasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed").length },
    { key: "upcoming",  label: "Upcoming",       count: tasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed").length },
    { key: "completed", label: "Completed",      count: tasks.filter((t) => t.status === "completed").length },
  ];

  const views: { key: ViewMode; label: string }[] = [
    { key: "default",  label: "Default" },
    { key: "kanban",   label: "Kanban" },
    { key: "table",    label: "Table" },
    { key: "gantt",    label: "Gantt" },
    { key: "calendar", label: "Calendar" },
  ];

  // ── View dispatcher ─────────────────────────────────────────────────────

  const renderView = () => {
    switch (viewMode) {
      case "kanban":
        return <KanbanView visibleTasks={visibleTasks} />;
      case "table":
        return <TableView visibleTasks={visibleTasks} />;
      case "gantt":
        return <GanttView />;
      case "calendar":
        return <CalendarView visibleTasks={visibleTasks} />;
      default:
        return <DefaultView visibleTasks={visibleTasks} grouped={grouped} activeTab={activeTab} />;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Page header */}
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

            {/* Loading / Error / Empty */}
            {isLoading && <PageLoading message="Loading your tasks..." />}
            {error && <PageError message={error} onRetry={handleRetry} />}
            {!isLoading && !error && tasks.length === 0 && (
              <PageEmpty
                icon={ClipboardList}
                title="No tasks assigned"
                description="You have no tasks right now. Create a new task or ask your team lead to assign work."
                action={{ label: "New Task", onClick: () => setShowNewTaskCard(true) }}
              />
            )}

            {!isLoading && !error && tasks.length > 0 && (
              <>
                {/* Summary cards */}
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

                {/* Tabs */}
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

                {/* View switcher */}
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

                {/* Search + priority filter */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-md">
                    <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks or projects"
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {(["all", "high", "medium", "low"] as const).map((p) => {
                      const active = priorityFilter === p;
                      const colorMap: Record<string, string> = {
                        all:    active ? "bg-blue-600 text-white border-blue-600"   : "",
                        high:   active ? "bg-red-600 text-white border-red-600"     : "",
                        medium: active ? "bg-amber-600 text-white border-amber-600" : "",
                        low:    active ? "bg-sky-600 text-white border-sky-600"     : "",
                      };
                      return (
                        <button
                          key={p}
                          onClick={() => setPriorityFilter(p)}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            active
                              ? colorMap[p]
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      );
                    })}

                    <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50" aria-label="More filters">
                      <SlidersHorizontal className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Active view */}
                {renderView()}
              </>
            )}
          </div>
          <Footer />
        </main>
      </div>

      {/* New Task Modal */}
      {showNewTaskCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create new task"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/30 backdrop-blur-sm px-4"
          onClick={() => setShowNewTaskCard(false)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NewTaskCard
              onCancel={() => setShowNewTaskCard(false)}
              onCreate={(_data: NewTaskData) => {
                // TODO: Send _data to API when backend endpoint is ready
                setShowNewTaskCard(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
