import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

interface NewTaskCardProps {
  onCancel: () => void;
  onCreate?: () => void;
}

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

const inputBase =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-slate-950">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-[18px] w-8 items-center rounded-full border transition-colors ${
        checked ? "bg-blue-600 border-blue-600" : "bg-slate-300 border-slate-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[14px]" : "translate-x-[1px]"
        }`}
      />
    </button>
  );
}

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

  const thisYear = useMemo(() => new Date().getFullYear(), []);

  const addTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || tags.includes(nextTag)) {
      return;
    }
    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
  };

  return (
    <div className="w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
      <div className="px-8 pt-8 pb-5 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">Create New Task</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the details to create a task for your team</p>
      </div>

      <div className="px-8 py-5 space-y-5 overflow-y-auto overscroll-contain">
        <div className="space-y-2">
          <FieldLabel label="Client" required />
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(event) => setSelectedClient(event.target.value)}
              className={`${inputBase} appearance-none pr-10 text-[15px]`}
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
        </div>

        <div className="space-y-2">
          <FieldLabel label="Service" required />
          <div className="relative">
            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className={`${inputBase} appearance-none pr-10 text-[15px]`}
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
        </div>

        <div className="space-y-2">
          <FieldLabel label="Task Period" required />
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTaskPeriod("month")}
              className={`min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                taskPeriod === "month" ? "bg-slate-200 text-slate-950" : "text-slate-700"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTaskPeriod("year")}
              className={`min-w-24 rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                taskPeriod === "year" ? "bg-slate-200 text-slate-950" : "text-slate-700"
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {taskPeriod === "month" ? (
          <div className="space-y-2">
            <FieldLabel label="Select Month" />
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className={`${inputBase} appearance-none pr-10 text-[15px]`}
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
              defaultValue={thisYear}
              className={inputBase}
            />
          </div>
        )}

        <div className="space-y-2">
          <FieldLabel label="Due Date" required />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputBase}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel label="Target Date" />
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className={inputBase}
          />
        </div>

        <hr className="border-slate-200" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Use Client-Specific Settings</p>
            <p className="text-sm text-slate-500">Automatically apply settings from client master</p>
          </div>
          <Toggle checked={useClientSettings} onToggle={() => setUseClientSettings((prev) => !prev)} />
        </div>

        <hr className="border-slate-200" />

        <div className="space-y-2">
          <FieldLabel label="Assign Users" />
          <div className="relative">
            <select
              value={assignedUser}
              onChange={(event) => setAssignedUser(event.target.value)}
              className={`${inputBase} appearance-none pr-10 text-[15px]`}
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

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Is this task billable?</p>
            <p className="text-sm text-slate-500">Enable if this task should be charged to the client</p>
          </div>
          <Toggle checked={isBillable} onToggle={() => setIsBillable((prev) => !prev)} />
        </div>

        <hr className="border-slate-200" />

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
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <hr className="border-slate-200" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-slate-950">Create Document Request</p>
            <p className="text-sm text-slate-500">Request documents from the client for this task</p>
          </div>
          <Toggle checked={createDocumentRequest} onToggle={() => setCreateDocumentRequest((prev) => !prev)} />
        </div>

        <hr className="border-slate-200" />

        <div className="space-y-2">
          <FieldLabel label="Description" />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-slate-300"
            placeholder="Add task notes or instructions..."
          />
        </div>
      </div>

      <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-slate-950 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}
