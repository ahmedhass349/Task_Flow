import React from "react";
import { Bell } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";

export interface NotificationBellProps extends React.ComponentPropsWithoutRef<"div"> {
  unreadCount?: number;
  isConnected?: boolean;
}

const NotificationBell = React.forwardRef<HTMLDivElement, NotificationBellProps>((props, ref) => {
  const { state: notificationState } = useNotificationContext();
  const {
    unreadCount: propUnreadCount,
    isConnected: propIsConnected,
    ...divProps
  } = props;

  // Use SignalR count if connected and provided, otherwise fall back to context count
  const displayCount = propIsConnected && propUnreadCount !== undefined ? propUnreadCount : notificationState.unreadCount;

  return (
    <div ref={ref} className="relative" {...divProps}>
      <button
        className="relative p-2 outline-none rounded-lg transition-colors hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="size-6 text-white" />
        
        {displayCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#FF1267] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5">
            {displayCount > 99 ? "99+" : displayCount}
          </span>
        )}
      </button>
    </div>
  );
});

export default NotificationBell;
