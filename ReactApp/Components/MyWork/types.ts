// ── Shared types for MyWork page views ────────────────────────────────────

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "inProgress" | "review" | "completed";

export interface MyWorkTask {
  id: number;
  title: string;
  project: string;
  assignee: string;
  dueDateLabel: string;
  dueOrder: number;
  dueDay?: number;
  priority: Priority;
  status: Status;
  starred?: boolean;
}
