// ── useProjects Hook ──────────────────────────────────────────────────────
//
// Custom hook for fetching and managing projects.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, extractErrorMessage } from "../services/api";

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
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Project[]>("/api/projects");
      setProjects(data ?? []);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load projects"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStar = useCallback(async (id: string) => {
    try {
      await api.patch(`/api/projects/${id}/star`);
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? { ...project, isStarred: !project.isStarred } : project
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to toggle project star"));
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectRequest) => {
    try {
      const newProject = await api.post<Project>("/api/projects", data);
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to create project"));
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: UpdateProjectRequest) => {
    try {
      const updatedProject = await api.put<Project>(`/api/projects/${id}`, data);
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? updatedProject : project
        )
      );
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to update project"));
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete project"));
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api.get<Project[]>("/api/projects")
      .then(data => { if (!cancelled) setProjects(data ?? []); })
      .catch((err: unknown) => {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load projects"));
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

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
