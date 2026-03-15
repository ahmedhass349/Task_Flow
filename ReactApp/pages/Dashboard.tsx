import { useState, useEffect } from 'react';
import { Clock, CheckSquare, Calendar, Users, FileText, TrendingUp } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import DashboardCard from "../Components/DashboardCard";
import TaskItem from "../Components/TaskItem";
import CalendarWidget from "../Components/CalendarWidget";
import TaskLineWidget from "../Components/TaskLineWidget";
import Footer from "../Components/Footer";
import { PageLoading, PageError } from "../Components/PageState";
import { useAuth } from "../context/AuthContext";

// ── Types for dashboard data ─────────────────────────────────────────────

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

interface DashboardTask {
  title: string;
  project: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  assignee?: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  iconBg: string;
  iconColor: string;
  icon: typeof CheckSquare;
}

interface DashboardData {
  stats: DashboardStats;
  myWork: DashboardTask[];
  assignedToMe: DashboardTask[];
  recentActivity: ActivityItem[];
}

// ── Seed data (will be replaced by API call) ─────────────────────────────

const SEED_DASHBOARD: DashboardData = {
  stats: {
    activeTasks: 24,
    inProgress: 8,
    projects: 12,
    teamMembers: 16,
    dueThisWeek: 3,
    activeProjects: 4,
    onlineNow: 12,
    tasksTrend: 12,
  },
  myWork: [
    { title: "Design new landing page", project: "Marketing Site", dueDate: "Today", priority: "high" },
    { title: "Review pull requests", project: "API Service", dueDate: "Tomorrow", priority: "medium" },
    { title: "Update documentation", project: "Developer Portal", dueDate: "Mar 12", priority: "low" },
    { title: "Fix bug in checkout flow", project: "E-commerce", dueDate: "Mar 15", priority: "high" },
  ],
  assignedToMe: [
    { title: "Implement authentication flow", project: "User Service", assignee: "Sarah Chen", dueDate: "Mar 11", priority: "high" },
    { title: "Create wireframes for dashboard", project: "Admin Panel", assignee: "Mike Johnson", dueDate: "Mar 13", priority: "medium" },
    { title: "Write unit tests", project: "API Service", assignee: "You", dueDate: "Mar 14", priority: "low" },
  ],
  recentActivity: [
    { id: "1", user: "Sarah Chen", action: 'completed "Design system update"', time: "2 hours ago", iconBg: "bg-green-100", iconColor: "text-green-600", icon: CheckSquare },
    { id: "2", user: "Mike Johnson", action: 'created new project "Mobile App"', time: "5 hours ago", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: FileText },
    { id: "3", user: "Alex Kim", action: "joined the team", time: "Yesterday", iconBg: "bg-purple-100", iconColor: "text-purple-600", icon: Users },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [calYear, setCalYear] = useState(2022);
  const [calMonth, setCalMonth] = useState(5); // 0-indexed, 5 = Jun
  const [calDay, setCalDay] = useState(10);

  // Data fetching state (ready for API integration)
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call: api.get<DashboardData>("/dashboard")
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // Simulate async data fetch
    const timer = setTimeout(() => {
      if (!cancelled) {
        setData(SEED_DASHBOARD);
        setIsLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";
  const displayName = user ? user.firstName : "Demo User";

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-trigger fetch
    setTimeout(() => {
      setData(SEED_DASHBOARD);
      setIsLoading(false);
    }, 0);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          {isLoading && <PageLoading message="Loading dashboard..." />}
          {error && <PageError message={error} onRetry={handleRetry} />}
          {!isLoading && !error && data && (
          <div className="flex gap-6 p-6 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            {/* Greeting */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{greeting}, {displayName}</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your projects today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.activeTasks}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckSquare className="size-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>{data.stats.tasksTrend}% from last week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.inProgress}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="size-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{data.stats.dueThisWeek} due this week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.projects}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="size-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{data.stats.activeProjects} active projects</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.teamMembers}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="size-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{data.stats.onlineNow} online now</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Work */}
              <DashboardCard
                title="My Work"
                icon={CheckSquare}
                action={{ label: "View all", onClick: () => {} }}
              >
                {data.myWork.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No tasks assigned yet</p>
                ) : (
                <div className="space-y-1">
                  {data.myWork.map((task) => (
                    <TaskItem
                      key={task.title}
                      title={task.title}
                      project={task.project}
                      dueDate={task.dueDate}
                      priority={task.priority}
                    />
                  ))}
                </div>
                )}
              </DashboardCard>

              {/* Assigned to Me */}
              <DashboardCard
                title="Assigned to Me"
                icon={Users}
                action={{ label: "View all", onClick: () => {} }}
              >
                {data.assignedToMe.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Nothing assigned to you</p>
                ) : (
                <div className="space-y-1">
                  {data.assignedToMe.map((task) => (
                    <TaskItem
                      key={task.title}
                      title={task.title}
                      project={task.project}
                      assignee={task.assignee}
                      dueDate={task.dueDate}
                      priority={task.priority}
                    />
                  ))}
                </div>
                )}
              </DashboardCard>

              {/* Agenda */}
              <DashboardCard
                title="Agenda"
                icon={Calendar}
                emptyState={{
                  icon: Calendar,
                  message: "Your calendar events will appear here",
                  action: { label: "Add Event", onClick: () => {} },
                }}
              />

              {/* Recent Activity */}
              <DashboardCard title="Recent Activity" icon={Clock}>
                {data.recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No recent activity</p>
                ) : (
                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`size-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`size-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </DashboardCard>
            </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-4 flex-shrink-0 pt-16">
              <CalendarWidget
                year={calYear}
                month={calMonth}
                selectedDay={calDay}
                onYearChange={setCalYear}
                onMonthChange={setCalMonth}
                onDaySelect={setCalDay}
              />
              <TaskLineWidget year={calYear} month={calMonth} selectedDay={calDay} />
            </div>
          </div>
          )}
          <Footer />
        </main>
      </div>
    </div>
  );
}
