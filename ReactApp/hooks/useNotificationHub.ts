// ── useNotificationHub Hook ─────────────────────────────────────────────
//
// Custom hook for real-time SignalR notifications.
// Handles connection, events, and automatic reconnection.

import { useEffect, useRef, useCallback, useState } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getApiBaseUrl } from "../config/api";

// Notification interface matching backend DTO
export interface Notification {
  id: string;
  userId: string;
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
interface UseNotificationHubReturn {
  isConnected: boolean;
  unreadCount: number;
  latestNotification: Notification | null;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationHub = (): UseNotificationHubReturn => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // Create connection
  const createConnection = useCallback(() => {
    if (!token) return null;

    const baseUrl = getApiBaseUrl();
    const hubUrl = `${baseUrl || ""}/hubs/notifications`;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    return connection;
  }, [token]);

  // Start connection
  useEffect(() => {
    const connection = createConnection();
    if (!connection) return;

    connectionRef.current = connection;

    // Connection lifecycle
    connection.onreconnecting(() => {
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      setIsConnected(true);
    });

    connection.onclose(() => {
      setIsConnected(false);
    });

    // Hub events
    connection.on("ReceiveNotification", (notification: Notification) => {
      setLatestNotification(notification);

      // Show in-app toast notification
      const toastType = notification.priority === "high" ? "warning" : 
                       notification.type.includes("error") ? "error" : 
                       notification.type.includes("success") ? "success" : "info";

      addToast({
        title: notification.title,
        message: notification.message,
        type: toastType,
        duration: notification.priority === "high" ? 8000 : 5000, // High priority stays longer
        persistent: notification.priority === "high", // High priority requires manual close
      });
    });

    connection.on("UnreadCount", (count: number) => {
      setUnreadCount(count);
    });

    // Start connection
    connection.start()
      .then(() => {
        setIsConnected(true);
      })
      .catch(err => {
        setIsConnected(false);
      });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [createConnection]);

  // Hub methods
  const markAsRead = useCallback(async (id: string) => {
    if (connectionRef.current) {
      await connectionRef.current.invoke("MarkAsRead", id);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.invoke("MarkAllRead");
    }
  }, []);

  return {
    isConnected,
    unreadCount,
    latestNotification,
    markAsRead,
    markAllRead,
  };
};
