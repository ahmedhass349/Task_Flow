// ── useNotificationHub Hook ─────────────────────────────────────────────
//
// Custom hook for real-time SignalR notifications.
// Handles connection, events, and automatic reconnection.

import { useEffect, useRef, useCallback, useState } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import { useAuth } from "../context/AuthContext";

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
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // Create connection
  const createConnection = useCallback(() => {
    if (!token) return null;

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/notifications")
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
      console.log("SignalR reconnecting...");
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      console.log("SignalR reconnected");
      setIsConnected(true);
    });

    connection.onclose(() => {
      console.log("SignalR connection closed");
      setIsConnected(false);
    });

    // Hub events
    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("Received notification:", notification);
      setLatestNotification(notification);
      
      // Show toast notification
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: notification.id,
        });
      }
    });

    connection.on("UnreadCount", (count: number) => {
      console.log("Unread count updated:", count);
      setUnreadCount(count);
    });

    // Start connection
    connection.start()
      .then(() => {
        console.log("SignalR connected");
        setIsConnected(true);
      })
      .catch(err => {
        console.error("SignalR connection error:", err);
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
