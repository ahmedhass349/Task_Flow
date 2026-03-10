import { Clock, CheckSquare, Calendar, Users, FileText, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import TaskItem from "../components/TaskItem";

export default function Dashboard() {
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? "Good morning" : currentTime < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Greeting */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{greeting}, Demo User</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your projects today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CheckSquare className="size-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
                  <TrendingUp className="size-4" />
                  <span>12% from last week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="size-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>3 due this week</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="size-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>4 active projects</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">16</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="size-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
                  <span>12 online now</span>
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
                <div className="space-y-1">
                  <TaskItem
                    title="Design new landing page"
                    project="Marketing Site"
                    dueDate="Today"
                    priority="high"
                  />
                  <TaskItem
                    title="Review pull requests"
                    project="API Service"
                    dueDate="Tomorrow"
                    priority="medium"
                  />
                  <TaskItem
                    title="Update documentation"
                    project="Developer Portal"
                    dueDate="Mar 12"
                    priority="low"
                  />
                  <TaskItem
                    title="Fix bug in checkout flow"
                    project="E-commerce"
                    dueDate="Mar 15"
                    priority="high"
                  />
                </div>
              </DashboardCard>

              {/* Assigned to Me */}
              <DashboardCard
                title="Assigned to Me"
                icon={Users}
                action={{ label: "View all", onClick: () => {} }}
              >
                <div className="space-y-1">
                  <TaskItem
                    title="Implement authentication flow"
                    project="User Service"
                    assignee="Sarah Chen"
                    dueDate="Mar 11"
                    priority="high"
                  />
                  <TaskItem
                    title="Create wireframes for dashboard"
                    project="Admin Panel"
                    assignee="Mike Johnson"
                    dueDate="Mar 13"
                    priority="medium"
                  />
                  <TaskItem
                    title="Write unit tests"
                    project="API Service"
                    assignee="You"
                    dueDate="Mar 14"
                    priority="low"
                  />
                </div>
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
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="size-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="size-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Sarah Chen</span> completed "Design system update"
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="size-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Mike Johnson</span> created new project "Mobile App"
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="size-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Alex Kim</span> joined the team
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}