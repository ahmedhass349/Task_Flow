import { LayoutDashboard, FolderKanban, MessageSquare, ClipboardList, Bell, User, Settings, Bot, LogOut, FileText, WifiOff, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { TaskFlowLogo } from "./TaskFlowLogo";
import { useAuth } from "../context/AuthContext";
import { useConnectivity } from "../hooks/useConnectivity";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isEffectivelyOnline } = useConnectivity();

  // ── Global invitation badge ───────────────────────────────────────────
  const [pendingInviteCount, setPendingInviteCount] = useState(0);
  useEffect(() => {
    const fetchCount = () => {
      api.get<{ id: string; status: string }[]>("/api/teams/invitations/incoming")
        .then(items => setPendingInviteCount((items ?? []).filter(i => i.status === "Pending").length))
        .catch(() => {});
    };
    fetchCount();
    const onNotification = (e: Event) => {
      const t = ((e as CustomEvent).detail as { type?: string })?.type?.toLowerCase() ?? "";
      if (t === "teaminvitationreceived") {
        setPendingInviteCount(c => c + 1);
      } else if (["teaminvitationaccepted", "teaminvitationdeclined", "teamdeleted", "teammemberremoved"].includes(t)) {
        fetchCount();
      }
    };
    window.addEventListener("taskflow:notification-received", onNotification);
    return () => window.removeEventListener("taskflow:notification-received", onNotification);
  }, []);

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="size-5 shrink-0" />, label: "Dashboard",     path: "/" },
    { icon: <FolderKanban  className="size-5 shrink-0" />, label: "Projects",      path: "/projects" },
    { icon: <ClipboardList  className="size-5 shrink-0" />, label: "Tasks",         path: "/my-work" },
    { icon: <MessageSquare className="size-5 shrink-0" />, label: "Messages",      path: "/message" },
    { icon: <Bell          className="size-5 shrink-0" />, label: "Notifications", path: "/notifications" },
    { icon: <Calendar      className="size-5 shrink-0" />, label: "Calendar",      path: "/calendar" },
    { icon: <User          className="size-5 shrink-0" />, label: "Teams",         path: "/teams", badge: pendingInviteCount || undefined },
    { icon: <Bot            className="size-5 shrink-0" />, label: "Chatbot",       path: "/plans" },
    { icon: <Settings      className="size-5 shrink-0" />, label: "Settings",      path: "/settings" },
    { icon: <FileText      className="size-5 shrink-0" />, label: "Legal",         path: "/terms-of-service" },
  ];

  return (
    <div 
      className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo/Brand */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-center overflow-hidden px-4">
        {isCollapsed ? (
          <div style={{ width: 40, height: 48, position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, left: 0,  top: 4,  position: 'absolute', background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 10, top: 4,  position: 'absolute', opacity: 0,    background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 20, top: 4,  position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 30, top: 4,  position: 'absolute', opacity: 0,    background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 0,  top: 14, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 10, top: 14, position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 20, top: 14, position: 'absolute', opacity: 0.45, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 30, top: 14, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 0,  top: 24, position: 'absolute', opacity: 0.60, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 10, top: 24, position: 'absolute', opacity: 0.45, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 20, top: 24, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 30, top: 24, position: 'absolute', opacity: 0.15, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 0,  top: 34, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 10, top: 34, position: 'absolute', opacity: 0.30, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 20, top: 34, position: 'absolute', opacity: 0.15, background: '#155EEF' }} />
            <div style={{ width: 10, height: 10, left: 30, top: 34, position: 'absolute', opacity: 0,    background: '#155EEF' }} />
          </div>
        ) : (
          <TaskFlowLogo />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              style={isActive ? { background: '#E2DEFF', borderRadius: 8 } : { borderRadius: 8 }}
              className={`flex items-center gap-4 px-4 py-3 mx-2 transition-colors ${
                isActive ? "text-[#3C21F7]" : "text-[#878787] hover:bg-sidebar-accent"
              }`}
            >
              <span className="relative inline-flex shrink-0">
                {item.icon}
                {(item.badge ?? 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                    {item.badge! > 9 ? "9+" : item.badge}
                  </span>
                )}
              </span>
              {!isCollapsed && (
                <span className="text-base font-normal whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Offline indicator */}
      {!isEffectivelyOnline && (
        <div
          title="Offline — changes will sync when reconnected"
          className={`flex items-center gap-4 px-4 py-2 mx-2 rounded-[8px] text-amber-500 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <WifiOff className="size-4 shrink-0" />
          {!isCollapsed && (
            <span className="text-xs font-medium whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              Offline
            </span>
          )}
        </div>
      )}

      {/* Log Out */}
      <div className="py-2 border-t border-sidebar-border">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          title={isCollapsed ? "Log Out" : undefined}
          className="flex items-center gap-4 px-4 py-3 mx-2 rounded-[8px] text-[#878787] hover:bg-sidebar-accent transition-colors w-[calc(100%-16px)] cursor-pointer"
        >
          <LogOut className="size-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-base font-normal whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              Log Out
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
