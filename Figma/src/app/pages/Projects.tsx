import { FolderKanban, Grid3x3, List, MoreVertical, Star, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  tasks: { total: number; completed: number };
  members: number;
  starred: boolean;
}

export default function Projects() {
  const projects: Project[] = [
    {
      id: "1",
      name: "Marketing Site",
      description: "Company website redesign and development",
      color: "bg-blue-500",
      tasks: { total: 24, completed: 18 },
      members: 5,
      starred: true,
    },
    {
      id: "2",
      name: "API Service",
      description: "Backend API development and documentation",
      color: "bg-green-500",
      tasks: { total: 36, completed: 22 },
      members: 8,
      starred: false,
    },
    {
      id: "3",
      name: "Mobile App",
      description: "iOS and Android mobile application",
      color: "bg-purple-500",
      tasks: { total: 48, completed: 12 },
      members: 6,
      starred: true,
    },
    {
      id: "4",
      name: "Admin Panel",
      description: "Internal admin dashboard for operations",
      color: "bg-orange-500",
      tasks: { total: 28, completed: 20 },
      members: 4,
      starred: false,
    },
    {
      id: "5",
      name: "E-commerce",
      description: "Online store platform development",
      color: "bg-pink-500",
      tasks: { total: 42, completed: 30 },
      members: 7,
      starred: true,
    },
    {
      id: "6",
      name: "Developer Portal",
      description: "Documentation and API reference portal",
      color: "bg-blue-400",
      tasks: { total: 16, completed: 14 },
      members: 3,
      starred: false,
    },
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">Manage and track all your projects</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors">
                  <Grid3x3 className="size-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors">
                  <List className="size-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                All Projects
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Starred
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Active
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Archived
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Project Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${project.color} size-12 rounded-lg flex items-center justify-center`}>
                        <FolderKanban className="size-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                          <Star className={`size-5 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="size-5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {project.tasks.completed}/{project.tasks.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${project.color} h-2 rounded-full transition-all`}
                          style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="size-4" />
                        <span>{project.members} members</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((project.tasks.completed / project.tasks.total) * 100)}% complete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}