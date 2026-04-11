// ── Shared types for MyWork page views ────────────────────────────────────

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "inProgress" | "review" | "overdue" | "completed";

export interface MyWorkTask {
  id: number;
  title: string;
  project: string;
  notes?: string;
  assignee: string;
  dueDateLabel: string;
  dueOrder: number;
  dueDay?: number;
  priority: Priority;
  status: Status;
  starred?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatus?: (newStatus: Status) => void;
}
