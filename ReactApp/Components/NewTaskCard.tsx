import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

// ── Exported data type for the created task ──────────────────────────────

export interface NewTaskData {
  client: string;
  service: string;
  taskPeriod: "month" | "year";
  selectedMonth: string;
  selectedYear: number;
  dueDate: string;
  targetDate: string;
  assignedUser: string;
  description: string;
  tags: string[];
  useClientSettings: boolean;
  isBillable: boolean;
  createDocumentRequest: boolean;
}

// ── Props ────────────────────────────────────────────────────────────────

interface NewTaskCardProps {
  onCancel: () => void;
  onCreate: (data: NewTaskData) => void;
}

// ── Validation ───────────────────────────────────────────────────────────

interface FormErrors {
  client?: string;
  service?: string;
  dueDate?: string;
}

function validateForm(client: string, service: string, dueDate: string): FormErrors {
  const errors: FormErrors = {};

  if (!client) {
    errors.client = "Client is required";
  }

  if (!service) {
    errors.service = "Service is required";
  }

  if (!dueDate) {
    errors.dueDate = "Due date is required";
  }

  return errors;
}

// ── Static data ──────────────────────────────────────────────────────────

const clients = ["Acme Corp", "Northwind", "Fabrikam", "Globex"];
const services = ["Bookkeeping", "Tax Filing", "Payroll", "Advisory"];
const users = ["Sarah Chen", "Mike Johnson", "Alex Kim", "Demo User"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ── Shared styles ────────────────────────────────────────────────────────

const inputBase =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const inputNormal = `${inputBase} border-slate-300`;
const inputError = `${inputBase} border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-100`;

// ── Sub-components ───────────────────────────────────────────────────────

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-slate-950">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}

function Toggle({ checked, onToggle, disabled, label }: { checked: boolean; onToggle: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-[18px] w-8 items-center rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-blue-600 border-blue-600" : "bg-slate-300 border-slate-300"
      }`}
      aria-pressed={checked}
      aria-label={label}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[14px]" : "translate-x-[1px]"
        }`}
      />
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export default function NewTaskCard({ onCancel, onCreate }: NewTaskCardProps) {
  const [taskPeriod, setTaskPeriod] = useState<"month" | "year">("month");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [description, setDescription] = useState("");

  const [useClientSettings, setUseClientSettings] = useState(false);
  const [isBillable, setIsBillable] = useState(false);
  const [createDocumentRequest, setCreateDocumentRequest] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const thisYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedYear, setSelectedYear] = useState(thisYear);

  const addTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || tags.includes(nextTag)) {
      return;
    }
    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleCreate = () => {
    // Validate required fields
    const errors = validateForm(selectedClient, selectedService, dueDate);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    const taskData: NewTaskData = {
      client: selectedClient,
      service: selectedService,
      taskPeriod,
      selectedMonth,
      selectedYear,
      dueDate,
      targetDate,
      assignedUser,
      description: description.trim(),
      tags,
      useClientSettings,
      isBillable,
      createDocumentRequest,
    };

    onCreate(taskData);
  };

  // Helper to clear a specific field error when the user interacts
  const clearFieldError = (field: keyof FormErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
      <div className="px-8 pt-8 pb-5 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">Create New Task</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the details to create a task for your team</p>
      </div>

      <div className="px-8 py-5 space-y-5 overflow-y-auto overscroll-contain">
        {/* Client (required) */}
        <div className="space-y-2">
          <FieldLabel label="Client" required />
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(event) => {
                setSelectedClient(event.target.value);
                clearFieldError("client");
              }}
              className={`${fieldErrors.client ? inputError : inputNormal} appearance-none pr-10 text-[15px]`}
              disabled={isSubmitting}
            >
              <option value="">Select clients...</option>
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <FieldError message={fieldErrors.client} />
        </div>

        {/* Service (required) */}
        <div className="space-y-2">
          <FieldLabel label="Service" required />
          <div className="relative">
            <select
              value={selectedService}
              onChange={(event) => {
                setSelectedService(event.target.value);
                clearFieldError("service");
              }}
              className={`${fieldErrors.service ? inputError : inputNormal} appearance-none pr-10 text-[15px]`}
              disabled={isSubmitting}
            >
              <option value="">Select service...</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <FieldError message={fieldErrors.service} />
        </div>

        {/* Task Period */}
        <div className="space-y-2">
          <FieldLabel label="Task Period" required />
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTaskPeriod("month")}
              disabled={isSubmitting}
              className={`min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                taskPeriod === "month" ? "bg-slate-200 text-slate-950" : "text-slate-700"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTaskPeriod("year")}
              disabled={isSubmitting}
              className={`min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                taskPeriod === "year" ? "bg-slate-200 text-slate-950" : "text-slate-700"
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Month / Year selection */}
        {taskPeriod === "month" ? (
          <div className="space-y-2">
            <FieldLabel label="Select Month" />
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className={`${inputNormal} appearance-none pr-10 text-[15px]`}
                disabled={isSubmitting}
              >
                <option value="">Pick a month...</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <FieldLabel label="Select Year" />
            <input
              type="number"
              min={thisYear}
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className={inputNormal}
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Due Date (required) */}
        <div className="space-y-2">
          <FieldLabel label="Due Date" required />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
              clearFieldError("dueDate");
            }}
            className={fieldErrors.dueDate ? inputError : inputNormal}
            disabled={isSubmitting}
          />
          <FieldError message={fieldErrors.dueDate} />
        </div>

        {/* Target Date */}
        <div className="space-y-2">
          <FieldLabel label="Target Date" />
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className={inputNormal}
            disabled={isSubmitting}
          />
        </div>

        <hr className="border-slate-200" />

        {/* Use Client Settings toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Use Client-Specific Settings</p>
            <p className="text-sm text-slate-500">Automatically apply settings from client master</p>
          </div>
          <Toggle checked={useClientSettings} onToggle={() => setUseClientSettings((prev) => !prev)} disabled={isSubmitting} label="Use client-specific settings" />
        </div>

        <hr className="border-slate-200" />

        {/* Assign Users */}
        <div className="space-y-2">
          <FieldLabel label="Assign Users" />
          <div className="relative">
            <select
              value={assignedUser}
              onChange={(event) => setAssignedUser(event.target.value)}
              className={`${inputNormal} appearance-none pr-10 text-[15px]`}
              disabled={isSubmitting}
            >
              <option value="">Select users...</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Billable toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Is this task billable?</p>
            <p className="text-sm text-slate-500">Enable if this task should be charged to the client</p>
          </div>
          <Toggle checked={isBillable} onToggle={() => setIsBillable((prev) => !prev)} disabled={isSubmitting} label="Is this task billable" />
        </div>

        <hr className="border-slate-200" />

        {/* Tags */}
        <div className="space-y-2">
          <FieldLabel label="Tags" />
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300"
              placeholder="Add a tag..."
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isSubmitting}
                    className="ml-0.5 text-blue-400 hover:text-blue-700 disabled:opacity-50"
                    aria-label={`Remove tag ${tag}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <hr className="border-slate-200" />

        {/* Document Request toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Create Document Request</p>
            <p className="text-sm text-slate-500">Request documents from the client for this task</p>
          </div>
          <Toggle checked={createDocumentRequest} onToggle={() => setCreateDocumentRequest((prev) => !prev)} disabled={isSubmitting} label="Create document request" />
        </div>

        <hr className="border-slate-200" />

        {/* Description */}
        <div className="space-y-2">
          <FieldLabel label="Description" />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300"
            placeholder="Add task notes or instructions..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSubmitting}
          className="rounded-lg bg-slate-950 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? "Creating..." : "Create Task"}
          {isSubmitting && (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
        </button>
      </div>
    </div>
  );
}
