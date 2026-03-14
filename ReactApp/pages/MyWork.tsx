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

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDateLabel: string;
  dueOrder: number;
  priority: Priority;
  status: Status;
  starred?: boolean;
}

export default function MyWork() {
  const [activeTab, setActiveTab] = useState<Tab>("assigned");
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

            <div className="space-y-5">
              {visibleTasks.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <CircleEllipsis className="size-7 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900 mt-3">No tasks match your filters</h3>
                  <p className="text-sm text-gray-500 mt-1">Try changing the search text or priority filter.</p>
                </div>
              ) : (
                <>
                  {activeTab !== "completed" && (
                    <>
                      {renderTaskGroup("Overdue", <AlertCircle className="size-5 text-red-600" />, grouped.overdue, "danger")}
                      {renderTaskGroup("Today", <Clock className="size-5 text-amber-600" />, grouped.today, "warning")}
                      {renderTaskGroup("This Week", <CheckSquare className="size-5 text-blue-600" />, grouped.thisWeek)}
                      {renderTaskGroup("Later", <Clock className="size-5 text-gray-500" />, grouped.later)}
                    </>
                  )}

                  {renderTaskGroup("Completed", <CheckSquare className="size-5 text-green-600" />, grouped.completed)}
                </>
              )}
            </div>
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
