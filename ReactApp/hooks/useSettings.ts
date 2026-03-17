// ── useSettings Hook ───────────────────────────────────────────────────────
//
// Custom hook for fetching and managing user settings.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Profile interface matching backend DTO
interface Profile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  company?: string;
  country?: string;
  phone?: string;
  timezone?: string;
  createdAt: string;
}

// Hook return type
interface UseSettingsReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// Request types for settings operations
interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
  company?: string;
  country?: string;
  phone?: string;
  timezone?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useSettings = (): UseSettingsReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Profile>("/api/settings/profile");
      if (!cancelled) {
        setProfile(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load profile";
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

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const updatedProfile = await api.put<Profile>("/settings/profile", data);
      setProfile(updatedProfile);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update profile";
      setError(message);
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      await api.put("/settings/password", data);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to change password";
      setError(message);
      throw err;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await api.delete("/settings/account");
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete account";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchData,
    updateProfile,
    changePassword,
    deleteAccount,
  };
};
