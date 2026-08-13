// ── useTasks Hook ────────────────────────────────────────────────────────
//
// Custom hook for fetching and managing tasks.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, extractErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Task interface matching backend TaskDto
export interface Task {
  id: number;
  title: string;
  description?: string;
  projectName?: string;
  assigneeName?: string;
  assignedById?: number;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "InProgress" | "Review" | "Completed" | "Overdue";
  dueDate?: string;
  dueDateLabel?: string;
  isStarred: boolean;
  /** true when this task was assigned by a leader, not self-created */
  isAssignedByOther: boolean;
  createdAt: string;
}

// Hook return type
interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  toggleStar: (id: number) => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// Request types for CRUD operations
interface ReminderMap {
  [dateKey: string]: string[];
}

interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId?: number;
  assigneeId?: number;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "InProgress" | "Review" | "Completed" | "Overdue";
  dueDate?: string;
  reminderMap?: ReminderMap;
  notifyEmail?: boolean;
  notifyInApp?: boolean;
}

interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: number;
  priority?: "Low" | "Medium" | "High";
  status?: "Todo" | "InProgress" | "Review" | "Completed" | "Overdue";
  dueDate?: string;
  reminderMap?: ReminderMap;
  notifyEmail?: boolean;
  notifyInApp?: boolean;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Task[]>("/api/tasks");
      setTasks(data ?? []);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load tasks"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStar = useCallback(async (id: number) => {
    try {
      await api.patch(`/api/tasks/${id}/star`);
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, isStarred: !task.isStarred } : task
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to toggle task star"));
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await api.patch(`/api/tasks/${id}/status`, { status });
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, status: status as Task["status"] } : task
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to update task status"));
      throw err;
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      await api.post<Task>("/api/tasks", data);
      await fetchData();
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to create task"));
      throw err;
    }
  }, [fetchData]);

  const updateTask = useCallback(async (id: number, data: UpdateTaskRequest) => {
    try {
      const updatedTask = await api.put<Task>(`/api/tasks/${id}`, data);
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to update task"));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete task"));
      throw err;
    }
  }, []);

  const { isInitialized, isAuthenticated } = useAuth();

  useEffect(() => {
    // Guard: do not fetch until auth state is initialized from storage.
    // Without this guard, the effect fires on mount before localStorage
    // has been read, so the token would be missing, and the request gets 401.
    if (!isInitialized) return;

    // Guard: if not authenticated, skip API call (avoid 401 on public pages)
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api.get<Task[]>("/api/tasks")
      .then(data => { if (!cancelled) setTasks(data ?? []); })
      .catch((err: unknown) => {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load tasks"));
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [isInitialized, isAuthenticated]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchData,
    toggleStar,
    updateStatus,
    createTask,
    updateTask,
    deleteTask,
  };
};
