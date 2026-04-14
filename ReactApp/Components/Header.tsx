import { useMemo, useState, useCallback } from "react";
import { Search, Bell, Mail, User, Settings, LogOut, UserCircle, UserPlus, X, Check, Wifi, WifiOff } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useNotifications } from "../hooks/useNotifications";
import { useNotificationHub } from "../hooks/useNotificationHub";
import { useMessages } from "../hooks/useMessages";
import { useAuth } from "../context/AuthContext";
import { useAccountSwitcher, type SavedAccount } from "../hooks/useAccountSwitcher";
import { useConnectivity } from "../hooks/useConnectivity";
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

// ── Switch Account Modal ──────────────────────────────────────────────────

function avatarBg(email: string): string {
  const palette = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#14b8a6"];
  let h = 0;
  for (let i = 0; i < email.length; i++) h = email.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

function accountInitials(fullName: string): string {
  return fullName.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}

interface SwitchAccountModalProps {
  currentUser: { email: string; fullName: string } | null;
  otherAccounts: SavedAccount[];
  onSwitch: (account: SavedAccount) => void;
  onClose: () => void;
  onAddAccount: () => void;
  switchError: string | null;
  switching: boolean;
}

function SwitchAccountModal({
  currentUser,
  otherAccounts,
  onSwitch,
  onClose,
  onAddAccount,
  switchError,
  switching,
}: SwitchAccountModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Switch account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-0.5"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Current account */}
        {currentUser && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Current
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: avatarBg(currentUser.email) }}
              >
                {accountInitials(currentUser.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
              <Check className="size-4 text-blue-600 shrink-0" />
            </div>
          </div>
        )}

        {/* Other accounts */}
        <div className="px-4 py-2">
          {otherAccounts.length > 0 ? (
            <>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
                Other accounts
              </p>
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                {otherAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => onSwitch(acc)}
                    disabled={switching}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full disabled:opacity-60"
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: avatarBg(acc.email) }}
                    >
                      {accountInitials(acc.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{acc.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-sm text-gray-500 font-medium">No other accounts on this device</p>
              <p className="text-xs text-gray-400 mt-1">
                Sign in with another account to add it here.
              </p>
            </div>
          )}
        </div>

        {/* Inline error */}
        {switchError && (
          <div className="px-4 pb-2">
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{switchError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 mt-2">
          <button
            onClick={onAddAccount}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <div className="size-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
              <UserPlus className="size-4 text-gray-400" />
            </div>
            <span>Add another account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════ */
export default function Header() {
  const { notifications, markAllAsRead } = useNotifications();
  const { unreadCount: signalrUnreadCount, isConnected, latestNotification } = useNotificationHub();
  const { contacts, unreadCount } = useMessages();
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  // ── Connectivity state ────────────────────────────────────────────────
  const { isEffectivelyOnline, toggleManualOffline, isManualOffline } = useConnectivity();

  // ── Account switcher ──────────────────────────────────────────────────
  const { otherAccounts, switchTo } = useAccountSwitcher(user?.email);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchError, setSwitchError]         = useState<string | null>(null);
  const [switching, setSwitching]             = useState(false);

  const handleSwitch = useCallback(async (account: SavedAccount) => {
    setSwitching(true);
    setSwitchError(null);
    let failed = false;
    await switchTo(account, refreshUser, (msg) => { setSwitchError(msg); failed = true; });
    setSwitching(false);
    if (!failed) {
      setShowSwitchModal(false);
      navigate("/");
    }
  }, [switchTo, refreshUser, navigate]);

  const handleAddAccount = useCallback(() => {
    setShowSwitchModal(false);
    logout(); // saves current account; clears active session so /login is accessible
    navigate("/login");
  }, [logout, navigate]);

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
  
  const mergedNotifications = useMemo(() => {
    if (!latestNotification) {
      return notifications;
    }

    const exists = notifications.some((notification) => notification.id === latestNotification.id);
    if (exists) {
      return notifications;
    }

    return [latestNotification, ...notifications];
  }, [notifications, latestNotification]);

  // Convert backend notifications to UI format
  const uiNotifications = mergedNotifications.slice(0, 3).map((notification) => ({
    id: notification.id,
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
            <NotificationBell 
              unreadCount={signalrUnreadCount} 
              isConnected={isConnected} 
            />
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
            <div className="size-8 rounded-full border border-white bg-brand flex items-center justify-center flex-shrink-0 relative">
              <span className="text-white text-xs font-bold">{initials}</span>
              <span
                className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-black ${isEffectivelyOnline ? 'bg-green-400' : 'bg-red-400'}`}
                title={isEffectivelyOnline ? "Connected to cloud" : "Offline"}
              />
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

              <DropdownMenu.Item
                onSelect={() => setShowSwitchModal(true)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
              >
                <UserCircle className="size-4" />
                <span className="text-sm">Switch account</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onSelect={toggleManualOffline}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
              >
                {isManualOffline
                  ? <><Wifi className="size-4 text-green-500" /><span className="text-sm">Go Online</span></>
                  : <><WifiOff className="size-4 text-red-500" /><span className="text-sm">Go Offline</span></>}
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

      {/* ── Switch Account Modal ── */}
      {showSwitchModal && (
        <SwitchAccountModal
          currentUser={user}
          otherAccounts={otherAccounts}
          onSwitch={handleSwitch}
          onClose={() => { setShowSwitchModal(false); setSwitchError(null); }}
          onAddAccount={handleAddAccount}
          switchError={switchError}
          switching={switching}
        />
      )}
    </header>
  );
}
