import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, AuthResponse, LoginRequest, SignupRequest } from "../types";
import { api, ApiRequestError, setCurrentUserEmail } from "../services/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<{ user: User | null; isRestored: boolean }>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUserEmail = useCallback((u: User | null) => {
    setCurrentUserEmail(u?.email ?? null);
  }, []);

  useEffect(() => {
    api.get<User>("/api/auth/me")
      .then((userData) => {
        setUser(userData);
        syncUserEmail(userData);
      })
      .catch(() => {
        setUser(null);
        syncUserEmail(null);
      })
      .finally(() => {
        setIsLoading(false);
        setIsInitialized(true);
      });
  }, [syncUserEmail]);

  const login = useCallback(async (credentials: LoginRequest) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", credentials);
      const userData = (response as any).user ?? (response as any).User ?? null;
      const isRestored: boolean = (response as any).isRestored ?? (response as any).IsRestored ?? false;

      setUser(userData);
      syncUserEmail(userData);
      setIsInitialized(true);

      return { user: userData, isRestored };
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      throw err;
    }
  }, [syncUserEmail]);

  const signup = useCallback(async (data: SignupRequest) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/api/auth/register", data);
      const userData = (response as any).user ?? (response as any).User ?? null;
      setUser(userData);
      syncUserEmail(userData);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      throw err;
    }
  }, [syncUserEmail]);

  const logout = useCallback(() => {
    setUser(null);
    syncUserEmail(null);
    setError(null);
  }, [syncUserEmail]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const userData = await api.get<User>("/api/auth/me");
    setUser(userData);
    syncUserEmail(userData);
  }, [syncUserEmail]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    syncUserEmail(updatedUser);
  }, [syncUserEmail]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    isInitialized,
    login,
    signup,
    logout,
    error,
    clearError,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
