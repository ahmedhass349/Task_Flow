// ── useNotifications Hook ───────────────────────────────────────────────────
//
// Custom hook for fetching and managing notifications.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Notification interface matching backend DTO
interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

// Hook return type
interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadCount: number;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Notification[]>("/api/notifications");
      if (!cancelled) {
        setNotifications(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load notifications";
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

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      // Update local state to reflect change
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to mark notification as read";
      setError(message);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/api/notifications/read-all");
      // Update local state to reflect change
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to mark all notifications as read";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchData,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };
};
