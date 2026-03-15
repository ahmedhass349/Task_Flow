// ── Calendar page ─────────────────────────────────────────────────────────
//
// Responsive weekly calendar with a collapsible left panel (mini-calendar
// + agenda) and a scrollable weekly time-grid on the right.
//
// Changes from original:
//  - Removed fixed 1440×900 pixel layout → flex layout fills available space
//  - All inline styles → Tailwind utility classes
//  - Removed fontFamily:"Inter" (body inherits Roboto from theme.css)
//  - Removed macOS traffic-light dots (app shell provides chrome)
//  - Event cards rendered inside grid cells instead of absolute px coords
//  - Added loading / error states via PageLoading / PageError
//  - Left panel hides on screens < lg, togglable via button

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, PanelLeftClose, PanelLeft } from "lucide-react";
import { PageLoading, PageError } from "../Components/PageState";

// ── Types ────────────────────────────────────────────────────────────────

interface DayCell {
  day: string;
  color: "white" | "muted";
  dots: string[];
  selected?: boolean;
}

interface AgendaItem {
  dot: string;
  time: string;
  title: string;
  link?: string;
}

interface DaySection {
  label: string;
  date: string;
  weather: string;
  weatherType: "sun" | "cloud";
  banners?: { text: string; bg: string }[];
  items?: AgendaItem[];
}

interface CalendarEvent {
  /** 0-based day index (0=Sun … 6=Sat) */
  dayIndex: number;
  /** Starting hour in 24-h format (e.g. 8 = 8 AM) */
  startHour: number;
  /** Duration in hours (supports fractions) */
  duration: number;
  bg: string;
  border: string;
  text: string;
  dotBg: string;
  dotFg: string;
  time: string;
  title: string;
  showDotIcon?: boolean;
}

// ── Seed Data ────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const MINI_CALENDAR_ROWS: DayCell[][] = [
  [
    { day: "31", color: "muted", dots: [] },
    { day: "1", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "2", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "3", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "4", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "5", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "6", color: "white", dots: [] },
  ],
  [
    { day: "7", color: "white", dots: [] },
    { day: "8", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "9", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "10", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "11", color: "white", dots: ["#2DD4BF"] },
    { day: "12", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "13", color: "white", dots: [] },
  ],
  [
    { day: "14", color: "white", dots: ["#A855F7", "#2DD4BF"] },
    { day: "15", color: "white", dots: ["#A855F7"] },
    { day: "16", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "17", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "18", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "19", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "20", color: "white", dots: [] },
  ],
  [
    { day: "21", color: "white", dots: [] },
    { day: "22", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "23", color: "white", dots: ["#3B82F6", "#2DD4BF"] },
    { day: "24", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "25", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "26", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "27", color: "white", dots: ["white"], selected: true },
  ],
  [
    { day: "28", color: "white", dots: ["#3B82F6"] },
    { day: "1", color: "muted", dots: ["#A855F7", "#2DD4BF"] },
    { day: "2", color: "muted", dots: ["#A855F7"] },
    { day: "3", color: "muted", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "4", color: "muted", dots: ["#2DD4BF"] },
    { day: "5", color: "muted", dots: ["#3B82F6", "#2DD4BF"] },
    { day: "6", color: "muted", dots: [] },
  ],
  [
    { day: "7", color: "muted", dots: [] },
    { day: "8", color: "muted", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "9", color: "muted", dots: ["#3B82F6", "#2DD4BF"] },
    { day: "10", color: "muted", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "11", color: "muted", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "12", color: "muted", dots: ["#3B82F6", "#A855F7"] },
    { day: "13", color: "muted", dots: [] },
  ],
];

const AGENDA_SECTIONS: DaySection[] = [
  {
    label: "TODAY",
    date: "2/27/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    banners: [{ text: "All-Hands Company Meeting", bg: "#A855F7" }],
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Monthly catch-up" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Quarterly review", link: "https://zoom.us/i/1983475281" },
    ],
  },
  {
    label: "TOMORROW",
    date: "2/28/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    items: [
      { dot: "#EC4899", time: "8:30 - 9:00 AM", title: "Visit to discuss improvements", link: "https://zoom.us/i/1983475281" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Presentation of new products and cost structure" },
    ],
  },
  {
    label: "MONDAY",
    date: "3/1/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "cloud",
    items: [{ dot: "#EC4899", time: "8:30 - 9:00 AM", title: "City Sales Pitch", link: "https://zoom.us/i/1983475281" }],
  },
  {
    label: "TUESDAY",
    date: "3/2/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    items: [{ dot: "#FBBF24", time: "8:30 - 9:00 AM", title: "Visit to discuss improvements" }],
  },
  {
    label: "WEDNESDAY",
    date: "3/3/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "cloud",
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to discuss the new proposal" },
    ],
  },
  {
    label: "THURSDAY",
    date: "3/4/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    items: [{ dot: "#EC4899", time: "8:30 - 9:00 AM", title: "Monthly catch-up", link: "https://zoom.us/i/1983475281" }],
  },
  {
    label: "FRIDAY",
    date: "3/5/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    items: [
      { dot: "#FBBF24", time: "8:30 - 9:00 AM", title: "Follow up proposal" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "City Sales Pitch" },
    ],
  },
  {
    label: "SATURDAY",
    date: "3/6/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
  },
  {
    label: "SUNDAY",
    date: "3/7/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
  },
  {
    label: "MONDAY",
    date: "3/8/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
    ],
  },
  {
    label: "TUESDAY",
    date: "3/9/2021",
    weather: "55\u00BA/40\u00BA",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
    items: [{ dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Quarterly review" }],
  },
];

// Events now use day-index + hour instead of absolute pixel coords.
// dayIndex: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const SEED_EVENTS: CalendarEvent[] = [
  { dayIndex: 0, startHour: 8, duration: 1, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "8:00 AM", title: "Monday Wake-Up Hour", showDotIcon: true },
  { dayIndex: 0, startHour: 9, duration: 1, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "9:00 AM", title: "All-Team Kickoff" },
  { dayIndex: 0, startHour: 10, duration: 1, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "10:00 AM", title: "Financial Update", showDotIcon: true },
  { dayIndex: 0, startHour: 11, duration: 2, bg: "rgba(139,92,246,0.10)", border: "#8B5CF6", text: "#6D28D9", dotBg: "#6D28D9", dotFg: "#EDE9FE", time: "11:00 AM", title: "New Employee Welcome Lunch!" },
  { dayIndex: 1, startHour: 14, duration: 2, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "2:00 PM", title: "Concept Design Review II", showDotIcon: true },
  { dayIndex: 2, startHour: 9, duration: 1, bg: "rgba(16,185,129,0.10)", border: "#10B981", text: "#047857", dotBg: "#047857", dotFg: "#D1FAE5", time: "9:00 AM", title: "Webinar: Figma..." },
  { dayIndex: 2, startHour: 9, duration: 1, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "9:00 AM", title: "Coffee Chat", showDotIcon: true },
  { dayIndex: 3, startHour: 13, duration: 1, bg: "rgba(14,165,233,0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "1:00 PM", title: "Design Review", showDotIcon: true },
  { dayIndex: 4, startHour: 14, duration: 1, bg: "rgba(245,158,11,0.10)", border: "#F59E0B", text: "#B45309", dotBg: "#B45309", dotFg: "#FEF3C7", time: "2:00 PM", title: "1:1 with Heather", showDotIcon: true },
  { dayIndex: 4, startHour: 16, duration: 1, bg: "#FFE4E6", border: "#F43F5E", text: "#BE123C", dotBg: "#BE123C", dotFg: "#FFE4E6", time: "4:00 PM", title: "Happy Hour" },
  { dayIndex: 1, startHour: 16, duration: 1, bg: "#FFE4E6", border: "#F43F5E", text: "#BE123C", dotBg: "#BE123C", dotFg: "#FFE4E6", time: "4:00 PM", title: "Design Team Happy Hour" },
];

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

function formatHour(h: number): string {
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

/** Lookup: events for a given (dayIndex, hour). May return multiple. */
function eventsAt(day: number, hour: number): CalendarEvent[] {
  return SEED_EVENTS.filter((e) => e.dayIndex === day && e.startHour === hour);
}

// ── View toggle button styles ────────────────────────────────────────────

type ViewMode = "Day" | "Week" | "Month" | "Year";

// ── Sub-components ───────────────────────────────────────────────────────

function MiniCalendar() {
  return (
    <div>
      {/* Month / year header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-white text-2xl font-normal leading-10">February</span>
          <span className="text-red-500 text-2xl font-normal leading-10">2021</span>
        </div>
        <div className="flex gap-2.5 text-white">
          <button className="hover:text-zinc-400 transition-colors" aria-label="Previous month">
            <ChevronLeft className="size-5" />
          </button>
          <button className="hover:text-zinc-400 transition-colors" aria-label="Next month">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="p-1 text-center text-zinc-500 text-[10px] font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      {MINI_CALENDAR_ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} className="p-1 flex flex-col items-center">
              {cell.selected ? (
                <div className="bg-blue-500 rounded-full min-w-7 text-center py-0.5 text-white text-[11px] font-semibold">
                  {cell.day}
                </div>
              ) : (
                <div className={`text-[11px] font-semibold ${cell.color === "muted" ? "text-zinc-500" : "text-white"}`}>
                  {cell.day}
                </div>
              )}
              <div className="flex gap-0.5 mt-0.5 min-h-1">
                {cell.dots.map((dot, di) => (
                  <div key={di} className="size-1 rounded-full" style={{ background: dot }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AgendaPanel() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
      {AGENDA_SECTIONS.map((section, idx) => (
        <div key={`${section.label}-${idx}`} className="space-y-1.5">
          {/* Day header */}
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span className={`text-[13px] font-bold ${idx === 0 ? "text-blue-500" : "text-white/70"}`}>
                {section.label}
              </span>
              <span className={`text-[13px] ${idx === 0 ? "text-blue-500" : "text-white/70"}`}>
                {section.date}
              </span>
            </div>
            <span className="text-[13px] text-white/70">{section.weather}</span>
          </div>

          {/* Banners */}
          {section.banners?.map((banner, bi) => (
            <div
              key={bi}
              className="px-1.5 rounded-md inline-flex text-white text-sm leading-5"
              style={{ background: banner.bg }}
            >
              {banner.text}
            </div>
          ))}

          {/* Agenda items */}
          {section.items?.map((item, ii) => (
            <div key={ii} className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full shrink-0" style={{ background: item.dot }} />
                <span className="text-zinc-400 text-[11px] font-semibold">{item.time}</span>
              </div>
              <div className="pl-5 text-white text-xs leading-4">{item.title}</div>
              {item.link && (
                <div className="pl-5 text-zinc-400 text-[11px] truncate">{item.link}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div
      className="flex rounded overflow-hidden text-xs leading-4 min-h-[56px]"
      style={{ background: event.bg }}
    >
      <div className="w-[3px] shrink-0" style={{ background: event.border }} />
      <div className="flex-1 p-1.5 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-1" style={{ color: event.text }}>
          <span>{event.time}</span>
          {event.showDotIcon && (
            <span
              className="size-2 rounded-full shrink-0"
              style={{ background: event.dotBg }}
            />
          )}
        </div>
        <div className="font-semibold truncate" style={{ color: event.text }}>
          {event.title}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────

const MONTH_FULL_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

interface MonthCell {
  day: number;
  isCurrentMonth: boolean;
}

/** Build a 42-cell grid (6 rows × 7 cols) for any month.  Column 0 = Sun. */
function buildMonthGrid(year: number, month: number): MonthCell[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay   = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: MonthCell[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, isCurrentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, isCurrentMonth: true });
  let nd = 1;
  while (cells.length < 42) cells.push({ day: nd++, isCurrentMonth: false });
  return cells;
}

/**
 * Map SEED_EVENTS to February day-of-month.
 * The displayed week is Feb 21 (Sun) – Feb 27 (Sat), so dayIndex 0→21, 1→22 …
 */
const MONTH_EVENT_MAP: Record<number, CalendarEvent[]> = {};
SEED_EVENTS.forEach(e => {
  const date = 21 + e.dayIndex;
  (MONTH_EVENT_MAP[date] ??= []).push(e);
});

// ── View sub-components ──────────────────────────────────────────────────

/** Day view — single-column time grid for one day. */
function DayView({ dayIndex }: { dayIndex: number }) {
  const dateNum  = 21 + dayIndex;
  const dayLabel = WEEKDAY_LABELS[dayIndex];

  return (
    <div className="flex-1 overflow-auto">
      <div>
        {/* Day header */}
        <div className="flex sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="w-14 shrink-0" />
          <div className="flex-1 px-4 py-3 border-l border-gray-200 bg-blue-50">
            <div className="text-zinc-500 text-[10px] font-bold leading-3">{dayLabel}</div>
            <div className="text-black text-2xl leading-8">{dateNum}</div>
          </div>
          <div className="w-14 shrink-0 flex items-center justify-center text-zinc-500 text-xs">
            <span>EST<br />GMT-5</span>
          </div>
        </div>

        {/* Hour rows */}
        {HOURS.map(hour => {
          const cellEvents = eventsAt(dayIndex, hour);
          return (
            <div key={hour} className="flex">
              <div className="w-14 shrink-0 flex items-start justify-end pr-2 pt-1 text-zinc-500 text-xs">
                {formatHour(hour)}
              </div>
              <div className="flex-1 min-h-[72px] border-l border-t border-gray-200 p-1 bg-blue-50/30">
                {cellEvents.map((ev, ei) => (
                  <EventCard key={ei} event={ev} />
                ))}
              </div>
              <div className="w-14 shrink-0 flex items-start justify-start pl-2 pt-1 text-zinc-500 text-xs">
                {formatHour(hour)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Week view — 7-column time grid (the original/default view). */
function WeekView() {
  const weekDates = [21, 22, 23, 24, 25, 26, 27];

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div className="flex sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="w-14 shrink-0" />
          <div className="flex-1 grid grid-cols-7">
            {WEEKDAY_LABELS.map((d, i) => {
              const isThu    = d === "THU";
              const isWeekend = d === "SUN" || d === "SAT";
              return (
                <div
                  key={d}
                  className={`px-2 py-2 border-l border-gray-200 ${
                    isThu ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="text-zinc-500 text-[10px] font-bold leading-3">{d}</div>
                  <div className="text-black text-xl leading-8">{weekDates[i]}</div>
                </div>
              );
            })}
          </div>
          <div className="w-14 shrink-0 flex items-center justify-center text-zinc-500 text-xs">
            <span>EST<br />GMT-5</span>
          </div>
        </div>

        {/* Hour rows */}
        {HOURS.map(hour => (
          <div key={hour} className="flex">
            <div className="w-14 shrink-0 flex items-start justify-end pr-2 pt-1 text-zinc-500 text-xs">
              {formatHour(hour)}
            </div>
            <div className="flex-1 grid grid-cols-7">
              {WEEKDAY_LABELS.map((_d, colIdx) => {
                const isWeekend  = colIdx === 0 || colIdx === 6;
                const isThu      = colIdx === 4;
                const cellEvents = eventsAt(colIdx, hour);
                return (
                  <div
                    key={`${hour}-${colIdx}`}
                    className={`min-h-[72px] border-l border-t border-gray-200 p-0.5 ${
                      isThu ? "bg-blue-50" : isWeekend ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {cellEvents.map((ev, ei) => (
                      <EventCard key={ei} event={ev} />
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="w-14 shrink-0 flex items-start justify-start pl-2 pt-1 text-zinc-500 text-xs">
              {formatHour(hour)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Month view — standard month grid with event chips. */
function MonthView() {
  const cells = buildMonthGrid(2021, 1); // February 2021

  return (
    <div className="flex-1 overflow-auto">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 sticky top-0 z-10 bg-white border-b border-gray-200">
        {WEEKDAY_LABELS.map(d => (
          <div key={d} className="px-2 py-2 text-center border-l first:border-l-0 border-gray-200">
            <span className="text-zinc-500 text-xs font-bold">{d}</span>
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const events    = cell.isCurrentMonth ? (MONTH_EVENT_MAP[cell.day] ?? []) : [];
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          const isToday   = cell.isCurrentMonth && cell.day === 27;

          return (
            <div
              key={i}
              className={`min-h-[100px] border-l first:border-l-0 border-t border-gray-200 p-2 ${
                !cell.isCurrentMonth ? "bg-gray-50" :
                isWeekend            ? "bg-gray-50/60" : "bg-white"
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 inline-flex items-center justify-center ${
                  isToday ? "size-6 rounded-full bg-blue-600 text-white" :
                  cell.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {cell.day}
              </div>
              <div className="space-y-0.5">
                {events.slice(0, 3).map((ev, ei) => (
                  <div
                    key={ei}
                    className="text-[10px] leading-4 px-1.5 rounded truncate"
                    style={{ background: ev.bg, color: ev.text, borderLeft: `2px solid ${ev.border}` }}
                  >
                    {ev.title}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-[10px] text-gray-500 px-1">+{events.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Year view — 12 mini-month grids in a responsive layout. */
function YearView() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {MONTH_FULL_NAMES.map((name, m) => {
          const cells = buildMonthGrid(2021, m);
          return (
            <div key={m} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className={`text-sm font-bold mb-2 ${m === 1 ? "text-blue-600" : "text-gray-900"}`}>
                {name}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {["S","M","T","W","T","F","S"].map((d, di) => (
                  <div key={di} className="text-[9px] text-center text-gray-400 font-semibold py-0.5">{d}</div>
                ))}
                {cells.map((cell, ci) => {
                  const isSelected = m === 1 && cell.isCurrentMonth && cell.day === 27;
                  return (
                    <div
                      key={ci}
                      className={`text-[10px] text-center py-0.5 ${
                        isSelected ? "bg-blue-600 text-white rounded-full" :
                        cell.isCurrentMonth ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Calendar Component ──────────────────────────────────────────────

export default function Calendar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>("Week");
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // THU by default

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoading message="Loading calendar..." />;
  if (error) return <PageError message={error} onRetry={() => setError(null)} />;

  const views: ViewMode[] = ["Day", "Week", "Month", "Year"];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left Panel (mini-calendar + agenda) ── */}
      {panelOpen && (
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 bg-zinc-900 p-4 gap-4 overflow-hidden">
          <MiniCalendar />
          <AgendaPanel />
        </aside>
      )}

      {/* ── Right: Calendar Views ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Toggle panel button (lg+) */}
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="hidden lg:flex items-center justify-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={panelOpen ? "Close side panel" : "Open side panel"}
            >
              {panelOpen ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
            </button>

            {/* Today nav */}
            <div className="flex">
              <button className="px-2 py-1 bg-gray-100 rounded-l-md hover:bg-gray-200 transition-colors" aria-label="Previous">
                <ChevronLeft className="size-4 text-gray-600" />
              </button>
              <button className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Today
              </button>
              <button className="px-2 py-1 bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors" aria-label="Next">
                <ChevronRight className="size-4 text-gray-600" />
              </button>
            </div>

            {/* Day selector (Day view only) */}
            {activeView === "Day" && (
              <div className="hidden sm:flex items-center gap-1 ml-1">
                {WEEKDAY_LABELS.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      i === selectedDayIndex
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View switcher */}
          <div className="flex">
            {views.map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                  activeView === v
                    ? "bg-red-600 text-white"
                    : "text-zinc-500 hover:bg-gray-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center relative w-44">
            <Search className="absolute left-2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              aria-label="Search calendar"
              className="w-full pl-8 pr-3 py-1.5 bg-gray-100 rounded text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* View content */}
        {activeView === "Day"   && <DayView dayIndex={selectedDayIndex} />}
        {activeView === "Week"  && <WeekView />}
        {activeView === "Month" && <MonthView />}
        {activeView === "Year"  && <YearView />}
      </div>
    </div>
  );
}
