import { CheckSquare, Clock, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskItem from "../components/TaskItem";

export default function MyWork() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Work</h1>
              <p className="text-gray-600 mt-1">All tasks assigned to you across projects</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex gap-6">
                <button className="pb-3 border-b-2 border-blue-500 text-blue-600 font-medium">
                  Worked on
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium">
                  Viewed
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
                  Assigned to me
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">8</span>
                </button>
                <button className="pb-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium">
                  Starred
                </button>
              </nav>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {/* Overdue */}
              <div className="bg-white border border-red-200 rounded-xl overflow-hidden">
                <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center gap-2">
                  <AlertCircle className="size-5 text-red-600" />
                  <h2 className="font-semibold text-red-900">Overdue (2)</h2>
                </div>
                <div className="p-6 space-y-1">
                  <TaskItem
                    title="Fix critical bug in payment processing"
                    project="E-commerce"
                    dueDate="Mar 08"
                    priority="high"
                  />
                  <TaskItem
                    title="Complete security audit"
                    project="API Service"
                    dueDate="Mar 09"
                    priority="high"
                  />
                </div>
              </div>

              {/* Today */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <Clock className="size-5 text-orange-600" />
                  <h2 className="font-semibold text-gray-900">Today (4)</h2>
                </div>
                <div className="p-6 space-y-1">
                  <TaskItem
                    title="Design new landing page"
                    project="Marketing Site"
                    dueDate="Today"
                    priority="high"
                  />
                  <TaskItem
                    title="Review pull requests"
                    project="API Service"
                    dueDate="Today"
                    priority="medium"
                  />
                  <TaskItem
                    title="Update user documentation"
                    project="Developer Portal"
                    dueDate="Today"
                    priority="low"
                  />
                  <TaskItem
                    title="Team standup meeting"
                    project="Admin Panel"
                    dueDate="Today"
                    priority="medium"
                  />
                </div>
              </div>

              {/* This Week */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <CheckSquare className="size-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">This Week (6)</h2>
                </div>
                <div className="p-6 space-y-1">
                  <TaskItem
                    title="Implement authentication flow"
                    project="User Service"
                    dueDate="Mar 11"
                    priority="high"
                  />
                  <TaskItem
                    title="Create wireframes for dashboard"
                    project="Admin Panel"
                    dueDate="Mar 12"
                    priority="medium"
                  />
                  <TaskItem
                    title="Write unit tests"
                    project="API Service"
                    dueDate="Mar 13"
                    priority="low"
                  />
                  <TaskItem
                    title="Setup CI/CD pipeline"
                    project="DevOps"
                    dueDate="Mar 14"
                    priority="medium"
                  />
                  <TaskItem
                    title="Design mobile mockups"
                    project="Mobile App"
                    dueDate="Mar 15"
                    priority="high"
                  />
                  <TaskItem
                    title="Code review session"
                    project="API Service"
                    dueDate="Mar 15"
                    priority="low"
                  />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <CheckSquare className="size-5 text-green-600" />
                  <h2 className="font-semibold text-gray-900">Completed (5)</h2>
                </div>
                <div className="p-6 space-y-1">
                  <TaskItem
                    title="Research competitor features"
                    project="Marketing Site"
                    dueDate="Mar 09"
                    completed
                  />
                  <TaskItem
                    title="Database optimization"
                    project="API Service"
                    dueDate="Mar 08"
                    completed
                  />
                  <TaskItem
                    title="User interview sessions"
                    project="UX Research"
                    dueDate="Mar 07"
                    completed
                  />
                  <TaskItem
                    title="Sprint planning meeting"
                    project="Team"
                    dueDate="Mar 06"
                    completed
                  />
                  <TaskItem
                    title="Update project timeline"
                    project="Admin Panel"
                    dueDate="Mar 05"
                    completed
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}