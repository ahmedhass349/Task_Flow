// ── useTasks Hook ────────────────────────────────────────────────────────
//
// Custom hook for fetching and managing tasks.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Task interface matching backend TaskDto
interface Task {
  id: number;
  title: string;
  description?: string;
  projectName?: string;
  assigneeName?: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "InProgress" | "Review" | "Completed";
  dueDate?: string;
  dueDateLabel?: string;
  isStarred: boolean;
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
  status: "Todo" | "InProgress" | "Review" | "Completed";
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
  status?: "Todo" | "InProgress" | "Review" | "Completed";
  dueDate?: string;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Task[]>("/api/tasks");
      if (!cancelled) {
        setTasks(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load tasks";
        setError(message);
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleStar = useCallback(async (id: number) => {
    try {
      await api.patch(`/api/tasks/${id}/star`);
      // Update local state to reflect change
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, isStarred: !task.isStarred } : task
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to toggle task star";
      setError(message);
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await api.patch(`/api/tasks/${id}/status`, { status });
      // Update local state to reflect change
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, status: status as any } : task
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update task status";
      setError(message);
      throw err;
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      await api.post<Task>("/api/tasks", data);
      // Refetch the full list to get server-generated fields (id, createdAt, etc.)
      await fetchData();
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create task";
      setError(message);
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
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update task";
      setError(message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete task";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
