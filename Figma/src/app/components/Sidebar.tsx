import { Home, FolderKanban, CheckSquare, Users, Filter, Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems: NavItem[] = [
    { icon: <Home className="size-5" />, label: "Dashboard", path: "/" },
    { icon: <FolderKanban className="size-5" />, label: "Projects", path: "/projects" },
    { icon: <CheckSquare className="size-5" />, label: "My Work", path: "/my-work", badge: 8 },
    { icon: <Users className="size-5" />, label: "Teams", path: "/teams" },
    { icon: <Filter className="size-5" />, label: "Filters", path: "/filters" },
    { icon: <Calendar className="size-5" />, label: "Calendar", path: "/calendar" },
  ];

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Logo/Brand */}
      <div className="h-14 border-b border-gray-800 bg-black flex items-center px-4">
        {isCollapsed ? (
          <div className="bg-blue-500 size-8 rounded flex items-center justify-center mx-auto">
            <FolderKanban className="size-4 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 size-8 rounded flex items-center justify-center">
              <FolderKanban className="size-4 text-white" />
            </div>
            <span className="font-semibold text-white">TaskFlow Pro</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-gray-200">
        <button 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="size-5" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}