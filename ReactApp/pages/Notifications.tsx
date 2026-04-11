import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Lightbulb, Bell, Check, AlertCircle, Info, Eye } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNotifications } from "../hooks/useNotifications";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";

// Notification interface for UI
interface NotificationItem {
  id: number;
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
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const groupBy = "Date";

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
  };

  // Convert backend notifications to UI format
  const notifs: NotificationItem[] = useMemo(() => {
    return notifications.map((notification) => {
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
  }, [notifications]);

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

  function markRead(id: number) {
    handleMarkAsRead(id);
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

              {/* Bulk actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-md hover:bg-blue-100"
                >
                  Mark all as Read
                </button>
                <button
                  onClick={async () => { await deleteAllNotifications(); }}
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
                      {/* Unread dot */}
                      <div className="flex items-center shrink-0 w-3">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 transition-opacity ${
                            n.unread ? "bg-[#0969DA]" : "opacity-0"
                          }`}
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

                        {/* Mark read */}
                        <button
                          onClick={() => markRead(n.id)}
                          title="Mark as read"
                          aria-label="Mark as read"
                          disabled={!n.unread}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full border border-[rgba(27,31,36,0.15)] bg-[#F6F8FA] hover:bg-[#EEEFF2] flex items-center justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Eye className="size-3.5 text-[#0969DA]" />
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
                  <span className="font-semibold">ProTip!</span> Use the eye icon on unread items to mark them as read quickly.
                </span>
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
