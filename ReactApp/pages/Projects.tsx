import { useState } from "react";
import { FolderKanban, Grid3x3, List, MoreVertical, Star, Users } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";
import { useProjects } from "../hooks/useProjects";

interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
  isStarred: boolean;
  createdAt: string;
  tasksTotal: number;
  tasksCompleted: number;
  memberCount: number;
  ownerName?: string;
}

export default function Projects() {
  const { projects, isLoading, error, refetch, toggleStar } = useProjects();

  const handleRetry = () => {
    refetch();
  };

  const handleToggleStar = async (projectId: string) => {
    try {
      await toggleStar(projectId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

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
                <button aria-label="Grid view" className="p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors">
                  <Grid3x3 className="size-5" />
                </button>
                <button aria-label="List view" className="p-2 text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-colors">
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

            {/* Loading / Error / Empty / Content */}
            {isLoading && <PageLoading message="Loading projects..." />}
            {error && <PageError message={error} onRetry={handleRetry} />}
            {!isLoading && !error && projects.length === 0 && (
              <PageEmpty
                icon={FolderKanban}
                title="No projects yet"
                description="Create your first project to start organizing your work."
                action={{ label: "Create Project", onClick: () => {} }}
              />
            )}
            {!isLoading && !error && projects.length > 0 && (
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
                        <button 
                          aria-label={project.isStarred ? "Unstar project" : "Star project"} 
                          className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                          onClick={() => handleToggleStar(project.id)}
                        >
                          <Star className={`size-5 ${project.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </button>
                        <button aria-label="Project options" className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
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
                          {project.tasksCompleted}/{project.tasksTotal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${project.color} h-2 rounded-full transition-all`}
                          style={{ width: `${(project.tasksCompleted / project.tasksTotal) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="size-4" />
                        <span>{project.memberCount} members</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((project.tasksCompleted / project.tasksTotal) * 100)}% complete
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
