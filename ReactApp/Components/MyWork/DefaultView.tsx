// ── DefaultView: grouped task list ──────────────────────────────────────
//
// Renders tasks grouped by due-date buckets (Overdue, Today, This Week,
// Later, Completed) using the TaskItem component.

import { CheckSquare, Clock, AlertCircle, CircleEllipsis, Star } from "lucide-react";
import TaskItem from "../TaskItem";
import type { MyWorkTask } from "./types";

interface GroupedTasks {
  overdue: MyWorkTask[];
  today: MyWorkTask[];
  thisWeek: MyWorkTask[];
  later: MyWorkTask[];
  completed: MyWorkTask[];
}

interface DefaultViewProps {
  visibleTasks: MyWorkTask[];
  grouped: GroupedTasks;
  activeTab: string;
}

function TaskGroup({
  title,
  icon,
  tasks,
  tone = "neutral",
}: {
  title: string;
  icon: React.ReactNode;
  tasks: MyWorkTask[];
  tone?: "neutral" | "warning" | "danger";
}) {
  if (!tasks.length) return null;

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
          {tasks.length} task{tasks.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-4 space-y-1">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 rounded-lg border border-transparent hover:border-gray-100">
            <div className="flex-1 min-w-0">
              <TaskItem
                title={task.title}
                notes={task.notes}
                project={task.project}
                dueDate={task.dueDateLabel}
                assignee={task.assignee}
                priority={task.status === "completed" ? undefined : task.priority}
                status={task.status}
                completed={task.status === "completed"}
                onEdit={task.onEdit}
                onDelete={task.onDelete}
                onStatus={task.onStatus}
                showStatusSelector
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
}

export default function DefaultView({ visibleTasks, grouped, activeTab }: DefaultViewProps) {
  if (visibleTasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <CircleEllipsis className="size-7 text-gray-400 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 mt-3">No tasks match your filters</h3>
        <p className="text-sm text-gray-500 mt-1">Try changing the search text or priority filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {activeTab !== "completed" && (
        <>
          <TaskGroup title="Overdue" icon={<AlertCircle className="size-5 text-red-600" />} tasks={grouped.overdue} tone="danger" />
          <TaskGroup title="Today" icon={<Clock className="size-5 text-amber-600" />} tasks={grouped.today} tone="warning" />
          <TaskGroup title="This Week" icon={<CheckSquare className="size-5 text-blue-600" />} tasks={grouped.thisWeek} />
          <TaskGroup title="Later" icon={<Clock className="size-5 text-gray-500" />} tasks={grouped.later} />
        </>
      )}
      <TaskGroup title="Completed" icon={<CheckSquare className="size-5 text-green-600" />} tasks={grouped.completed} />
    </div>
  );
}
