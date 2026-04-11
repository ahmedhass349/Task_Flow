// ── KanbanView: column-based board ──────────────────────────────────────
//
// Renders tasks in status columns (To Do, In Progress, In Review,
// Overdue, Completed) with colored headers and task cards.

import { Edit2, Trash2 } from "lucide-react";
import type { MyWorkTask, Priority, Status } from "./types";

interface KanbanViewProps {
  visibleTasks: MyWorkTask[];
}

interface KanbanCol {
  key: Status;
  title: string;
  borderColor: string;
}

const COLUMNS: KanbanCol[] = [
  { key: "todo",       title: "To Do",       borderColor: "rgba(255, 167, 38, 0.70)" },
  { key: "inProgress", title: "In Progress", borderColor: "rgba(0, 102, 204, 0.70)" },
  { key: "review",     title: "In Review",   borderColor: "rgba(108, 75, 153, 0.70)" },
  { key: "overdue",    title: "Overdue",     borderColor: "rgba(220, 38, 38, 0.70)" },
  { key: "completed",  title: "Completed",   borderColor: "rgba(0, 184, 148, 0.70)" },
];

const PRIORITY_DOT: Record<Priority, string> = {
  high:   "#EB5757",
  medium: "#F2994A",
  low:    "#219653",
};

const STATUS_CHIP: Record<Status, { bg: string; color: string; label: string }> = {
  todo:       { bg: "rgba(99, 110, 114, 0.10)", color: "#636E72", label: "To Do" },
  inProgress: { bg: "rgba(47, 128, 237, 0.10)", color: "#2F80ED", label: "Ongoing" },
  review:     { bg: "rgba(108, 75, 153, 0.10)", color: "#6C4B99", label: "In Review" },
  overdue:    { bg: "rgba(220, 38, 38, 0.10)", color: "#DC2626", label: "Overdue" },
  completed:  { bg: "rgba(33, 150, 83, 0.10)",  color: "#219653", label: "Done" },
};

export default function KanbanView({ visibleTasks }: KanbanViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-5 gap-4" style={{ minWidth: 1180 }}>
          {COLUMNS.map((col) => {
          const colTasks = visibleTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-3"
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={async (e) => {
                const id = e.dataTransfer.getData('text/plain');
                if (!id) return;
                // Find task and call its onStatus to change to this column's status
                const task = visibleTasks.find(t => t.id.toString() === id);
                if (task && task.onStatus) {
                  await task.onStatus(col.key);
                }
              }}
            >
              {/* Column header */}
              <div
                className="px-4 pt-3.5 pb-3 bg-gray-50 rounded-t-2xl flex justify-between items-center"
                style={{ borderTop: `4px solid ${col.borderColor}` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[17px] font-bold text-gray-900">{col.title}</span>
                  <span className="bg-black/10 rounded-full px-2.5 py-1 text-[13px] font-extrabold text-gray-900">
                    {colTasks.length}
                  </span>
                </div>
                <button aria-label={`Add task to ${col.title}`} className="size-7 bg-emerald-500 rounded-md flex items-center justify-center text-white text-lg leading-none font-light">
                  +
                </button>
              </div>

              {/* Task cards */}
              {colTasks.map((task) => {
                const chip = STATUS_CHIP[task.status];
                const dot = PRIORITY_DOT[task.priority];
                return (
                  <div key={task.id} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-2.5" draggable
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', task.id.toString()); }}
                  >
                    {/* Title + status chip */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="size-6 rounded-full shrink-0 flex items-center justify-center">
                          <div className="w-4 h-3.5" style={{ background: dot }} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 leading-5">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                          style={{ background: chip.bg, color: chip.color }}
                        >
                          {chip.label}
                        </span>
                        {task.onEdit && (
                          <button onClick={task.onEdit} className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50" aria-label="Edit task">
                            <Edit2 className="size-3.5" />
                          </button>
                        )}
                        {task.onDelete && (
                          <button onClick={task.onDelete} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50" aria-label="Delete task">
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-light text-gray-500 leading-[18px] truncate">
                      {task.notes || task.project}
                    </p>

                    {/* Deadline */}
                    <div className="flex items-center gap-1 text-xs">
                      <div className="size-4 relative shrink-0">
                        <div className="absolute left-0.5 top-px w-3 h-3.5 bg-amber-400 rounded-sm" />
                      </div>
                      <span className="font-medium text-amber-400">Deadline</span>
                      <span className="text-gray-500">:</span>
                      <span className="text-gray-500">{task.dueDateLabel}</span>
                    </div>

                    {/* Footer: avatars + counts */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <div className="size-7 rounded-full border-[1.5px] border-white flex items-center justify-center bg-blue-100" title={task.assignee}>
                            <span className="text-[10px] font-bold text-blue-800">
                              {task.assignee === "Unassigned" ? "?" : task.assignee.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty column */}
              {colTasks.length === 0 && (
                <div className="py-8 px-4 bg-white rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-[13px] text-gray-400">No tasks</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
