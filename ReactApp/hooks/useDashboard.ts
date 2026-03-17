// ── useDashboard Hook ──────────────────────────────────────────────────────
//
// Custom hook for fetching dashboard statistics and recent activity.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Dashboard stats from backend DTO
interface DashboardStatsDto {
  activeTaskCount: number;
  inProgressCount: number;
  projectCount: number;
  teamMemberCount: number;
}

// Activity item from backend DTO
interface ActivityItemDto {
  id: number;
  description: string;
  userName: string;
  createdAt: string;
}

// Formatted stats for UI
interface DashboardStats {
  activeTasks: number;
  inProgress: number;
  projects: number;
  teamMembers: number;
  dueThisWeek: number;
  activeProjects: number;
  onlineNow: number;
  tasksTrend: number; // percentage
}

// Formatted activity item for UI
interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  iconBg: string;
  iconColor: string;
  icon: any; // Lucide icon component
}

// Hook return type
interface UseDashboardReturn {
  stats: DashboardStats | null;
  recentActivity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper to format relative time
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

// Helper to map stats DTO to UI format
function mapStats(dto: DashboardStatsDto): DashboardStats {
  return {
    activeTasks: dto.activeTaskCount,
    inProgress: dto.inProgressCount,
    projects: dto.projectCount,
    teamMembers: dto.teamMemberCount,
    dueThisWeek: 0, // Backend doesn't provide this yet
    activeProjects: dto.projectCount,
    onlineNow: dto.teamMemberCount,
    tasksTrend: 0, // Backend doesn't provide this yet
  };
}

// Helper to map activity DTO to UI format
function mapActivity(items: ActivityItemDto[]): ActivityItem[] {
  return items.map((item) => {
    // Default icon mapping - can be enhanced
    let icon = require("lucide-react").CheckSquare;
    let iconBg = "bg-green-100";
    let iconColor = "text-green-600";

    const text = item.description.toLowerCase();
    if (text.includes("project")) {
      icon = require("lucide-react").FileText;
      iconBg = "bg-blue-100";
      iconColor = "text-blue-600";
    } else if (text.includes("joined") || text.includes("member")) {
      icon = require("lucide-react").Users;
      iconBg = "bg-purple-100";
      iconColor = "text-purple-600";
    }

    return {
      id: String(item.id),
      user: item.userName,
      action: item.description,
      time: formatRelativeTime(item.createdAt),
      iconBg,
      iconColor,
      icon,
    };
  });
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const [statsDto, activityDto] = await Promise.all([
        api.get<DashboardStatsDto>("/api/dashboard/stats"),
        api.get<ActivityItemDto[]>("/api/dashboard/activity"),
      ]);

      if (!cancelled) {
        setStats(mapStats(statsDto));
        setRecentActivity(mapActivity(activityDto));
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load dashboard data";
        setError(message);
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    recentActivity,
    isLoading,
    error,
    refetch: fetchData,
  };
};
