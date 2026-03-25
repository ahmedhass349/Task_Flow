import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Lightbulb, Bell, Check, AlertCircle, Info } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNotifications } from "../hooks/useNotifications";
import { useNotificationHub } from "../hooks/useNotificationHub";
import { useNotificationContext } from "../context/NotificationContext";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";

// Notification interface for UI
interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  actionUrl?: string;
}

export default function Notifications() {
  const { notifications, isLoading, error, refetch, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();
  const { isConnected, markAsRead: signalRMarkAsRead, markAllRead: signalRMarkAllRead } = useNotificationHub();
  const { state: notificationState } = useNotificationContext();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const groupBy = "Date";

  // Use SignalR methods if connected, otherwise fall back to API methods
  const handleMarkAsRead = async (id: string) => {
    if (isConnected) {
      // Use SignalR method
      await signalRMarkAsRead(id);
    } else {
      // Fall back to API method
      await markAsRead(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isConnected) {
      // Use SignalR method
      await signalRMarkAllRead();
    } else {
      // Fall back to API method
      await markAllAsRead();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    // If all visible selected, allow delete all
    if (selected.size === notifications.length) {
      await deleteAllNotifications();
      setSelected(new Set());
      return;
    }

    const ids = Array.from(selected) as string[];
    for (const id of ids) {
      await deleteNotification(id);
    }
    setSelected(new Set());
  };

  // Convert backend notifications to UI format
  const notifs: NotificationItem[] = useMemo(() => {
    const notificationList = isConnected && notificationState.notifications.length > 0 
      ? notificationState.notifications 
      : notifications;

    return notificationList.map((notification, index) => {
      // Get icon based on notification type
      const getIcon = () => {
        switch (notification.type) {
          case "TaskCreated":
          case "TaskUpdated":
          case "TaskDeleted":
            return <Check className="w-4 h-4" />;
          case "TaskDueSoon":
          case "TaskOverdue":
            return <AlertCircle className="w-4 h-4" />;
          case "ReminderFired":
            return <Bell className="w-4 h-4" />;
          default:
            return <Info className="w-4 h-4" />;
        }
      };

      // Get color based on priority
      const getIconColors = () => {
        switch (notification.priority) {
          case "Critical":
            return { bg: "bg-red-100", color: "text-red-600" };
          case "High":
            return { bg: "bg-orange-100", color: "text-orange-600" };
          case "Medium":
            return { bg: "bg-blue-100", color: "text-blue-600" };
          default:
            return { bg: "bg-gray-100", color: "text-gray-600" };
        }
      };

      const iconColors = getIconColors();

      return {
        id: notification.id,
        icon: getIcon(),
        iconBg: iconColors.bg,
        iconColor: iconColors.color,
        title: notification.title,
        body: notification.message,
        time: notification.timeAgo,
        unread: !notification.isRead,
        actionUrl: notification.actionUrl,
      };
    });
  }, [notifications, notificationState.notifications, isConnected]);

  const handleRetry = () => {
    refetch();
  };

  const visible = useMemo(() => {
    let list = tab === "unread" ? notifs.filter(n => n.unread) : notifs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notifs, tab, search]);

  const allSelected = visible.length > 0 && visible.every((n) => selected.has(n.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        visible.forEach((n) => next.delete(n.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        visible.forEach((n) => next.add(n.id));
        return next;
      });
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function markRead(id: string) {
    handleMarkAsRead(id);
  }

function markUnread(id: string) {
  // Backend doesn't have mark as unread, so we'll just update local state
  // This would need to be implemented in the backend
}

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-4">

            {/* Page heading */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <span className="text-sm text-gray-500">
                {notifs.filter((n) => n.unread).length} unread
              </span>
            </div>

            {/* Loading / Error / Empty */}
            {isLoading && <PageLoading message="Loading notifications..." />}
            {error && <PageError message={error} onRetry={handleRetry} />}
            {!isLoading && !error && notifs.length === 0 && (
              <PageEmpty
                icon={Bell}
                title="No notifications"
                description="You're all caught up! New notifications will appear here."
              />
            )}

            {!isLoading && !error && notifs.length > 0 && (
              <>
                {/* Toolbar */}
            <div className="flex items-center gap-2">
              {/* All / Unread tabs */}
              <div className="flex rounded-md overflow-hidden border border-[rgba(27,31,36,0.15)] shrink-0">
                <button
                  onClick={() => setTab("all")}
                  className={`px-4 py-1.5 text-sm font-medium leading-5 transition-colors ${
                    tab === "all"
                      ? "bg-[#EEEFF2] text-[#24292F]"
                      : "bg-[#F6F8FA] text-[#24292F] hover:bg-[#EEEFF2]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTab("unread")}
                  className={`px-4 py-1.5 text-sm font-medium leading-5 border-l border-[rgba(27,31,36,0.15)] transition-colors ${
                    tab === "unread"
                      ? "bg-[#EEEFF2] text-[#24292F]"
                      : "bg-[#F6F8FA] text-[#24292F] hover:bg-[#EEEFF2]"
                  }`}
                >
                  Unread
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#57606A]" />
                <input
                  type="text"
                  placeholder="Filter notifications"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm text-[#24292F] placeholder-[#6E7781] bg-[#F6F8FA] border border-[#D0D7DE] rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Delete actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-100"
                >
                  Delete Selected
                </button>
                <button
                  onClick={async () => { await deleteAllNotifications(); setSelected(new Set()); }}
                  className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-100"
                >
                  Delete All
                </button>
              </div>

              {/* Group by dropdown */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] border border-[rgba(27,31,36,0.15)] rounded-md text-[rgba(36,41,47,0.75)] hover:bg-[#EEEFF2] shrink-0 transition-colors">
                <span>Group by:</span>
                <span className="text-[#24292F]">{groupBy}</span>
                <ChevronDown size={12} className="text-[#4E5258]" />
              </button>
            </div>

            {/* Notification list */}
            <div className="bg-white rounded-md border border-[#D0D7DE] overflow-hidden">
              {/* Select-all header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F6F8FA] border-b border-[#D0D7DE]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all notifications"
                  className="w-3.5 h-3.5 rounded accent-[#0969DA] cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#24292F]">Select all</span>
                {selected.size > 0 && (
                  <span className="ml-auto text-xs text-[#57606A]">
                    {selected.size} selected
                  </span>
                )}
              </div>

              {/* Items */}
              {visible.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-[#57606A]">
                  No notifications match your filter.
                </div>
              ) : (
                <ul>
                  {visible.map((n, i) => (
                    <li
                      key={n.id}
                      className={`flex items-center gap-3 px-4 py-3 group transition-colors ${
                        n.unread ? "bg-white" : "bg-[#F6F8FA]"
                      } ${i < visible.length - 1 ? "border-b border-[#D8DEE4]" : ""}`}
                    >
                      {/* Unread dot + checkbox */}
                      <div className="flex items-center gap-2 shrink-0 w-8">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 transition-opacity ${
                            n.unread ? "bg-[#0969DA]" : "opacity-0"
                          }`}
                        />
                        <input
                          type="checkbox"
                          checked={selected.has(n.id)}
                          onChange={() => toggleSelect(n.id)}
                          aria-label={`Select notification: ${n.title}`}
                          className="w-3.5 h-3.5 rounded accent-[#0969DA] cursor-pointer"
                        />
                      </div>

                      {/* Icon */}
                      <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                        <div className={`size-4 ${n.iconColor}`}>
                          {n.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold leading-[18px] ${n.unread ? "text-[#24292F]" : "text-[#57606A]"}` }>
                          {n.title}
                        </p>
                        <p
                          className={`text-sm leading-[21px] truncate ${
                            n.unread ? "text-[#24292F]" : "text-[#57606A]"
                          }`}
                        >
                          {n.body}
                        </p>
                      </div>

                      {/* Right meta */}
                      <div className="flex items-center gap-3 shrink-0 text-xs text-[#24292F]">
                        <span className="text-right min-w-[70px] text-[#57606A]">{n.time}</span>

                        {/* Mark read/unread on hover */}
                        <button
                          onClick={() => (n.unread ? markRead(n.id) : markUnread(n.id))}
                          title={n.unread ? "Mark as read" : "Mark as unread"}
                          aria-label={n.unread ? "Mark as read" : "Mark as unread"}
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full border border-[rgba(27,31,36,0.15)] bg-[#F6F8FA] hover:bg-[#EEEFF2] flex items-center justify-center transition-opacity"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              n.unread ? "bg-[#0969DA]" : "bg-transparent border border-[#57606A]"
                            }`}
                          />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(n.id)}
                          title="Delete notification"
                          aria-label="Delete notification"
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full border border-[rgba(27,31,36,0.15)] bg-white hover:bg-red-50 flex items-center justify-center transition-opacity text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer bar */}
            <div className="flex items-center justify-between">
              {/* ProTip */}
              <div className="flex items-center gap-1.5 text-xs text-[#57606A]">
                <Lightbulb size={14} className="text-[#57606A] shrink-0" />
                <span>
                  <span className="font-semibold">ProTip!</span> When viewing a notification, press{" "}
                </span>
                <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-[#F6F8FA] border border-[rgba(175,184,193,0.2)] rounded text-[#24292F]">
                  shift u
                </kbd>
                <span> to mark it as Unread.</span>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#24292F]">
                  <span className="font-semibold">1–{visible.length}</span> of {visible.length}
                </span>
                <div className="flex rounded-md overflow-hidden border border-[rgba(27,31,36,0.15)]">
                  <button
                    disabled
                    className="px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] text-[rgba(9,105,218,0.5)] hover:bg-[#EEEFF2] transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    disabled
                    className="px-3 py-1.5 text-sm font-medium bg-[#F6F8FA] text-[rgba(9,105,218,0.5)] border-l border-[rgba(27,31,36,0.15)] hover:bg-[#EEEFF2] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

              </>
            )}

          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
