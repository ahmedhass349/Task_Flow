import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef, useCallback } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { getApiBaseUrl } from "../config/api";
import { api } from "../services/api";

// ── Notification type (exported so other modules can import it) ──────────
export interface NotificationType {
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

// ── Context state ────────────────────────────────────────────────────────
interface NotificationContextState {
  notifications: NotificationType[];
  unreadCount: number;
  isConnected: boolean;
  latestNotification: NotificationType | null;
}

// ── Context actions ──────────────────────────────────────────────────────
type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: NotificationType }
  | { type: "UPDATE_NOTIFICATION"; payload: { id: number; updates: Partial<NotificationType> } }
  | { type: "REMOVE_NOTIFICATION"; payload: number }
  | { type: "SET_NOTIFICATIONS"; payload: NotificationType[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_LATEST_NOTIFICATION"; payload: NotificationType | null };

// ── Initial state ────────────────────────────────────────────────────────
const initialState: NotificationContextState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  latestNotification: null,
};

// ── Reducer ──────────────────────────────────────────────────────────────
const notificationReducer = (
  state: NotificationContextState,
  action: NotificationAction
): NotificationContextState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      if (state.notifications.some(n => n.id === action.payload.id)) return state;
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.isRead ? state.unreadCount : state.unreadCount + 1,
      };
    case "UPDATE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
        ),
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: state.notifications.find(n => n.id === action.payload)?.isRead
          ? state.unreadCount
          : Math.max(0, state.unreadCount - 1),
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
      };
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };
    case "SET_LATEST_NOTIFICATION":
      return { ...state, latestNotification: action.payload };
    default:
      return state;
  }
};

// ── Context shape ────────────────────────────────────────────────────────
interface NotificationContextValue {
  state: NotificationContextState;
  dispatch: React.Dispatch<NotificationAction>;
  markAsRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { token, isLoading } = useAuth();
  const { addToast } = useToast();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) {
      connectionRef.current.stop();
      connectionRef.current = null;
    }

    if (!token || isLoading) {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
      return;
    }

    const baseUrl = getApiBaseUrl();
    const connection = new HubConnectionBuilder()
      .withUrl(`${baseUrl || ""}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.onreconnecting(() => dispatch({ type: "SET_CONNECTION_STATUS", payload: false }));
    connection.onreconnected(() => dispatch({ type: "SET_CONNECTION_STATUS", payload: true }));
    connection.onclose(() => dispatch({ type: "SET_CONNECTION_STATUS", payload: false }));

    connection.on("ReceiveNotification", (notification: NotificationType) => {
      // Message-received alerts are transient (not persisted) and belong only in the
      // Messages tab — skip adding them to the notification bell/store/toast.
      // Still fire the custom event so useMessages can refresh contacts in real time.
      if (notification.type?.toLowerCase() === "messagereceived") {
        window.dispatchEvent(new CustomEvent("taskflow:notification-received", { detail: notification }));
        return;
      }

      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
      dispatch({ type: "SET_LATEST_NOTIFICATION", payload: notification });
      window.dispatchEvent(new CustomEvent("taskflow:notification-received", { detail: notification }));

      const priority = notification.priority.toLowerCase();
      const ntype = notification.type.toLowerCase();
      const toastType =
        priority === "high" || priority === "critical" ? "warning" :
        ntype.includes("error") ? "error" :
        ntype.includes("success") ? "success" : "info";

      addToast({
        title: notification.title,
        message: notification.message,
        type: toastType,
        duration: priority === "high" || priority === "critical" ? 8000 : 5000,
        persistent: priority === "critical",
      });
    });

    connection.on("UnreadCount", (count: number) => {
      dispatch({ type: "SET_UNREAD_COUNT", payload: count });
      window.dispatchEvent(new CustomEvent("taskflow:notification-unread-count", { detail: count }));
    });

    connection.on("ConnectivityChanged", (isOnline: boolean) => {
      window.dispatchEvent(new CustomEvent("taskflow:connectivity-changed", { detail: isOnline }));
    });

    connection.on("SyncStarted", (total: number) => {
      window.dispatchEvent(new CustomEvent("taskflow:sync-started", { detail: total }));
    });

    connection.on("SyncProgress", (synced: number, total: number) => {
      window.dispatchEvent(new CustomEvent("taskflow:sync-progress", { detail: { synced, total } }));
    });

    connection.on("SyncCompleted", (synced: number, failed: number) => {
      window.dispatchEvent(new CustomEvent("taskflow:sync-completed", { detail: { synced, failed } }));
      if (synced > 0)
        addToast({ title: "Sync Complete", message: `${synced} item${synced === 1 ? "" : "s"} synced to cloud.`, type: "success", duration: 5000 });
      if (failed > 0)
        addToast({ title: "Sync Warning", message: `${failed} item${failed === 1 ? "" : "s"} failed to sync.`, type: "warning", duration: 8000 });
    });

    connection.start()
      .then(async () => {
        dispatch({ type: "SET_CONNECTION_STATUS", payload: true });

        const sessionKey = `notif_popup_${token.slice(-16)}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, "1");
          try {
            const unread = await api.get<NotificationType[]>("/api/notifications?page=1&pageSize=20");
            const pending = (unread ?? []).filter(n => !n.isRead).slice(0, 7);
            pending.forEach((notif, idx) => {
              setTimeout(() => {
                const priority = notif.priority.toLowerCase();
                addToast({
                  title: notif.title,
                  message: notif.message,
                  type: priority === "high" || priority === "critical" ? "warning" : "info",
                  duration: 6000,
                });
              }, (idx + 1) * 900);
            });
          } catch { /* non-critical */ }
        }
      })
      .catch(() => dispatch({ type: "SET_CONNECTION_STATUS", payload: false }));

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoading]);

  const markAsRead = useCallback(async (id: number) => {
    if (connectionRef.current) await connectionRef.current.invoke("MarkAsRead", id);
  }, []);

  const markAllRead = useCallback(async () => {
    if (connectionRef.current) await connectionRef.current.invoke("MarkAllRead");
  }, []);

  return (
    <NotificationContext.Provider value={{ state, dispatch, markAsRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationContext must be used within a NotificationProvider");
  return context;
};

// ── Action creators ───────────────────────────────────────────────────────
export const notificationActions = {
  addNotification: (notification: NotificationType) => ({
    type: "ADD_NOTIFICATION" as const, payload: notification,
  }),
  updateNotification: (id: number, updates: Partial<NotificationType>) => ({
    type: "UPDATE_NOTIFICATION" as const, payload: { id, updates },
  }),
  removeNotification: (id: number) => ({
    type: "REMOVE_NOTIFICATION" as const, payload: id,
  }),
  setNotifications: (notifications: NotificationType[]) => ({
    type: "SET_NOTIFICATIONS" as const, payload: notifications,
  }),
  setUnreadCount: (count: number) => ({
    type: "SET_UNREAD_COUNT" as const, payload: count,
  }),
  setConnectionStatus: (isConnected: boolean) => ({
    type: "SET_CONNECTION_STATUS" as const, payload: isConnected,
  }),
  setLatestNotification: (notification: NotificationType | null) => ({
    type: "SET_LATEST_NOTIFICATION" as const, payload: notification,
  }),
};
