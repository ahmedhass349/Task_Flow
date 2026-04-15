// ── useNotifications Hook ───────────────────────────────────────────────────
//
// Custom hook for fetching and managing notifications.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Notification interface matching backend DTO
interface Notification {
  id: number;
  userId?: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  actionUrl?: string;
  relatedTaskId?: number;
  createdAt: string;
  readAt?: string;
  timeAgo: string;
}

// Hook return type
interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadCount: number;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
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
      const data = await api.get<Notification[]>("/api/notifications?page=1&pageSize=50");
      if (!cancelled) {
        setNotifications((data ?? []).filter(n => n.type?.toLowerCase() !== "messagereceived"));
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

  const markAsRead = useCallback(async (id: number) => {
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

  const deleteNotification = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      // Update local state to reflect change
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete notification";
      setError(message);
      throw err;
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await api.delete(`/api/notifications`);
      setNotifications([]);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete all notifications";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onNotificationReceived = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>;
      const incoming = customEvent.detail;

      if (!incoming || incoming.type?.toLowerCase() === "messagereceived") {
        return;
      }

      setNotifications((prev) => {
        if (prev.some((n) => n.id === incoming.id)) {
          return prev;
        }

        return [incoming, ...prev];
      });
    };

    window.addEventListener("taskflow:notification-received", onNotificationReceived as EventListener);

    return () => {
      window.removeEventListener("taskflow:notification-received", onNotificationReceived as EventListener);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchData,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    unreadCount,
  };
};
