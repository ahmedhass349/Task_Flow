// ── useProjects Hook ──────────────────────────────────────────────────────
//
// Custom hook for fetching and managing projects.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Project interface matching backend DTO
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

// Hook return type
interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  toggleStar: (id: string) => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

// Request types for CRUD operations
interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
}

interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Project[]>("/api/projects");
      if (!cancelled) {
        setProjects(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load projects";
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

  const toggleStar = useCallback(async (id: string) => {
    try {
      await api.patch(`/projects/${id}/star`);
      // Update local state to reflect change
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? { ...project, isStarred: !project.isStarred } : project
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to toggle project star";
      setError(message);
      throw err;
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectRequest) => {
    try {
      const newProject = await api.post<Project>("/projects", data);
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create project";
      setError(message);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: UpdateProjectRequest) => {
    try {
      const updatedProject = await api.put<Project>(`/projects/${id}`, data);
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? updatedProject : project
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update project";
      setError(message);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete project";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchData,
    toggleStar,
    createProject,
    updateProject,
    deleteProject,
  };
};
