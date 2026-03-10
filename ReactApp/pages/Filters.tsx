import { Filter, Plus, Clock, Calendar, Users, Tag } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import DashboardCard from "../Components/DashboardCard";
import TaskItem from "../Components/TaskItem";

export default function Filters() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Filters</h1>
                <p className="text-gray-600 mt-1">Save and manage custom task filters</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="size-4" />
                <span>Create Filter</span>
              </button>
            </div>

            {/* Saved Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* High Priority Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Filter className="size-6 text-red-600" />
                    </div>
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                      12 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">High Priority</h3>
                  <p className="text-sm text-gray-600">All high priority tasks across projects</p>
                </div>
              </div>

              {/* Due This Week Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Calendar className="size-6 text-orange-600" />
                    </div>
                    <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">
                      8 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Due This Week</h3>
                  <p className="text-sm text-gray-600">Tasks with deadlines in the next 7 days</p>
                </div>
              </div>

              {/* Unassigned Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Users className="size-6 text-purple-600" />
                    </div>
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">
                      5 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Unassigned</h3>
                  <p className="text-sm text-gray-600">Tasks without an assigned team member</p>
                </div>
              </div>

              {/* Overdue Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Clock className="size-6 text-red-600" />
                    </div>
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
                      3 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Overdue</h3>
                  <p className="text-sm text-gray-600">Tasks that missed their deadline</p>
                </div>
              </div>

              {/* Design Tasks Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Tag className="size-6 text-blue-600" />
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      18 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Design Tasks</h3>
                  <p className="text-sm text-gray-600">All tasks tagged with "design"</p>
                </div>
              </div>

              {/* Development Filter */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Tag className="size-6 text-green-600" />
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      24 tasks
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Development</h3>
                  <p className="text-sm text-gray-600">All tasks tagged with "development"</p>
                </div>
              </div>
            </div>

            {/* Filter Results */}
            <DashboardCard
              title="High Priority Tasks"
              icon={Filter}
              action={{ label: "Clear filter", onClick: () => {} }}
            >
              <div className="space-y-1">
                <TaskItem
                  title="Fix critical bug in payment processing"
                  project="E-commerce"
                  dueDate="Mar 08"
                  priority="high"
                />
                <TaskItem
                  title="Design new landing page"
                  project="Marketing Site"
                  dueDate="Today"
                  priority="high"
                />
                <TaskItem
                  title="Implement authentication flow"
                  project="User Service"
                  dueDate="Mar 11"
                  priority="high"
                />
                <TaskItem
                  title="Complete security audit"
                  project="API Service"
                  dueDate="Mar 09"
                  priority="high"
                />
                <TaskItem
                  title="Design mobile mockups"
                  project="Mobile App"
                  dueDate="Mar 15"
                  priority="high"
                />
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
