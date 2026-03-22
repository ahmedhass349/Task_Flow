// ── useSettings Hook ───────────────────────────────────────────────────────
//
// Custom hook that wraps AuthContext for settings operations.
// Uses AuthContext as single source of truth for user data.

import { useAuth } from "../context/AuthContext";
import { api, ApiRequestError } from "../services/api";
import type { User, UpdateProfileRequest, ChangePasswordRequest } from "../types";

export const useSettings = () => {
  const { user, updateUser, refreshUser } = useAuth();

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const response = await api.put<{ token: string; user: User }>("/api/settings/profile", data);
      updateUser(response.user, response.token);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update profile";
      throw new Error(message);
    }
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      await api.put("/api/settings/password", data);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to change password";
      throw new Error(message);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/api/settings/account");
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete account";
      throw new Error(message);
    }
  };

  return {
    profile: user,
    isLoading: false,
    error: null,
    refetch: refreshUser,
    updateProfile,
    changePassword,
    deleteAccount,
  };
};
