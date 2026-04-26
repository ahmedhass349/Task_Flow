import { useMemo, useState, useRef, useCallback, type ReactElement } from "react";
import {
  X, ListTodo, AlignLeft, Flag, Calendar, User,
  ChevronDown, Plus, Trash2, Bell, Clock, Mail,
  BellRing, CheckSquare, Square, Sparkles, UploadCloud,
  Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export interface TaskPayload {
  title: string;
  taskType: string;
  customType?: string;
  notes: string;
  course: string;
  dueDate: string;
  semester: string;
  priority: "low" | "medium" | "high";
  reminderEnabled: boolean;
  reminderMap: Record<string, string[]>;
  notifyVia: {
    email: boolean;
    inApp: boolean;
  };
}

interface AcademicTaskCardProps {
  onClose?: () => void;
  onSuccess?: (task: TaskPayload) => Promise<void> | void;
  initialData?: any;
}

type Priority = "Low" | "Medium" | "High" | "Urgent";
type Status = "To Do" | "In Progress" | "In Review" | "Overdue" | "Done";
type ReminderVia = "email" | "notification" | "both";

interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

interface Reminder {
  id: string;
  date: string;
  time: string;
  via: ReminderVia;
}

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];
const STATUSES: Status[] = ["To Do", "In Progress", "In Review", "Overdue", "Done"];

const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; dot: string }> = {
  Low: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
  Medium: { bg: "#fff7ed", text: "#ea580c", dot: "#f97316" },
  High: { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
  Urgent: { bg: "#fdf4ff", text: "#9333ea", dot: "#a855f7" },
};

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  "To Do": { bg: "#f1f5f9", text: "#475569" },
  "In Progress": { bg: "#eff6ff", text: "#3b82f6" },
  "In Review": { bg: "#fefce8", text: "#ca8a04" },
  "Overdue": { bg: "#fef2f2", text: "#dc2626" },
  "Done": { bg: "#f0fdf4", text: "#16a34a" },
};

const VIA_OPTIONS: { id: ReminderVia; label: string; icon: ReactElement }[] = [
  { id: "email", label: "Email", icon: <Mail className="size-3.5" /> },
  { id: "notification", label: "Notification", icon: <BellRing className="size-3.5" /> },
  { id: "both", label: "Both", icon: <Bell className="size-3.5" /> },
];

function toDateTimeLocalInputValue(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayStartDateTimeLocalValue(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const local = new Date(start.getTime() - start.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function DropdownField<T extends string>({
  label, icon, value, options, placeholder, renderOption, onSelect, error, required,
}: {
  label: string;
  icon: ReactElement;
  value: T | "";
  options: readonly T[];
  placeholder: string;
  renderOption?: (o: T) => ReactElement;
  onSelect: (v: T) => void;
  error?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-left"
          style={{ border: error ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb", background: "#fafafa" }}
        >
          <span className="text-gray-400 shrink-0">{icon}</span>
          <span className={`flex-1 text-[13px] ${value ? "text-gray-800" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
          <ChevronDown
            className="size-4 text-gray-400 shrink-0 transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-[10px] overflow-hidden z-20"
            style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onSelect(o); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors"
              >
                {renderOption ? renderOption(o) : (
                  <span className="text-[13px] text-gray-700" style={{ fontWeight: value === o ? 600 : 400 }}>{o}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function ReminderRow({
  reminder, index, onChange, onRemove, minDate, maxDate, dateError, timeError,
}: {
  reminder: Reminder;
  index: number;
  onChange: (id: string, field: "date" | "time" | "via", value: string) => void;
  onRemove: (id: string) => void;
  minDate: string;
  maxDate?: string;
  dateError?: string;
  timeError?: string;
}) {
  return (
    <div
      className="rounded-[10px] p-3 flex flex-col gap-3"
      style={{ background: "#f8fbff", border: "1px solid #dbeafe" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-blue-600" style={{ fontWeight: 600 }}>
          Reminder {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(reminder.id)}
          className="size-5 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="size-3" strokeWidth={2.2} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>Date *</label>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-white"
            style={{ border: "1.5px solid #dbeafe" }}
          >
            <Calendar className="size-3.5 text-blue-400 shrink-0" />
            <input
              type="date"
              value={reminder.date}
              onChange={(e) => onChange(reminder.id, "date", e.target.value)}
              min={minDate}
              max={maxDate}
              className="flex-1 bg-transparent outline-none text-[12px] text-gray-800"
              style={{ colorScheme: "light" }}
            />
          </div>
          {dateError && <p className="text-[11px] text-red-500">{dateError}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>Time *</label>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-white"
            style={{ border: "1.5px solid #dbeafe" }}
          >
            <Clock className="size-3.5 text-blue-400 shrink-0" />
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => onChange(reminder.id, "time", e.target.value)}
              className="flex-1 bg-transparent outline-none text-[12px] text-gray-800"
              style={{ colorScheme: "light" }}
            />
          </div>
          {timeError && <p className="text-[11px] text-red-500">{timeError}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>Remind via</label>
        <div className="flex items-center gap-2">
          {VIA_OPTIONS.map(({ id, label, icon }) => {
            const active = reminder.via === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(reminder.id, "via", id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[11px] transition-all flex-1 justify-center"
                style={{
                  fontWeight: 500,
                  background: active ? "#3b82f6" : "white",
                  color: active ? "white" : "#6b7280",
                  border: active ? "1.5px solid #3b82f6" : "1.5px solid #e5e7eb",
                  boxShadow: active ? "0 2px 8px rgba(59,130,246,0.25)" : undefined,
                }}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AcademicTaskCard({ onClose, onSuccess, initialData }: AcademicTaskCardProps) {
  const { addToast } = useToast();
  const isEditMode = Boolean(initialData?.id);

  // ── Smart Auto Fill state ───────────────────────────────────────────────
  const [smartFillOpen, setSmartFillOpen] = useState(false);
  const [smartFillLoading, setSmartFillLoading] = useState(false);
  const [smartFillError, setSmartFillError] = useState<string | null>(null);
  const [smartFillCount, setSmartFillCount] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const smartFillInputRef = useRef<HTMLInputElement>(null);

  const handleSmartFillFile = useCallback(async (file: File) => {
    const allowed = file.type.startsWith("image/") || file.type === "application/pdf";
    if (!allowed) {
      setSmartFillError("Only images (PNG, JPG, WEBP) and PDF files are supported.");
      return;
    }
    setSmartFillError(null);
    setSmartFillCount(null);
    setSmartFillLoading(true);

    try {
      const fileBase64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          const commaIdx = result.indexOf(",");
          resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      });

      const fields = await api.post<{ title?: string; description?: string; priority?: string; dueDate?: string; assignee?: string; subtasks?: string[] }>(
        "/api/tasks/smart-fill",
        { fileBase64, mimeType: file.type }
      ) ?? {};
      let filled = 0;

      if (fields.title?.trim()) { setTitle(fields.title.trim()); setErrors(p => ({ ...p, title: "" })); filled++; }
      if (fields.description?.trim()) { setDescription(fields.description.trim()); filled++; }
      if (fields.priority) {
        const p = fields.priority as Priority;
        if (["Low", "Medium", "High", "Urgent"].includes(p)) { setPriority(p); setErrors(p2 => ({ ...p2, priority: "" })); filled++; }
      }
      if (fields.dueDate?.trim()) {
        const converted = toDateTimeLocalInputValue(fields.dueDate.trim());
        if (converted) { setDue(converted); filled++; }
      }
      if (fields.assignee?.trim()) { setAssignee(fields.assignee.trim()); filled++; }
      if (Array.isArray(fields.subtasks) && fields.subtasks.length > 0) {
        const newSubtasks = fields.subtasks
          .map(t => t?.trim())
          .filter((t): t is string => !!t)
          .map(text => ({ id: `st-${Date.now()}-${Math.random()}`, text, done: false }));
        if (newSubtasks.length > 0) { setSubtasks(prev => [...prev, ...newSubtasks]); filled++; }
      }

      setSmartFillCount(filled);
      if (filled === 0) {
        setSmartFillError("No task details could be extracted from this file. Try a different document.");
      }
    } catch {
      setSmartFillError("Scanning failed. Please check your connection and try again.");
    } finally {
      setSmartFillLoading(false);
    }
  }, []);

  const handleSmartFillInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSmartFillFile(file);
    e.target.value = "";
  }, [handleSmartFillFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSmartFillFile(file);
  }, [handleSmartFillFile]);
  // ── End Smart Auto Fill state ─────────────────────────────────────────

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.notes || "");
  const [priority, setPriority] = useState<Priority>(() => {
    const p = String(initialData?.priority || "").toLowerCase();
    if (p === "low") return "Low";
    if (p === "high") return "High";
    return "Medium";
  });
  const [status, setStatus] = useState<Status>(() => {
    const raw = String(initialData?.status || "").toLowerCase();
    if (raw === "inprogress" || raw === "in progress") return "In Progress";
    if (raw === "review" || raw === "in review") return "In Review";
    if (raw === "overdue") return "Overdue";
    if (raw === "completed" || raw === "done") return "Done";
    return "To Do";
  });
  const [due, setDue] = useState(toDateTimeLocalInputValue(initialData?.dueDate));
  const [assignee, setAssignee] = useState(initialData?.assignee || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doneCount = useMemo(() => subtasks.filter((s) => s.done).length, [subtasks]);

  function addSubtask() {
    const text = subtaskInput.trim();
    if (!text) return;
    setSubtasks((prev) => [...prev, { id: `st-${Date.now()}`, text, done: false }]);
    setSubtaskInput("");
  }

  function toggleSubtask(id: string) {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function addReminder() {
    setReminders((prev) => [
      ...prev,
      { id: `rem-${Date.now()}`, date: "", time: "", via: "notification" },
    ]);
  }

  function updateReminder(id: string, field: "date" | "time" | "via", value: string) {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function removeReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function validate() {
    const e: Record<string, string> = {};
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!title.trim()) e.title = "Task title is required.";
    if (!priority) e.priority = "Please select a priority.";
    if (!status) e.status = "Please select a status.";

    if (due) {
      const dueDate = new Date(due);
      if (dueDate < todayStart) {
        e.due = "Due date cannot be before today.";
      }
    }

    reminders.forEach((r, i) => {
      if (!r.date) e[`rem_date_${i}`] = "required";
      if (!r.time) e[`rem_time_${i}`] = "required";

      if (r.date) {
        const reminderDay = new Date(`${r.date}T00:00`);
        if (reminderDay < todayStart) {
          e[`rem_date_${i}`] = "Reminder date cannot be before today.";
        }
      }

      if (r.date && r.time) {
        const reminderAt = new Date(`${r.date}T${r.time}`);
        if (reminderAt <= now) {
          e[`rem_time_${i}`] = "Reminder time must be in the future.";
        }

        if (due) {
          const dueAt = new Date(due);
          if (reminderAt > dueAt) {
            e[`rem_time_${i}`] = "Reminder cannot be after the due date/time.";
          }
        }
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const notesWithSubtasks = [description.trim()]
      .concat(
        subtasks.length
          ? ["", "Subtasks:", ...subtasks.map((s) => `- [${s.done ? "x" : " "}] ${s.text}`)]
          : []
      )
      .join("\n")
      .trim();

    const reminderMap = reminders.reduce<Record<string, string[]>>((acc, r) => {
      if (!r.date || !r.time) return acc;
      if (!acc[r.date]) acc[r.date] = [];
      acc[r.date].push(r.time);
      return acc;
    }, {});

    const notifyEmail = reminders.some((r) => r.via === "email" || r.via === "both");
    const notifyInApp = reminders.some((r) => r.via === "notification" || r.via === "both");

    const payload: TaskPayload = {
      title: title.trim(),
      taskType: status,
      customType: undefined,
      notes: notesWithSubtasks,
      course: assignee.trim(),
      dueDate: due,
      semester: "Spring 2026",
      priority: priority === "Urgent" ? "high" : (priority.toLowerCase() as "low" | "medium" | "high"),
      reminderEnabled: reminders.length > 0,
      reminderMap,
      notifyVia: { email: notifyEmail, inApp: notifyInApp },
    };

    try {
      setIsSubmitting(true);
      await onSuccess?.(payload);

      addToast({
        type: "success",
        title: isEditMode ? "Task Updated" : "Task Created",
        message: isEditMode
          ? `"${payload.title}" was updated successfully.`
          : `"${payload.title}" was added to your board as ${status}.`,
        duration: 5000,
      });

      if (reminders.length > 0) {
        addToast({
          type: "info",
          title: `${reminders.length} Reminder${reminders.length > 1 ? "s" : ""} Set`,
          message: reminders.map((r) => `${r.date} at ${r.time} via ${r.via}`).join(" · "),
          duration: 5000,
        });
      }

      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="w-full max-w-[560px] rounded-[20px] bg-white shadow-2xl flex flex-col max-h-[92vh]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center justify-between px-7 pt-7 pb-5 shrink-0" style={{ borderBottom: "1px solid #f0f1f5" }}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-[10px] bg-blue-50 flex items-center justify-center">
            <ListTodo className="size-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-[17px] text-gray-900" style={{ fontWeight: 700 }}>{initialData ? "Edit Task" : "Create New Task"}</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">Fill in the details to add a task to your board</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="size-4" strokeWidth={2.2} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const target = e.target as HTMLElement;
          const tag = target.tagName.toLowerCase();
          if (tag === "textarea" || tag === "button") return;
          e.preventDefault();
        }}
        className="flex flex-col overflow-y-auto"
      >
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* ── Smart Auto Fill Zone ─────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { setSmartFillOpen(o => !o); setSmartFillError(null); setSmartFillCount(null); }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] border border-dashed transition-all w-full text-left group"
              style={{
                borderColor: smartFillOpen ? "#10b981" : "#a7f3d0",
                background: smartFillOpen ? "linear-gradient(135deg,#ecfdf5,#f0fdf4)" : "#f9fef9",
              }}
            >
              <span
                className="size-7 rounded-[8px] flex items-center justify-center shrink-0 transition-colors"
                style={{ background: smartFillOpen ? "#10b981" : "#d1fae5" }}
              >
                <Sparkles className="size-3.5" style={{ color: smartFillOpen ? "#fff" : "#10b981" }} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-emerald-800">Smart Auto Fill</p>
                <p className="text-[11px] text-emerald-600 leading-tight">AI-powered · scan a document or image to auto-fill fields</p>
              </div>
              <ChevronDown
                className="size-4 text-emerald-500 shrink-0 transition-transform"
                style={{ transform: smartFillOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {smartFillOpen && (
              <div
                className="rounded-[12px] overflow-hidden"
                style={{ border: "1.5px solid #a7f3d0", background: "linear-gradient(180deg,#f0fdf4 0%,#fff 100%)" }}
              >
                {/* Hidden file input */}
                <input
                  ref={smartFillInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleSmartFillInputChange}
                />

                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !smartFillLoading && smartFillInputRef.current?.click()}
                  className="m-3 rounded-[10px] flex flex-col items-center justify-center gap-3 py-7 cursor-pointer transition-all"
                  style={{
                    border: isDragOver
                      ? "2px dashed #10b981"
                      : "2px dashed #6ee7b7",
                    background: isDragOver ? "rgba(16,185,129,0.07)" : "rgba(236,253,245,0.6)",
                    cursor: smartFillLoading ? "not-allowed" : "pointer",
                    opacity: smartFillLoading ? 0.7 : 1,
                  }}
                >
                  {smartFillLoading ? (
                    <>
                      <Loader2 className="size-8 text-emerald-500 animate-spin" />
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-emerald-700">Analyzing with AI Scanner…</p>
                        <p className="text-[11px] text-emerald-500 mt-0.5">Extracting task details from your document</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="size-12 rounded-full flex items-center justify-center"
                        style={{ background: isDragOver ? "rgba(16,185,129,0.15)" : "#d1fae5" }}
                      >
                        <UploadCloud className="size-6" style={{ color: isDragOver ? "#059669" : "#10b981" }} />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-[13px] font-semibold text-emerald-800">
                          {isDragOver ? "Drop to scan" : "Drop a file or click to browse"}
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-0.5">
                          Supports PDF &amp; images · Fields are filled automatically
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Success banner */}
                {smartFillCount !== null && smartFillCount > 0 && !smartFillLoading && (
                  <div
                    className="mx-3 mb-3 px-4 py-2.5 rounded-[8px] flex items-center gap-2.5"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                  >
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <p className="text-[12px] text-emerald-700 font-medium">
                      {smartFillCount} field{smartFillCount !== 1 ? "s" : ""} auto-filled from your document
                    </p>
                    <button
                      type="button"
                      onClick={() => setSmartFillCount(null)}
                      className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Error banner */}
                {smartFillError && !smartFillLoading && (
                  <div
                    className="mx-3 mb-3 px-4 py-2.5 rounded-[8px] flex items-center gap-2.5"
                    style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                  >
                    <AlertCircle className="size-4 text-red-400 shrink-0" />
                    <p className="text-[12px] text-red-600">{smartFillError}</p>
                    <button
                      type="button"
                      onClick={() => setSmartFillError(null)}
                      className="ml-auto text-red-300 hover:text-red-500 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* ── End Smart Auto Fill Zone ──────────────────────────────── */}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-[10px]"
              style={{ border: errors.title ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb", background: "#fafafa" }}
            >
              <ListTodo className="size-4 text-gray-400 shrink-0" />
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                placeholder="e.g. Design the onboarding flow"
                className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
              />
            </div>
            {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>Description</label>
            <div className="flex gap-3 px-4 py-3 rounded-[10px]" style={{ border: "1.5px solid #e5e7eb", background: "#fafafa" }}>
              <AlignLeft className="size-4 text-gray-400 shrink-0 mt-0.5" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional — add more context about this task..."
                rows={2}
                className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DropdownField
              label="Priority"
              required
              icon={<Flag className="size-4" />}
              value={priority}
              options={PRIORITIES}
              placeholder="Select priority"
              renderOption={(o) => (
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full shrink-0" style={{ background: PRIORITY_COLORS[o].dot }} />
                  <span className="text-[13px] px-2 py-0.5 rounded-full" style={{ background: PRIORITY_COLORS[o].bg, color: PRIORITY_COLORS[o].text, fontWeight: 500 }}>
                    {o}
                  </span>
                </div>
              )}
              onSelect={(v) => { setPriority(v); setErrors((p) => ({ ...p, priority: "" })); }}
              error={errors.priority}
            />

            <DropdownField
              label="Status"
              required
              icon={<ListTodo className="size-4" />}
              value={status}
              options={STATUSES}
              placeholder="Select status"
              renderOption={(o) => (
                <span className="text-[13px] px-2.5 py-0.5 rounded-full" style={{ background: STATUS_COLORS[o].bg, color: STATUS_COLORS[o].text, fontWeight: 500 }}>
                  {o}
                </span>
              )}
              onSelect={(v) => { setStatus(v); setErrors((p) => ({ ...p, status: "" })); }}
              error={errors.status}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>Due Date</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-[10px]" style={{ border: "1.5px solid #e5e7eb", background: "#fafafa" }}>
                <Calendar className="size-4 text-gray-400 shrink-0" />
                <input
                    type="datetime-local"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                    min={getTodayStartDateTimeLocalValue()}
                  className="flex-1 bg-transparent outline-none text-[13px] text-gray-800"
                  style={{ colorScheme: "light" }}
                />
              </div>
                {errors.due && <p className="text-[11px] text-red-500">{errors.due}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>Assignee</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-[10px]" style={{ border: "1.5px solid #e5e7eb", background: "#fafafa" }}>
                <User className="size-4 text-gray-400 shrink-0" />
                <input
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>
              Subtasks
              {subtasks.length > 0 && (
                <span className="ml-2 text-[11px] text-gray-400" style={{ fontWeight: 400 }}>
                  {doneCount}/{subtasks.length} done
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-[10px]" style={{ border: "1.5px solid #e5e7eb", background: "#fafafa" }}>
                <Plus className="size-3.5 text-gray-400 shrink-0" />
                <input
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                  placeholder="Add a subtask and press Enter..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <button
                type="button"
                onClick={addSubtask}
                disabled={!subtaskInput.trim()}
                className="size-[38px] rounded-[10px] bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              >
                <Plus className="size-4 text-white" />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="flex flex-col rounded-[10px] overflow-hidden" style={{ border: "1.5px solid #e5e7eb", background: "#fafafa" }}>
                {subtasks.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2.5 group transition-colors hover:bg-blue-50"
                    style={{ borderTop: i > 0 ? "1px solid #f0f1f5" : undefined }}
                  >
                    <button type="button" onClick={() => toggleSubtask(s.id)} className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors">
                      {s.done ? <CheckSquare className="size-4 text-blue-500" /> : <Square className="size-4" />}
                    </button>
                    <span className="flex-1 text-[13px]" style={{ textDecoration: s.done ? "line-through" : "none", color: s.done ? "#9ca3af" : "#374151" }}>
                      {s.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(s.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] text-gray-700" style={{ fontWeight: 500 }}>
                Reminders
                {reminders.length > 0 && (
                  <span className="ml-2 text-[11px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                    {reminders.length} set
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={addReminder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Plus className="size-3.5" />
                Add Reminder
              </button>
            </div>

            {reminders.length === 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-[10px]" style={{ border: "1.5px dashed #dbeafe", background: "#f8fbff" }}>
                <Bell className="size-4 text-blue-300 shrink-0" />
                <p className="text-[12px] text-gray-400">No reminders set — click Add Reminder to schedule one.</p>
              </div>
            )}

            {reminders.length > 0 && (
              <div className="flex flex-col gap-2">
                {reminders.map((r, i) => (
                  <ReminderRow
                    key={r.id}
                    reminder={r}
                    index={i}
                    onChange={updateReminder}
                    onRemove={removeReminder}
                    minDate={getTodayDateInputValue()}
                    maxDate={due ? due.slice(0, 10) : undefined}
                    dateError={errors[`rem_date_${i}`]}
                    timeError={errors[`rem_time_${i}`]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 px-7 pb-7 pt-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            <ListTodo className="size-4" />
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Task" : "Create Task")}
          </button>
        </div>
      </form>
    </div>
  );
}
