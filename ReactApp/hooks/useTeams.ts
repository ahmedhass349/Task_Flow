// ── useTeams Hook ────────────────────────────────────────────────────────
//
// Custom hook for fetching and managing teams.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Team member interface matching backend DTO
interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Member" | "Admin";
  status: "active" | "invited" | "inactive";
  avatarUrl?: string;
}

// Team interface matching backend DTO
interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  members: TeamMember[];
  memberCount: number;
}

// Hook return type
interface UseTeamsReturn {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createTeam: (data: CreateTeamRequest) => Promise<void>;
  updateTeam: (id: string, data: UpdateTeamRequest) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMember: (teamId: string, data: AddTeamMemberRequest) => Promise<void>;
  removeMember: (teamId: string, memberUserId: string) => Promise<void>;
}

// Request types for CRUD operations
interface CreateTeamRequest {
  name: string;
  description?: string;
}

interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

interface AddTeamMemberRequest {
  userId: string;
  role: "Member" | "Admin";
}

export const useTeams = (): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Team[]>("/api/teams");
      if (!cancelled) {
        setTeams(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load teams";
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

  const createTeam = useCallback(async (data: CreateTeamRequest) => {
    try {
      const newTeam = await api.post<Team>("/teams", data);
      setTeams(prev => [...prev, newTeam]);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create team";
      setError(message);
      throw err;
    }
  }, []);

  const updateTeam = useCallback(async (id: string, data: UpdateTeamRequest) => {
    try {
      const updatedTeam = await api.put<Team>(`/teams/${id}`, data);
      setTeams(prev =>
        prev.map(team =>
          team.id === id ? updatedTeam : team
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update team";
      setError(message);
      throw err;
    }
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    try {
      await api.delete(`/teams/${id}`);
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete team";
      setError(message);
      throw err;
    }
  }, []);

  const addMember = useCallback(async (teamId: string, data: AddTeamMemberRequest) => {
    try {
      await api.post(`/teams/${teamId}/members`, data);
      // Refetch to get updated member list
      fetchData();
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to add team member";
      setError(message);
      throw err;
    }
  }, [fetchData]);

  const removeMember = useCallback(async (teamId: string, memberUserId: string) => {
    try {
      await api.delete(`/teams/${teamId}/members/${memberUserId}`);
      // Refetch to get updated member list
      fetchData();
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove team member";
      setError(message);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    teams,
    isLoading,
    error,
    refetch: fetchData,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
  };
};
