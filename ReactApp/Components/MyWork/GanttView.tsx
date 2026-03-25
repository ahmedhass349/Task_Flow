import { Edit2, Trash2 } from "lucide-react";
import type { MyWorkTask, Priority } from "./types";

interface GanttViewProps {
  visibleTasks: MyWorkTask[];
}

interface GanttCategory {
  key: string;
  color: string;
  textColor: string;
}

interface GanttRow {
  id: string;
  title: string;
  category: Priority | string;
  durationLabel: string;
  barLeft: number;
  barWidth: number;
  isMilestone?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CATEGORIES: Record<Priority, GanttCategory> = {
  high:   { key: "high",   color: "#EF4444", textColor: "#991B1B" },
  medium: { key: "medium", color: "#A855F7", textColor: "#6B21A8" },
  low:    { key: "low",    color: "#2DD4BF", textColor: "#0F766E" },
};

const LEGEND_ITEMS: Priority[] = ["high", "medium", "low"];

export default function GanttView({ visibleTasks }: GanttViewProps) {
  const now = new Date();
  
  // Timeline: start at Jan 1 of current year and show full year
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31);
  const isLeap = (y: number) => (new Date(y, 1, 29).getDate() === 29);
  const totalDays = (isLeap(now.getFullYear()) ? 366 : 365);

  // Month labels across the year
  const MONTH_LABELS = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), i, 1);
    return `${d.toLocaleString('en-US', { month: 'short' })}`;
  });

  const GANTT_ROWS: GanttRow[] = visibleTasks.map((t) => {
    let barLeft = 0;
    if (t.dueDateLabel && t.dueDateLabel !== "No due date") {
      const d = new Date(t.dueDateLabel);
      const diffTime = d.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      const timelineWidth = 1200; // full-year pixel width
      barLeft = (diffDays / totalDays) * timelineWidth;
      if (barLeft < 0) barLeft = 0;
      if (barLeft > timelineWidth - 45) barLeft = timelineWidth - 45;
    }

    return {
      id: t.id.toString(),
      title: t.title,
      category: t.priority,
      durationLabel: "Due",
      barLeft,
      barWidth: 45.71, // visually roughly 4 days
      onEdit: t.onEdit,
      onDelete: t.onDelete,
    };
  });

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-medium text-gray-900 leading-9">
          My Tasks Timeline
        </h2>
        <p className="text-base text-gray-500 leading-6">
          10-Week Rolling Forward View
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6">
        {/* Legend */}
        <div className="border-b border-gray-200 pb-3 flex items-center gap-5 flex-wrap">
          {LEGEND_ITEMS.map((label) => {
            const cat = CATEGORIES[label];
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="size-4 rounded shrink-0" style={{ background: cat.color }} />
                <span className="text-sm text-gray-700 whitespace-nowrap capitalize">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-4" style={{ minWidth: 1400 }}>
            {/* Month header row */}
            <div style={{ paddingLeft: 256 }} className="flex">
              <div className="flex" style={{ width: 1200, borderBottom: "1.6px solid #CAD5E2" }}>
                {MONTH_LABELS.map((ml) => (
                  <div
                    key={ml}
                    className="flex-1 text-center text-sm font-medium text-gray-700 leading-5 pb-2"
                    style={{ borderLeft: "0.8px solid #E2E8F0" }}
                  >
                    {ml}
                  </div>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div className="flex flex-col gap-2">
              {GANTT_ROWS.map((row) => {
                const cat = CATEGORIES[row.category];
                return (
                  <div key={row.id} className="relative h-12 group">
                    {/* Label */}
                    <div className="absolute left-0 top-1.5 flex justify-between pr-4 items-center" style={{ width: 256 }}>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-900 leading-5 truncate">
                          {row.title}
                        </span>
                        <span className="text-xs leading-4" style={{ color: cat?.textColor || "#666" }}>
                          Priority: {typeof row.category === 'string' ? row.category.charAt(0).toUpperCase() + row.category.slice(1) : ''}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0">
                        {row.onEdit && (
                          <button onClick={row.onEdit} className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                            <Edit2 className="size-3.5" />
                          </button>
                        )}
                        {row.onDelete && (
                          <button onClick={row.onDelete} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline track */}
                      <div className="absolute top-0 overflow-hidden" style={{ left: 256, width: 1200, height: 48 }}>
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {MONTH_LABELS.map((_, i) => (
                          <div key={i} className="flex-1 h-full" style={{ borderLeft: "0.8px solid #F1F5F9" }} />
                        ))}
                      </div>

                      {/* Duration bar */}
                      <div
                        className="absolute flex items-center justify-center overflow-hidden rounded-lg shadow-md"
                        style={{
                          left: row.barLeft,
                          top: 8,
                          width: row.barWidth,
                          height: 32,
                          background: cat ? cat.color : "#94A3B8",
                          outline: `1.6px ${cat ? cat.color : "#94A3B8"} solid`,
                          outlineOffset: "-1.6px",
                        }}
                      >
                        {row.barWidth >= 40 && (
                          <span className="text-white text-xs font-medium leading-4 whitespace-nowrap">
                            {row.durationLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 leading-5">
          Current Date: {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
