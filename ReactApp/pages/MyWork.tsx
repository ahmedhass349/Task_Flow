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
import AcademicTaskCard, { type TaskPayload } from "../Components/AcademicTaskCard";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";
import { useTasks } from "../hooks/useTasks";

import type { MyWorkTask, Priority, Status } from "../Components/MyWork/types";
import DefaultView from "../Components/MyWork/DefaultView";
import KanbanView from "../Components/MyWork/KanbanView";
import TableView from "../Components/MyWork/TableView";
import GanttView from "../Components/MyWork/GanttView";
import CalendarView from "../Components/MyWork/CalendarView";

type Tab = "assigned" | "today" | "upcoming" | "completed";
type ViewMode = "default" | "kanban" | "table" | "gantt" | "calendar";

export default function MyWork() {
  const { tasks, isLoading, error, refetch, createTask, updateStatus, updateTask, deleteTask } = useTasks();
  
  const [activeTab, setActiveTab] = useState<Tab>("assigned");
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Convert backend tasks to MyWorkTask format
  const convertedTasks: MyWorkTask[] = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
    project: task.projectName || "Unknown Project",
    notes: task.description || "",
      assignee: task.assigneeName || "Unassigned",
      dueDateLabel: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date",
      dueOrder: task.dueDate ? getDueOrder(new Date(task.dueDate)) : 999,
      dueDay: task.dueDate ? new Date(task.dueDate).getDate() : 0,
      priority: mapPriority(task.priority),
      status: mapStatus(task.status),
      starred: task.isStarred,
        onEdit: () => {
        setEditingTask({
          id: task.id,
          title: task.title,
          project: task.projectName || "Unknown Project",
          notes: task.description || "",
          // AcademicTaskCard expects some additional fields for initialData
          taskType: "Grading",
          customType: "",
          course: "",
          dueDateLabel: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date",
          dueDate: task.dueDate || null,
          semester: "Spring 2025",
          priority: mapPriority(task.priority),
          reminderMap: {},
          notifyVia: { email: false, inApp: false },
          assignee: task.assigneeName || "Unassigned",
          dueOrder: task.dueDate ? getDueOrder(new Date(task.dueDate)) : 999,
          status: mapStatus(task.status),
          starred: task.isStarred
        });
        setShowNewTaskCard(true);
      },
      onDelete: async () => {
        if (confirm("Are you sure you want to delete this task?")) {
          await deleteTask(task.id);
          refetch();
        }
      },
      onStatus: async (newStatus: Status) => {
        const backendStatus =
          newStatus === "todo" ? "Todo" :
          newStatus === "inProgress" ? "InProgress" :
          newStatus === "review" ? "Review" : "Completed";
        await updateStatus(task.id, backendStatus);
        refetch();
      }
    }));
  }, [tasks, deleteTask, updateStatus, refetch]);

  // Helper functions
  function getDueOrder(dueDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 0; // Overdue
    if (diffDays === 0) return 1; // Today
    if (diffDays <= 7) return 2; // This week
    return 3; // Later
  }

  function mapPriority(priority: string): Priority {
    switch (priority.toLowerCase()) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "medium";
    }
  }

  function mapStatus(status: string): Status {
    switch (status.toLowerCase()) {
      case "todo": return "todo";
      case "inprogress": return "inProgress";
      case "review": return "review";
      case "completed": return "completed";
      default: return "todo";
    }
  }

  const handleRetry = () => {
    refetch();
  };

  const handleCreateTask = async (data: TaskPayload) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: data.title,
          description: data.notes || `${data.taskType} - ${data.course}`,
          priority: data.priority.charAt(0).toUpperCase() + data.priority.slice(1) as "Low" | "Medium" | "High",
          status: editingTask.status === "todo" ? "Todo" : editingTask.status === "inProgress" ? "InProgress" : editingTask.status === "review" ? "Review" : "Completed",
          dueDate: data.dueDate || undefined,
        });
      } else {
        await createTask({
          title: data.title,
          description: data.notes || `${data.taskType} - ${data.course}`,
          priority: data.priority.charAt(0).toUpperCase() + data.priority.slice(1) as "Low" | "Medium" | "High",
          status: "Todo",
          dueDate: data.dueDate || undefined,
          reminderMap: data.reminderEnabled ? data.reminderMap : undefined,
          notifyEmail: data.notifyVia.email,
          notifyInApp: data.notifyVia.inApp,
        });
      }
      setShowNewTaskCard(false);
      setEditingTask(null);
      refetch();
    } catch (err) {
      // Error is handled by the hook
    }
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
        return convertedTasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed");
      case "upcoming":
        return convertedTasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed");
      case "completed":
        return convertedTasks.filter((t) => t.status === "completed");
      default:
        return convertedTasks;
    }
  }, [activeTab, convertedTasks]);

  const visibleTasks = useMemo(() => {
    return tabFilteredTasks.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(q) ||
        (t.project || "").toLowerCase().includes(q) ||
        (t.notes || "").toLowerCase().includes(q);
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
    { key: "assigned",  label: "Assigned to me", count: convertedTasks.length },
    { key: "today",     label: "Today",          count: convertedTasks.filter((t) => t.dueOrder <= 1 && t.status !== "completed").length },
    { key: "upcoming",  label: "Upcoming",       count: convertedTasks.filter((t) => t.dueOrder >= 2 && t.status !== "completed").length },
    { key: "completed", label: "Completed",      count: convertedTasks.filter((t) => t.status === "completed").length },
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
        return <GanttView visibleTasks={visibleTasks} />;
      case "calendar":
        return <CalendarView visibleTasks={visibleTasks} updateTask={updateTask} refetch={refetch} />;
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
                  onClick={() => { setEditingTask(null); setShowNewTaskCard(true); }}
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
                action={{ label: "New Task", onClick: () => { setEditingTask(null); setShowNewTaskCard(true); } }}
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
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AcademicTaskCard
              initialData={editingTask}
              onClose={() => { setShowNewTaskCard(false); setEditingTask(null); }}
              onSuccess={handleCreateTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}
