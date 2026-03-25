// ── CalendarView: weekly time-grid calendar embedded in MyWork ───────────
//
// Shows a dark-sidebar mini-calendar + agenda alongside a weekly time-grid
// with event cards. This is the "Calendar" view mode within My Tasks.

import { Search } from "lucide-react";
import type { MyWorkTask } from "./types";

interface CalendarViewProps {
  visibleTasks: MyWorkTask[];
}

// ── Calendar-specific types ──────────────────────────────────────────────

interface CalEvent {
  startHour: number;
  durationHours: number;
  title: string;
  color: "blue" | "violet" | "amber";
  hasLink?: boolean;
  onEdit?: () => void;
}

const COLOR_CLASSES = {
  blue:   { bg: "bg-sky-50",    bar: "bg-sky-400",    text: "text-sky-700",    time: "text-sky-600" },
  violet: { bg: "bg-violet-50", bar: "bg-violet-500", text: "text-violet-700", time: "text-violet-600" },
  amber:  { bg: "bg-amber-50",  bar: "bg-amber-400",  text: "text-amber-700",  time: "text-amber-600" },
};

const HOUR_ROWS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ROW_HEIGHT = 64;
const START_HOUR = 7;

function formatHour(h: number): string {
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// ── Mini Calendar Sub-component ──────────────────────────────────────────

function MiniCalendar({ taskDotsByDay, year, month, todayDate }: { taskDotsByDay: Record<number, string[]>; year: number; month: number; todayDate: number | null }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const miniCalDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) miniCalDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) miniCalDays.push(d);
  while (miniCalDays.length % 7 !== 0) miniCalDays.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 mb-0.5">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="text-center text-[9px] font-bold text-zinc-500 py-0.5">
            {d}
          </div>
        ))}
      </div>

      {Array.from({ length: miniCalDays.length / 7 }, (_, week) => (
        <div key={week} className="grid grid-cols-7">
          {miniCalDays.slice(week * 7, week * 7 + 7).map((day, cellIdx) => {
            const dots = day ? (taskDotsByDay[day] ?? []) : [];
            const isToday = day === todayDate;
            return (
              <div key={cellIdx} className="flex flex-col items-center py-0.5">
                {isToday ? (
                  <div className="size-6 rounded-full bg-blue-500 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-white leading-none">{day}</span>
                    {dots.length > 0 && (
                      <span className="size-1 rounded-full bg-white mt-px" />
                    )}
                  </div>
                ) : (
                  <>
                    <span className={`text-[10px] font-semibold leading-4 ${day === null ? "text-transparent" : "text-white"}`}>
                      {day}
                    </span>
                    {dots.length > 0 ? (
                      <div className="flex gap-0.5 mt-px">
                        {dots.slice(0, 3).map((dotColor, di) => (
                          <span key={di} className="size-1 rounded-full" style={{ background: dotColor }} />
                        ))}
                      </div>
                    ) : (
                      <div className="h-1.5" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Agenda Sidebar Sub-component ─────────────────────────────────────────

function AgendaSidebar({ visibleTasks }: { visibleTasks: MyWorkTask[] }) {
  const now = new Date();
  
  const todayTasks = visibleTasks.filter((t) => t.dueOrder === 1 && t.status !== "completed");
  const upcomingTasks = visibleTasks.filter((t) => t.dueOrder > 1 && t.status !== "completed");

  const todayEvents = todayTasks.map(t => ({
    time: "Due",
    title: t.title,
    color: t.priority === "high" ? "#EF4444" : t.priority === "medium" ? "#A855F7" : "#2DD4BF"
  }));

  const upcomingEvents = upcomingTasks.slice(0, 5).map(t => ({
    time: t.dueDateLabel,
    title: t.title,
    color: t.priority === "high" ? "#EF4444" : t.priority === "medium" ? "#A855F7" : "#2DD4BF"
  }));

  return (
    <div className="flex flex-col gap-2.5 overflow-hidden">
      {/* Today header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <span className="text-xs font-bold text-blue-500">TODAY</span>
          <span className="text-xs text-blue-500">3/14/2026</span>
        </div>
        <span className="text-xs text-white/60 font-semibold">55deg/40deg</span>
      </div>

      {/* Today events */}
      {todayEvents.map((ev, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
            <span className="text-[10px] text-zinc-400 font-semibold">{ev.time}</span>
          </div>
          <div className="pl-4 text-[11px] text-white">{ev.title}</div>
        </div>
      ))}

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span className="text-xs font-bold text-white/60">UPCOMING</span>
            </div>
          </div>
          {upcomingEvents.map((ev, ei) => (
            <div key={ei} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                <span className="text-[10px] text-zinc-400 font-semibold">{ev.time}</span>
              </div>
              <div className="pl-4 text-[11px] text-white">{ev.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarView({ visibleTasks }: CalendarViewProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // Build month grid for current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthGrid: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) monthGrid.push(null);
  for (let d = 1; d <= daysInMonth; d++) monthGrid.push(new Date(year, month, d));
  while (monthGrid.length % 7 !== 0) monthGrid.push(null);

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Build task-dot map for mini-calendar (current month)
  const taskDotsByDay = visibleTasks.reduce<Record<number, string[]>>((acc, task) => {
    if (task.dueDateLabel && task.dueDateLabel !== "No due date") {
      const d = new Date(task.dueDateLabel);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const dd = d.getDate();
        if (!acc[dd]) acc[dd] = [];
        const color = task.priority === "high" ? "#EF4444" : task.priority === "medium" ? "#A855F7" : "#2DD4BF";
        acc[dd].push(color);
      }
    }
    return acc;
  }, {});

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex" style={{ minHeight: 700 }}>
      {/* Dark left sidebar */}
      <aside className="w-[280px] shrink-0 bg-zinc-900 flex flex-col gap-4 p-4 overflow-y-auto">
        {/* Traffic-light dots */}
        <div className="flex gap-1.5 items-center">
          {[
            { bg: "#ED6B60", border: "#D05147" },
            { bg: "#F5C250", border: "#D6A343" },
            { bg: "#62C656", border: "#52A842" },
          ].map((c, i) => (
            <span
              key={i}
              className="size-3 rounded-full inline-block"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            />
          ))}
        </div>

        {/* Month + year */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-baseline">
            <span className="text-white text-[22px]">{MONTH_NAMES[month]}</span>
            <span className="text-red-500 text-[22px]">{year}</span>
          </div>
          <div className="flex">
            {["\u2039", "\u203A"].map((ch, i) => (
              <button key={i} aria-label={i === 0 ? "Previous month" : "Next month"} className="bg-transparent border-none text-white text-lg cursor-pointer px-1 leading-none opacity-70 hover:opacity-100">
                {ch}
              </button>
            ))}
          </div>
        </div>

        <MiniCalendar taskDotsByDay={taskDotsByDay} year={year} month={month} todayDate={date} />
        <div className="h-px bg-zinc-800" />
        <AgendaSidebar visibleTasks={visibleTasks} />
      </aside>

      {/* Main week grid */}
      <div className="flex-1 bg-white flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between gap-2 bg-white">
          {/* Nav */}
          <div className="flex gap-px">
            {["\u2039", "Today", "\u203A"].map((label, li) => (
              <button
                key={li}
                aria-label={li === 0 ? "Previous week" : li === 2 ? "Next week" : undefined}
                className={`bg-gray-100 border-none cursor-pointer text-xs text-gray-900 ${
                  label === "Today" ? "px-3 py-1" : "px-2 py-1"
                } ${li === 0 ? "rounded-l-md" : li === 2 ? "rounded-r-md" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View switcher */}
          <div className="flex gap-1">
            {["Day", "Week", "Month", "Year"].map((label) => (
              <button
                key={label}
                className={`px-3.5 py-1 rounded-lg border-none cursor-pointer text-[13px] ${
                  label === "Week"
                    ? "bg-red-600 text-white font-semibold"
                    : "bg-transparent text-zinc-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1" style={{ minWidth: 160 }}>
            <Search className="size-3.5 text-gray-400" />
            <span className="text-xs text-zinc-400">Search</span>
          </div>
        </div>

        {/* Grid area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Month grid */}
            <div className="grid grid-cols-7 gap-0">
              {monthGrid.map((d, idx) => {
                const isToday = d && d.getDate() === date && d.getMonth() === month && d.getFullYear() === year;
                const dayNumber = d ? d.getDate() : null;
                const dayTasks = d
                  ? visibleTasks.filter(t => t.dueDateLabel && new Date(t.dueDateLabel).toDateString() === d.toDateString())
                  : [];
                return (
                  <div key={idx} className={`p-3 min-h-[100px] border ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-semibold text-gray-700">{dayNumber ?? ''}</div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayTasks.map((t, ti) => (
                        <div key={ti} onClick={() => t.onEdit && t.onEdit()} className="p-1 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100">
                          <div className="text-xs font-semibold text-gray-800 truncate">{t.title}</div>
                          <div className="text-[11px] text-gray-500 truncate">{t.notes || t.project}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </div>
  );
}
