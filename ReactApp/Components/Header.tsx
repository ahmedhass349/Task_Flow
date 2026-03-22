import { useState } from "react";
import { Search, Bell, Mail, User, Settings, LogOut, UserCircle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useNotifications } from "../hooks/useNotifications";
import { useNotificationHub } from "../hooks/useNotificationHub";
import { useNotificationContext } from "../context/NotificationContext";
import { useMessages } from "../hooks/useMessages";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

/* ─── Messages data ─── */
interface Message {
  id: number;
  avatar: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
}

const AVATAR_COLORS: Record<string, string> = {
  SC: "bg-pink-200 text-pink-700",
  MJ: "bg-blue-200 text-blue-700",
  AK: "bg-green-200 text-green-700",
  ER: "bg-purple-200 text-purple-700",
  DT: "bg-orange-200 text-orange-700",
};

/* ═════════════════════════════ */
export default function Header() {
  const { notifications, markAllAsRead } = useNotifications();
  const { unreadCount: signalrUnreadCount, isConnected } = useNotificationHub();
  const { state: notificationState } = useNotificationContext();
  const { contacts, unreadCount } = useMessages();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user ? user.fullName : "Demo User";
  const initials = user
    ? user.fullName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
    : "DU";

  // Use SignalR unread count if connected, otherwise fall back to API count
  const unreadNotifCount = isConnected ? signalrUnreadCount : notifications.filter(n => !n.isRead).length;
  const unreadMsgCount = unreadCount;

  const markAllNotifsRead = () => {
    if (isConnected) {
      // Use SignalR method if connected
      markAllAsRead();
    } else {
      // Fall back to API method
      markAllAsRead();
    }
  };
  
  // Convert backend notifications to UI format
  const uiNotifications = notifications.slice(0, 3).map((notification, index) => ({
    id: index,
    icon: Bell,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: notification.title,
    body: notification.message,
    time: formatRelativeTime(notification.createdAt),
    unread: !notification.isRead,
  }));

  // Convert backend contacts to UI format
  const uiMessages = contacts.slice(0, 3).map(contact => ({
    id: parseInt(contact.id),
    avatar: contact.name.split(' ').map(n => n[0]).join(''),
    name: contact.name,
    preview: contact.lastMessage || "No messages yet",
    time: contact.lastMessageTime ? formatRelativeTime(contact.lastMessageTime) : "",
    unread: contact.unreadCount > 0,
  }));

  function formatRelativeTime(iso: string): string {
    const created = new Date(iso);
    const diffMs = Date.now() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "Yesterday";
    return `${diffD} days ago`;
  }

  return (
    <header className="bg-black h-16 flex items-center px-8 gap-6">
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Centered Search */}
      <div className="flex-1 max-w-[417px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#787486' }} />
          <input
            type="text"
            placeholder="Search for report..."
            aria-label="Search for report"
            style={{ background: '#F5F5F5', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#787486' }}
            className="w-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-end gap-6">

        {/* ── Notifications dropdown ── */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <NotificationBell />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 z-50 overflow-hidden"
              sideOffset={10} align="end"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                {unreadNotifCount > 0 && (
                  <button onClick={markAllNotifsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="max-h-[340px] overflow-y-auto">
                {uiNotifications.map(n => (
                  <DropdownMenu.Item
                    key={n.id}
                    onSelect={() => {/* Mark as read - would need backend support */}}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer outline-none border-b border-gray-50 last:border-0 transition-colors ${n.unread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`}>
                      <n.icon className={`size-4 ${n.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {n.unread && <span className="size-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                  </DropdownMenu.Item>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <Link to="/notifications" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </Link>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* ── Messages dropdown ── */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 outline-none rounded-lg transition-colors hover:bg-white/10" aria-label="Messages">
              <Mail className="size-6 text-white" />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#FF1267] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                  {unreadMsgCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 z-50 overflow-hidden"
              sideOffset={10} align="end"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm">Messages</span>
                {unreadMsgCount > 0 && (
                  <button onClick={() => {}} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="max-h-[340px] overflow-y-auto">
                {uiMessages.map(m => (
                  <DropdownMenu.Item
                    key={m.id}
                    onSelect={() => {/* Mark as read - would need backend support */}}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer outline-none border-b border-gray-50 last:border-0 transition-colors ${m.unread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${AVATAR_COLORS[m.avatar] ?? "bg-gray-200 text-gray-600"}`}>
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-900 truncate">{m.name}</p>
                        <p className="text-[11px] text-gray-400 flex-shrink-0">{m.time}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{m.preview}</p>
                    </div>
                    {m.unread && <span className="size-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                  </DropdownMenu.Item>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <Link to="/message" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Open messages
                </Link>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* ── User pill dropdown ── */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="flex items-center gap-4 px-4 py-1.5 rounded-full cursor-pointer border-0 outline-none hover:opacity-90 transition-opacity"
            style={{ background: '#242424' }}
          >
            <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.48px' }}>
              {displayName}
            </span>
            <div className="size-8 rounded-full border border-white bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-56 z-50"
              sideOffset={8} align="end"
            >
              <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 mb-2">
                <div className="size-9 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
                </div>
              </div>

              <DropdownMenu.Item asChild>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                  <User className="size-4" />
                  <span className="text-sm">Profile</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                  <Settings className="size-4" />
                  <span className="text-sm">Settings</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <UserCircle className="size-4" />
                <span className="text-sm">Switch account</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />

              <DropdownMenu.Item
                onSelect={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
              >
                <LogOut className="size-4" />
                <span className="text-sm">Log out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

      </div>
    </header>
  );
}
