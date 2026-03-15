import { Circle, CheckCircle2, Clock, User } from "lucide-react";

interface TaskItemProps {
  title: string;
  project?: string;
  dueDate?: string;
  assignee?: string;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
}

export default function TaskItem({ title, project, dueDate, assignee, priority, completed }: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-orange-100 text-orange-700 border-orange-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <button className="mt-0.5" aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}>
        {completed ? (
          <CheckCircle2 className="size-5 text-green-600" aria-hidden="true" />
        ) : (
          <Circle className="size-5 text-gray-400 group-hover:text-blue-500" aria-hidden="true" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium ${completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
          {title}
        </p>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          {project && <span className="text-blue-600">{project}</span>}
          {dueDate && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              {dueDate}
            </span>
          )}
          {assignee && (
            <span className="flex items-center gap-1">
              <User className="size-3" aria-hidden="true" />
              {assignee}
            </span>
          )}
        </div>
      </div>

      {priority && (
        <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[priority]}`}>
          {priority}
        </span>
      )}
    </div>
  );
}
