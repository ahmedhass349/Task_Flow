import React from "react";
import { Bell } from "lucide-react";
import { useNotificationHub } from "../hooks/useNotificationHub";
import { useNotificationContext } from "../context/NotificationContext";

export interface NotificationBellProps extends React.ComponentPropsWithoutRef<"div"> {}

const NotificationBell = React.forwardRef<HTMLDivElement, NotificationBellProps>((props, ref) => {
  const { unreadCount, isConnected } = useNotificationHub();
  const { state: notificationState } = useNotificationContext();

  // Use SignalR count if connected, otherwise fall back to context count
  const displayCount = isConnected ? unreadCount : notificationState.unreadCount;

  return (
    <div ref={ref} className="relative" {...props}>
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
        
        {/* Connection indicator */}
        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
          isConnected 
            ? "bg-green-500" 
            : "bg-gray-400"
        }`} />
      </button>
    </div>
  );
});

export default NotificationBell;
