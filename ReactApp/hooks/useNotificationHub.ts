// â”€â”€ useNotificationHub Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Thin shim over NotificationContext.
// The actual SignalR connection lives in NotificationContext so there is ONE
// persistent connection for the entire authenticated session, regardless of
// how many times components mount/unmount during navigation.

import { useCallback } from "react";
import { useNotificationContext } from "../context/NotificationContext";

// Re-export the Notification type so existing imports keep working
export type { NotificationType as Notification } from "../context/NotificationContext";

// Hook return type
interface UseNotificationHubReturn {
  isConnected: boolean;
  unreadCount: number;
  latestNotification: import("../context/NotificationContext").NotificationType | null;
  markAsRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationHub = (): UseNotificationHubReturn => {
  const { state, markAsRead, markAllRead } = useNotificationContext();

  return {
    isConnected: state.isConnected,
    unreadCount: state.unreadCount,
    latestNotification: state.latestNotification,
    markAsRead,
    markAllRead,
  };
};

