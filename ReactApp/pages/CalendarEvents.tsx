/*
  FILE: ReactApp/pages/CalendarEvents.tsx
  PHASE: 6
  MISSION: 6-Scan
  CHANGES:
    - New page: full calendar view backed by /api/calendar-events.
    - Monthly grid with event chips per day, create/edit/delete modal.
    - Semantic theme tokens (bg-background, etc.) — no hardcoded light colors.
*/
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { PageLoading, PageError } from "../Components/PageState";
import { api } from "../services/api";

// ── Types ──────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  color: string;
  meetingLink?: string;
  createdAt: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f59e0b", "#10b981", "#3b82f6", "#14b8a6",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function toLocalDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toLocalDateTimeLocal(iso: string) {
  // Convert ISO to "YYYY-MM-DDTHH:MM" for <input type="datetime-local">
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Empty form state ───────────────────────────────────────────────────────
const emptyForm = () => ({
  title: "",
  description: "",
  startAt: "",
  endAt: "",
  color: DEFAULT_COLORS[0],
  meetingLink: "",
});

// ── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps {
  event: CalendarEvent | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: number) => void;
}

function EventModal({ event, defaultDate, onClose, onSave, onDelete }: ModalProps) {
  const isEdit = !!event;
  const [form, setForm] = useState(() => {
    if (event) {
      return {
        title: event.title,
        description: event.description ?? "",
        startAt: toLocalDateTimeLocal(event.startAt),
        endAt: toLocalDateTimeLocal(event.endAt),
        color: event.color,
        meetingLink: event.meetingLink ?? "",
      };
    }
    const base = defaultDate ? `${defaultDate}T09:00` : "";
    const end  = defaultDate ? `${defaultDate}T10:00` : "";
    return { ...emptyForm(), startAt: base, endAt: end };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.startAt || !form.endAt) { setError("Start and end times are required"); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        startAt: new Date(form.startAt).toISOString(),
        endAt:   new Date(form.endAt).toISOString(),
      };
      let saved: CalendarEvent;
      if (isEdit && event) {
        saved = await api.put<CalendarEvent>(`/api/calendar-events/${event.id}`, payload);
      } else {
        saved = await api.post<CalendarEvent>("/api/calendar-events", payload);
      }
      onSave(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/calendar-events/${event.id}`);
      onDelete(event.id);
    } catch {
      setError("Failed to delete event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {isEdit ? "Edit Event" : "New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
            />
          </div>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={form.startAt}
                onChange={e => setForm(f => ({ ...f, startAt: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={form.endAt}
                onChange={e => setForm(f => ({ ...f, endAt: e.target.value }))}
              />
            </div>
          </div>

          {/* Meeting link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting link (optional)</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.meetingLink}
              onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`size-7 rounded-full border-2 transition-transform ${form.color === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between pt-2">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : <span />}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
              >
                {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CalendarEvents() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents]  = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent]     = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate]       = useState<string | undefined>(undefined);

  // ── Fetch events for the visible month ──────────────────────────────────
  const fetchEvents = useCallback(async (y: number, m: number) => {
    setLoading(true);
    setFetchError(null);
    const from = new Date(y, m, 1).toISOString();
    const to   = new Date(y, m + 1, 0, 23, 59, 59).toISOString();
    try {
      const data = await api.get<CalendarEvent[]>(
        `/api/calendar-events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      setEvents(data ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(year, month); }, [year, month, fetchEvents]);

  // ── Calendar grid helpers ────────────────────────────────────────────────
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth     = new Date(year, month + 1, 0).getDate();

  // Build 42-cell grid (6 rows × 7 cols)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const todayStr = toLocalDateString(today);

  const eventsOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.startAt.slice(0, 10) === dateStr);
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  // ── Modal handlers ──────────────────────────────────────────────────────
  const openCreate = (day?: number) => {
    setEditingEvent(null);
    setDefaultDate(day
      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      : undefined
    );
    setModalOpen(true);
  };

  const openEdit = (e: CalendarEvent) => {
    setEditingEvent(e);
    setDefaultDate(undefined);
    setModalOpen(true);
  };

  const handleSave = (saved: CalendarEvent) => {
    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setModalOpen(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageLoading message="Loading calendar…" />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageError message={fetchError} onRetry={() => fetchEvents(year, month)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 w-full">
          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 min-w-[180px] text-center">
                {MONTH_NAMES[month]} {year}
              </h1>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => openCreate()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} /> New event
            </button>
          </div>

          {/* ── Calendar grid ── */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Day-name header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {DAY_NAMES.map(d => (
                <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                const cellDate = day
                  ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : null;
                const isToday = cellDate === todayStr;
                const dayEvents = day ? eventsOnDay(day) : [];

                return (
                  <div
                    key={idx}
                    className={`min-h-[110px] border-b border-r border-gray-100 p-2 ${
                      day ? "cursor-pointer hover:bg-gray-50 transition-colors" : "bg-gray-50/50"
                    }`}
                    onClick={() => day && openCreate(day)}
                  >
                    {day && (
                      <>
                        <span className={`inline-flex items-center justify-center size-7 text-sm font-medium rounded-full mb-1 ${
                          isToday
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}>
                          {day}
                        </span>

                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 3).map(ev => (
                            <button
                              key={ev.id}
                              onClick={e => { e.stopPropagation(); openEdit(ev); }}
                              title={ev.title}
                              className="w-full text-left text-xs px-1.5 py-0.5 rounded font-medium truncate transition-opacity hover:opacity-80"
                              style={{ background: ev.color + "22", color: ev.color, borderLeft: `3px solid ${ev.color}` }}
                            >
                              {formatTime(ev.startAt)} {ev.title}
                            </button>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[10px] text-gray-400 px-1.5">
                              +{dayEvents.length - 3} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <EventModal
          event={editingEvent}
          defaultDate={defaultDate}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
