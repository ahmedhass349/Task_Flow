// ── Shared TypeScript interfaces for Task Flow ──────────────────────────

// ── Auth ─────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  company?: string;
  country?: string;
  phone?: string;
  timezone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  country?: string;
  phone?: string;
  timezone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email?: string;
  avatarUrl?: string;
  company?: string;
  country?: string;
  phone?: string;
  timezone?: string;
}

// ── Tasks ────────────────────────────────────────────────────────────────

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "to-do" | "in-progress" | "in-review" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  projectName?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatarUrl?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
}

// ── Projects ─────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  memberCount: number;
  taskCount: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Teams ────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "lead" | "member" | "viewer";
  status: "active" | "invited" | "inactive";
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  members: TeamMember[];
  createdAt: string;
}

// ── Notifications ────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: "task-completed" | "mention" | "project-created" | "deadline" | "task-assigned";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  createdAt: string;
}

// ── Filters ──────────────────────────────────────────────────────────────

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, unknown>;
  isShared: boolean;
  createdAt: string;
}

// ── Calendar Events ──────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
  allDay?: boolean;
  description?: string;
}

// ── Messages ─────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participants: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
}

// ── Settings ─────────────────────────────────────────────────────────────

export interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    timezone?: string;
    language?: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    taskReminders: boolean;
    weeklyDigest: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    compactMode: boolean;
  };
}

// ── API Response Wrappers ────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
