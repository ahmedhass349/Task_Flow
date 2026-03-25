import { useState, useEffect } from "react";
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
import { useDashboard } from "../hooks/useDashboard";
import { useTasks } from "../hooks/useTasks";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { stats, recentActivity, isLoading: isDashboardLoading, error, refetch } = useDashboard();
  const { tasks, isLoading: isTasksLoading } = useTasks();

  const activeTasks = tasks.filter((t: any) => t.status !== "Completed");
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth()); 
  const [calDay, setCalDay] = useState(now.getDate());

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";
  const displayName = user ? user.fullName : "Demo User";

  const handleRetry = () => {
    refetch();
  };

  const testToast = () => {
    addToast({
      title: "Test Notification",
      message: "This is a test in-app notification!",
      type: "info",
      duration: 5000,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          {isDashboardLoading && <PageLoading message="Loading dashboard..." />}
          {error && <PageError message={error} onRetry={handleRetry} />}
          {!isDashboardLoading && !error && stats && (
          <div className="flex gap-6 p-6 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            {/* Greeting */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{greeting}, {displayName}</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your projects today</p>
              <button 
                onClick={testToast}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Test Toast Notification
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeTasks}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckSquare className="size-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>{stats.tasksTrend}% from last week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="size-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{stats.dueThisWeek} due this week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.projects}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="size-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{stats.activeProjects} active projects</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.teamMembers}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="size-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>{stats.onlineNow} online now</span>
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
                {activeTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No tasks assigned yet</p>
                ) : (
                  <div className="space-y-4 mt-2">
                    {activeTasks.slice(0, 4).map((t: any) => (
                      <div key={`mywork-${t.id}`} className="flex items-start gap-3">
                        <div className={`mt-0.5 size-4 rounded-full border flex-shrink-0 ${t.priority === 'High' ? 'border-red-500 bg-red-50' : t.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-gray-50'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                           {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      </div>
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
                {activeTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">Nothing assigned to you</p>
                ) : (
                  <div className="space-y-4 mt-2">
                    {activeTasks.slice(0, 4).map((t: any) => (
                      <div key={`assigned-${t.id}`} className="flex items-start gap-3">
                        <div className={`mt-0.5 size-4 rounded-full border flex-shrink-0 ${t.priority === 'High' ? 'border-red-500 bg-red-50' : t.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-gray-50'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                           {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      </div>
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
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No recent activity</p>
                ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
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
                tasks={tasks}
              />
              <TaskLineWidget 
                year={calYear} 
                month={calMonth} 
                selectedDay={calDay} 
                tasks={tasks} 
              />
            </div>
          </div>
          )}
          <Footer />
        </main>
      </div>
    </div>
  );
}
