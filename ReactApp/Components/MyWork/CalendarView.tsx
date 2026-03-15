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
  col: number;
  startHour: number;
  durationHours: number;
  title: string;
  color: "blue" | "violet" | "amber";
  hasLink?: boolean;
}

// ── Static data ──────────────────────────────────────────────────────────

const TODAY = 14;

const WEEK_DAYS = [
  { label: "SUN", day: 9 },
  { label: "MON", day: 10 },
  { label: "TUE", day: 11 },
  { label: "WED", day: 12 },
  { label: "THU", day: 13 },
  { label: "FRI", day: 14 },
  { label: "SAT", day: 15 },
];

const CAL_EVENTS: CalEvent[] = [
  { col: 1, startHour: 8,  durationHours: 1,   title: "Monthly catch-up",               color: "blue",   hasLink: true },
  { col: 1, startHour: 9,  durationHours: 1,   title: "Quarterly review",               color: "blue",   hasLink: true },
  { col: 1, startHour: 10, durationHours: 1.5, title: "New Employee Welcome Lunch!",     color: "violet" },
  { col: 2, startHour: 9,  durationHours: 1,   title: "City Sales Pitch",               color: "blue" },
  { col: 3, startHour: 10, durationHours: 1,   title: "Design Review",                  color: "blue",   hasLink: true },
  { col: 4, startHour: 8,  durationHours: 1,   title: "Follow up proposal",             color: "amber",  hasLink: true },
  { col: 4, startHour: 11, durationHours: 1,   title: "Visit to discuss improvements",  color: "blue" },
  { col: 5, startHour: 9,  durationHours: 1,   title: "Presentation of new products",   color: "blue" },
  { col: 5, startHour: 13, durationHours: 1,   title: "Design Review",                  color: "blue",   hasLink: true },
  { col: 6, startHour: 10, durationHours: 1,   title: "1:1 with Jon",                   color: "amber",  hasLink: true },
];

const COLOR_CLASSES = {
  blue:   { bg: "bg-sky-50",    bar: "bg-sky-400",    text: "text-sky-700",    time: "text-sky-600" },
  violet: { bg: "bg-violet-50", bar: "bg-violet-500", text: "text-violet-700", time: "text-violet-600" },
  amber:  { bg: "bg-amber-50",  bar: "bg-amber-400",  text: "text-amber-700",  time: "text-amber-600" },
};

const HOUR_ROWS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const ROW_HEIGHT = 64;
const START_HOUR = 7;

function formatHour(h: number): string {
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// ── Mini Calendar Sub-component ──────────────────────────────────────────

function MiniCalendar({ taskDotsByDay }: { taskDotsByDay: Record<number, string[]> }) {
  // March 2026 starts on Sunday
  const miniCalDays: (number | null)[] = [
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];
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
            const isToday = day === TODAY;
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
                    <span className={`text-[10px] font-semibold leading-4 ${day === null ? "text-transparent" : day > 28 || day < 1 ? "text-zinc-600" : "text-white"}`}>
                      {day ?? ""}
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

function AgendaSidebar() {
  const todayEvents = [
    { time: "8:30 AM", title: "Monthly catch-up", color: "#3B82F6", link: true },
    { time: "9:00 AM", title: "Quarterly review", color: "#3B82F6", link: true },
  ];

  const upcomingSections = [
    {
      label: "TOMORROW",
      date: "3/15/2026",
      events: [{ time: "9:00 AM", title: "City Sales Pitch", color: "#EC4899", link: true }],
    },
    {
      label: "MONDAY",
      date: "3/16/2026",
      events: [
        { time: "10:00 AM", title: "Design Review", color: "#3B82F6", link: true },
        { time: "2:00 PM", title: "1:1 with Jon", color: "#FBBF24", link: true },
      ],
    },
  ];

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
            {ev.link && (
              <span className="size-3 rounded-full bg-zinc-400 inline-flex items-center justify-center text-zinc-900 text-[9px] font-bold">
                &nearr;
              </span>
            )}
          </div>
          <div className="pl-4 text-[11px] text-white">{ev.title}</div>
        </div>
      ))}

      {/* Upcoming */}
      {upcomingSections.map((section, si) => (
        <div key={si} className="flex flex-col gap-1">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span className="text-xs font-bold text-white/60">{section.label}</span>
              <span className="text-xs text-white/60">{section.date}</span>
            </div>
          </div>
          {section.events.map((ev, ei) => (
            <div key={ei} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                <span className="text-[10px] text-zinc-400 font-semibold">{ev.time}</span>
              </div>
              <div className="pl-4 text-[11px] text-white">{ev.title}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Main CalendarView Component ──────────────────────────────────────────

export default function CalendarView({ visibleTasks }: CalendarViewProps) {
  // Build task-dot map for mini-calendar
  const taskDotsByDay = visibleTasks.reduce<Record<number, string[]>>((acc, task) => {
    if (!task.dueDay) return acc;
    if (!acc[task.dueDay]) acc[task.dueDay] = [];
    const color =
      task.priority === "high"   ? "#EF4444" :
      task.priority === "medium" ? "#A855F7" :
      "#2DD4BF";
    acc[task.dueDay].push(color);
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
            <span className="text-white text-[22px]">March</span>
            <span className="text-red-500 text-[22px]">2026</span>
          </div>
          <div className="flex">
            {["\u2039", "\u203A"].map((ch, i) => (
              <button key={i} aria-label={i === 0 ? "Previous month" : "Next month"} className="bg-transparent border-none text-white text-lg cursor-pointer px-1 leading-none opacity-70 hover:opacity-100">
                {ch}
              </button>
            ))}
          </div>
        </div>

        <MiniCalendar taskDotsByDay={taskDotsByDay} />
        <div className="h-px bg-zinc-800" />
        <AgendaSidebar />
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
          {/* Day column headers */}
          <div
            className="grid border-b border-gray-200 sticky top-0 bg-white z-10"
            style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}
          >
            {/* Timezone cell */}
            <div className="p-1.5 text-right text-[10px] text-zinc-500 border-r border-gray-200">
              <div>EST</div>
              <div>GMT-5</div>
            </div>

            {WEEK_DAYS.map((wd) => {
              const isWeekToday = wd.day === TODAY;
              const isWeekend = wd.label === "SUN" || wd.label === "SAT";
              return (
                <div
                  key={wd.day}
                  className={`px-2 py-1.5 border-l border-gray-200 ${
                    isWeekToday ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">{wd.label}</div>
                  <div className={`text-[22px] leading-tight ${isWeekToday ? "text-blue-700" : "text-gray-900"}`}>
                    {wd.day}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time + column grid */}
          <div className="grid relative" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
            {/* Time labels */}
            <div className="border-r border-gray-200">
              {HOUR_ROWS.map((hour) => (
                <div
                  key={hour}
                  className="flex items-start justify-end pr-1.5 pt-1 text-[11px] text-zinc-500 border-t border-gray-200"
                  style={{ height: ROW_HEIGHT }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {WEEK_DAYS.map((wd, colIdx) => {
              const isWeekend = wd.label === "SUN" || wd.label === "SAT";
              const isWeekToday = wd.day === TODAY;
              const columnEvents = CAL_EVENTS.filter((e) => e.col === colIdx);

              return (
                <div
                  key={wd.day}
                  className={`relative border-l border-gray-200 ${
                    isWeekToday ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Hour slot rows */}
                  {HOUR_ROWS.map((hour) => (
                    <div key={hour} className="border-t border-gray-200" style={{ height: ROW_HEIGHT }}>
                      <div className="border-t border-dashed border-gray-100" style={{ marginTop: ROW_HEIGHT / 2 - 1 }} />
                    </div>
                  ))}

                  {/* Event blocks */}
                  {columnEvents.map((ev, ei) => {
                    const topPx = (ev.startHour - START_HOUR) * ROW_HEIGHT + 1;
                    const heightPx = ev.durationHours * ROW_HEIGHT - 4;
                    const cc = COLOR_CLASSES[ev.color];
                    const startLabel = formatHour(ev.startHour).replace(" ", ":00 ");
                    return (
                      <div
                        key={ei}
                        className={`absolute left-0.5 right-0.5 rounded-md overflow-hidden flex cursor-pointer ${cc.bg}`}
                        style={{ top: topPx, height: heightPx }}
                      >
                        <div className={`w-[3px] shrink-0 ${cc.bar}`} />
                        <div className="flex-1 p-1 flex flex-col gap-0.5 overflow-hidden">
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-semibold ${cc.time}`}>{startLabel}</span>
                            {ev.hasLink && (
                              <span className={`size-3 rounded-full inline-flex items-center justify-center text-[8px] text-white shrink-0 ${cc.bar}`}>
                                &nearr;
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-semibold leading-snug overflow-hidden ${cc.text}`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {ev.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
