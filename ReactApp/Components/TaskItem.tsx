import { Circle, CheckCircle2, Clock, User, Edit2, Trash2 } from "lucide-react";
import type { Status } from "./MyWork/types";

interface TaskItemProps {
  title: string;
  project?: string;
  notes?: string;
  dueDate?: string;
  assignee?: string;
  priority?: "high" | "medium" | "low";
  status?: Status;
  completed?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatus?: (s: Status) => void;
  showStatusSelector?: boolean;
}

const AVATAR_STYLES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
];

const STATUS_OPTIONS: Array<{ value: Status; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "inProgress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

function getAssigneeInitials(assignee?: string): string {
  if (!assignee || assignee === "Unassigned") return "?";
  const initials = assignee
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return initials || "?";
}

function getAssigneeAvatarStyle(assignee?: string): string {
  const source = assignee || "unassigned";
  const hash = [...source].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_STYLES[hash % AVATAR_STYLES.length];
}

function parseTaskNotes(notes?: string) {
  if (!notes) {
    return { summary: "", subtasks: [] as Array<{ text: string; done: boolean }> };
  }

  const lines = notes.split("\n").map((line) => line.trim()).filter(Boolean);
  const checklistPattern = /^- \[(x| )\]\s+(.+)$/i;

  const subtasks: Array<{ text: string; done: boolean }> = [];
  const summaryParts: string[] = [];

  for (const line of lines) {
    const match = line.match(checklistPattern);
    if (match) {
      subtasks.push({ text: match[2], done: match[1].toLowerCase() === "x" });
      continue;
    }

    if (line.toLowerCase() === "subtasks:") {
      continue;
    }

    summaryParts.push(line);
  }

  return {
    summary: summaryParts.join(" ").trim(),
    subtasks,
  };
}

export default function TaskItem({
  title,
  project,
  notes,
  dueDate,
  assignee,
  priority,
  status,
  completed,
  onEdit,
  onDelete,
  onStatus,
  showStatusSelector,
}: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-orange-100 text-orange-700 border-orange-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const parsed = parseTaskNotes(notes);
  const assigneeInitials = getAssigneeInitials(assignee);
  const assigneeAvatarStyle = getAssigneeAvatarStyle(assignee);
  const currentStatus: Status = status ?? (completed ? "completed" : "todo");

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
        {parsed.summary ? (
          <p className="mt-1 text-sm text-gray-600 leading-5">{parsed.summary}</p>
        ) : (
          project && <p className="mt-1 text-sm text-blue-600">{project}</p>
        )}

        {parsed.subtasks.length > 0 && (
          <div className="mt-2 rounded-md border border-gray-200 bg-white p-2.5 space-y-1.5">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Subtasks</div>
            {parsed.subtasks.map((subtask, index) => (
              <div key={`${subtask.text}-${index}`} className="flex items-start gap-2 text-sm">
                <span className={`mt-1 size-1.5 rounded-full ${subtask.done ? "bg-green-500" : "bg-gray-400"}`} />
                <span className={subtask.done ? "text-gray-400 line-through" : "text-gray-700"}>{subtask.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
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
        {assignee && (
          <span
            title={assignee}
            className={`size-7 rounded-full border border-white flex items-center justify-center text-[10px] font-bold ${assigneeAvatarStyle}`}
          >
            {assigneeInitials}
          </span>
        )}
        {priority && (
          <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[priority]}`}>
            {priority}
          </span>
        )}

        {showStatusSelector && onStatus && (
          <select
            value={currentStatus}
            onChange={(e) => onStatus(e.target.value as Status)}
            className="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-700"
            aria-label="Change task status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
