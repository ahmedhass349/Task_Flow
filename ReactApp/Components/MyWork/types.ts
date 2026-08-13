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
  assignedById?: number;
  /** Phase 4: true when task was created by a leader, not self-created */
  isAssignedByOther?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatus?: (newStatus: Status) => void;
}
