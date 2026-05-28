// ── useNotifications Hook ───────────────────────────────────────────────────
//
// Custom hook for fetching and managing notifications.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, extractErrorMessage } from "../services/api";

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
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Notification[]>("/api/notifications?page=1&pageSize=50");
      setNotifications((data ?? []).filter(n => n.type?.toLowerCase() !== "messagereceived"));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load notifications"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to mark notification as read"));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/api/notifications/read-all");
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to mark all notifications as read"));
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete notification"));
      throw err;
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await api.delete(`/api/notifications`);
      setNotifications([]);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete all notifications"));
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api.get<Notification[]>("/api/notifications?page=1&pageSize=50")
      .then(data => {
        if (!cancelled)
          setNotifications((data ?? []).filter(n => n.type?.toLowerCase() !== "messagereceived"));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load notifications"));
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

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
