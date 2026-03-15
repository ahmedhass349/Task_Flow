// ── Auth Context ─────────────────────────────────────────────────────────
//
// Provides app-wide authentication state:
// - Current user object (null when logged out)
// - login / signup / logout actions
// - Loading state for initial auth check
// - isAuthenticated derived boolean
//
// Wraps the entire app so every component can access auth via useAuth().

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, AuthResponse, LoginRequest, SignupRequest } from "../types";
import { api, setAuthToken, getAuthToken, clearAuthToken, ApiRequestError } from "../services/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, check if we have a stored token and validate it
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Validate the stored token by fetching the current user
    let cancelled = false;
    api
      .get<User>("/auth/me")
      .then((userData) => {
        if (!cancelled) {
          setUser(userData);
        }
      })
      .catch(() => {
        // Token is invalid/expired -- clear it
        if (!cancelled) {
          clearAuthToken();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      setAuthToken(response.token);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      throw err;
    }
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      setAuthToken(response.token);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    signup,
    logout,
    error,
    clearError,
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
