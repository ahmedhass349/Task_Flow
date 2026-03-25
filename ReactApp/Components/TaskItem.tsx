import { Circle, CheckCircle2, Clock, User, Edit2, Trash2 } from "lucide-react";

interface TaskItemProps {
  title: string;
  project?: string;
  notes?: string;
  dueDate?: string;
  assignee?: string;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatus?: (s: string) => void;
}

export default function TaskItem({ title, project, notes, dueDate, assignee, priority, completed, onEdit, onDelete, onStatus }: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-orange-100 text-orange-700 border-orange-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <button 
        className="mt-0.5" 
        onClick={() => onStatus && onStatus(completed ? "todo" : "completed")}
        aria-label={completed ? "Mark task as incomplete" : "Mark task as complete"}
      >
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
          {notes ? (
            <span className="text-gray-600 truncate">{notes}</span>
          ) : (
            project && <span className="text-blue-600">{project}</span>
          )}
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

      <div className="flex items-center gap-2">
        {priority && (
          <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[priority]}`}>
            {priority}
          </span>
        )}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity ml-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              aria-label="Edit task"
            >
              <Edit2 className="size-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
