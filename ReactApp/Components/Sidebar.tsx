import { LayoutDashboard, FolderKanban, MessageSquare, ClipboardList, Bell, User, Settings, Bot, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { TaskFlowLogo } from "./TaskFlowLogo";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="size-5 shrink-0" />, label: "Dashboard",     path: "/" },
    { icon: <FolderKanban  className="size-5 shrink-0" />, label: "Projects",      path: "/projects" },
    { icon: <ClipboardList  className="size-5 shrink-0" />, label: "My Tasks",      path: "/my-work" },
    { icon: <MessageSquare className="size-5 shrink-0" />, label: "Messages",      path: "/message" },
    { icon: <Bell          className="size-5 shrink-0" />, label: "Notifications", path: "/notifications" },
    { icon: <User          className="size-5 shrink-0" />, label: "Users",         path: "/teams" },
    { icon: <Settings      className="size-5 shrink-0" />, label: "Settings",      path: "/settings" },
    { icon: <Bot            className="size-5 shrink-0" />, label: "Chatbot",       path: "/plans" },
  ];

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo/Brand */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-center overflow-hidden px-4">
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
                isActive ? "text-[#3C21F7]" : "text-[#878787] hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="text-base font-normal whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Log Out */}
      <div className="py-2 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          title={isCollapsed ? "Log Out" : undefined}
          className="flex items-center gap-4 px-4 py-3 mx-2 rounded-[8px] text-[#878787] hover:bg-gray-100 transition-colors w-[calc(100%-16px)] cursor-pointer"
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
