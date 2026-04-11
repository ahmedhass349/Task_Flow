// ── TableView: spreadsheet-style task list with expandable sub-tasks ────
//
// Renders a columnar grid with expandable rows. Sub-tasks shown in a
// purple-accented nested panel.

import { Fragment, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { MyWorkTask, Priority, Status } from "./types";

interface TableViewProps {
  visibleTasks: MyWorkTask[];
}

// ── Sub-task data (will come from API later) ─────────────────────────────

interface SubTask {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}

const SUB_TASKS: Record<string, SubTask[]> = {};

// ── Badge helpers ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<Status, { bg: string; border: string; color: string; label: string }> = {
  inProgress: { bg: "#FFFBEB", border: "#C69F10", color: "#C9A41C", label: "In Progress" },
  review:     { bg: "#EEF2FF", border: "#6366F1", color: "#4F46E5", label: "In Review" },
  overdue:    { bg: "#FEF2F2", border: "#DC2626", color: "#DC2626", label: "Overdue" },
  todo:       { bg: "#F8FAFC", border: "#94A3B8", color: "#64748B", label: "To Do" },
  completed:  { bg: "#F3FFEB", border: "#47AD08", color: "#47AD08", label: "Completed" },
};

const PRIORITY_MAP: Record<Priority, { bg: string; border: string; color: string }> = {
  high:   { bg: "#FFF2F3", border: "#C61F30", color: "#C61F30" },
  medium: { bg: "#FFFBEB", border: "#C69F10", color: "#C9A41C" },
  low:    { bg: "#F3FFEB", border: "#47AD08", color: "#47AD08" },
};

function StatusBadge({ status }: { status: Status }) {
  const t = STATUS_MAP[status];
  return (
    <span
      className="rounded-full text-xs font-medium px-2.5 py-0.5 whitespace-nowrap"
      style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}
    >
      {t.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const t = PRIORITY_MAP[priority];
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return (
    <span
      className="rounded-full text-xs font-medium px-2.5 py-0.5 whitespace-nowrap"
      style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}
    >
      {label}
    </span>
  );
}

// ── Shared grid constants ────────────────────────────────────────────────

const COL_GRID = "52px minmax(180px,2fr) 1fr 1fr 110px 100px 120px 80px";
const SUB_COL_GRID = "40px 1fr 120px 110px 130px 80px";
const DIVIDER_COLOR = "#DCDCDC";
const PURPLE_ACCENT = "#6C4B99";

const headerCellClass = "text-sm font-semibold text-gray-400";
const cellClass = "text-sm";

export default function TableView({ visibleTasks }: TableViewProps) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-5 pb-3">
        <span className="text-lg font-semibold text-gray-900">My Tasks</span>
      </div>

      {/* Column headers */}
      <div
        className="grid items-center gap-2 px-6 pb-2.5"
        style={{ gridTemplateColumns: COL_GRID, borderBottom: `1px solid ${DIVIDER_COLOR}` }}
      >
        <div />
        <div className={headerCellClass}>Task</div>
        <div className={headerCellClass}>Notes</div>
        <div className={headerCellClass}>Assignee</div>
        <div className={headerCellClass}>Due Date</div>
        <div className={headerCellClass}>Priority</div>
        <div className={headerCellClass}>Status</div>
        <div className={headerCellClass}>Actions</div>
      </div>

      {/* Rows */}
      {visibleTasks.map((task, idx) => {
        const isExpanded = expandedRowId === task.id;
        const hasChildren = !!SUB_TASKS[task.id.toString()];
        const isLast = idx === visibleTasks.length - 1;

        return (
          <Fragment key={task.id}>
            {/* Main row */}
            <div
              role={hasChildren ? "button" : undefined}
              tabIndex={hasChildren ? 0 : undefined}
              onClick={() => hasChildren && setExpandedRowId(isExpanded ? null : task.id)}
              onKeyDown={(e) => {
                if (hasChildren && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setExpandedRowId(isExpanded ? null : task.id);
                }
              }}
              aria-expanded={hasChildren ? isExpanded : undefined}
              className="grid items-center gap-2 px-6 py-3"
              style={{
                gridTemplateColumns: COL_GRID,
                cursor: hasChildren ? "pointer" : "default",
                borderTop: isExpanded ? `1px solid ${PURPLE_ACCENT}` : "none",
                borderBottom: isExpanded ? "none" : !isLast ? `1px solid ${DIVIDER_COLOR}` : "none",
              }}
            >
              {/* Bullet indicator */}
              <div className="flex items-center justify-center">
                <div
                  className="size-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: isExpanded ? PURPLE_ACCENT : "#D9D9D9" }}
                >
                  <div
                    className="w-[10.67px] h-[10.67px] rounded-sm"
                    style={{ background: isExpanded ? "#fff" : "#555555" }}
                  />
                </div>
              </div>

              <div className={`${cellClass} font-semibold text-gray-900`}>{task.title}</div>
              <div className={`${cellClass} text-gray-600 truncate`}>{task.notes || task.project}</div>
              <div className={`${cellClass} text-gray-600`}>{task.assignee}</div>
              <div className={`${cellClass} text-gray-600`}>{task.dueDateLabel}</div>
              <div><PriorityBadge priority={task.priority} /></div>
              <div><StatusBadge status={task.status} /></div>
              <div className="flex items-center gap-1">
                {task.onEdit && (
                  <button onClick={(e) => { e.stopPropagation(); task.onEdit!(); }} className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                    <Edit2 className="size-4" />
                  </button>
                )}
                {task.onDelete && (
                  <button onClick={(e) => { e.stopPropagation(); task.onDelete!(); }} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded sub-task panel */}
            {isExpanded && hasChildren && (
              <div
                style={{
                  borderBottom: `1px solid ${PURPLE_ACCENT}`,
                  borderLeft: `4px solid ${PURPLE_ACCENT}`,
                  background: "#FAF6FF",
                }}
              >
                {/* Sub-panel header */}
                <div
                  className="grid items-center gap-2 px-5 py-2 bg-gray-100 rounded-t"
                  style={{
                    gridTemplateColumns: SUB_COL_GRID,
                    border: `1px solid ${DIVIDER_COLOR}`,
                  }}
                >
                  <div />
                  <div className={`${headerCellClass} text-xs`}>Sub-Task</div>
                  <div className={`${headerCellClass} text-xs`}>Due Date</div>
                  <div className={`${headerCellClass} text-xs`}>Priority</div>
                  <div className={`${headerCellClass} text-xs`}>Status</div>
                </div>

                {/* Sub-rows */}
                {SUB_TASKS[task.id.toString()].map((sub) => (
                  <div
                    key={sub.id}
                    className="grid items-center gap-2 px-5 py-2.5 bg-white"
                    style={{
                      gridTemplateColumns: SUB_COL_GRID,
                      border: `1px solid ${DIVIDER_COLOR}`,
                      borderTop: "none",
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="size-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-gray-600 rounded-[1.5px]" />
                      </div>
                    </div>
                    <div className="text-[13px] text-gray-900">{sub.title}</div>
                    <div className="text-[13px] text-gray-600">{sub.dueDate}</div>
                    <div><PriorityBadge priority={sub.priority} /></div>
                    <div><StatusBadge status={sub.status} /></div>
                  </div>
                ))}
              </div>
            )}

            {/* Divider after expanded block */}
            {isExpanded && !isLast && (
              <div style={{ borderBottom: `1px solid ${DIVIDER_COLOR}` }} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
