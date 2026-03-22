import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Notification as NotificationType } from "../hooks/useNotificationHub";

// Notification interface
interface Notification {
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

// Context state
interface NotificationContextState {
  notifications: NotificationType[];
  unreadCount: number;
  isConnected: boolean;
  latestNotification: NotificationType | null;
}

// Context actions
type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: NotificationType }
  | { type: "UPDATE_NOTIFICATION"; payload: { id: string; updates: Partial<NotificationType> } }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_NOTIFICATIONS"; payload: NotificationType[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_LATEST_NOTIFICATION"; payload: NotificationType | null };

// Initial state
const initialState: NotificationContextState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  latestNotification: null,
};

// Reducer
const notificationReducer = (
  state: NotificationContextState,
  action: NotificationAction
): NotificationContextState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
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
      return {
        ...state,
        unreadCount: action.payload,
      };
    
    case "SET_CONNECTION_STATUS":
      return {
        ...state,
        isConnected: action.payload,
      };
    
    case "SET_LATEST_NOTIFICATION":
      return {
        ...state,
        latestNotification: action.payload,
      };
    
    default:
      return state;
  }
};

// Context
const NotificationContext = createContext<{
  state: NotificationContextState;
  dispatch: React.Dispatch<NotificationAction>;
} | null>(null);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use the context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
};

// Action creators
export const notificationActions = {
  addNotification: (notification: NotificationType) => ({
    type: "ADD_NOTIFICATION" as const,
    payload: notification,
  }),
  
  updateNotification: (id: string, updates: Partial<NotificationType>) => ({
    type: "UPDATE_NOTIFICATION" as const,
    payload: { id, updates },
  }),
  
  removeNotification: (id: string) => ({
    type: "REMOVE_NOTIFICATION" as const,
    payload: id,
  }),
  
  setNotifications: (notifications: NotificationType[]) => ({
    type: "SET_NOTIFICATIONS" as const,
    payload: notifications,
  }),
  
  setUnreadCount: (count: number) => ({
    type: "SET_UNREAD_COUNT" as const,
    payload: count,
  }),
  
  setConnectionStatus: (isConnected: boolean) => ({
    type: "SET_CONNECTION_STATUS" as const,
    payload: isConnected,
  }),
  
  setLatestNotification: (notification: NotificationType | null) => ({
    type: "SET_LATEST_NOTIFICATION" as const,
    payload: notification,
  }),
};
