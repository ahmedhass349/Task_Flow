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
import { api, setAuthToken, getAuthToken, clearAuthToken, getRememberMePreference, ApiRequestError } from "../services/api";
import { saveAccount } from "../hooks/useAccountSwitcher";

const USER_CACHE_KEY = "taskflow_cached_user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<User | null>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: User, newToken: string) => void;
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

    // If rememberMe is active, immediately restore the cached user to prevent
    // a redirect to /login while the backend validation request is in-flight
    // (e.g. when Electron restarts and the backend hasn't responded yet).
    if (getRememberMePreference()) {
      try {
        const raw = localStorage.getItem(USER_CACHE_KEY);
        if (raw) setUser(JSON.parse(raw) as User);
      } catch { /* ignore corrupt cache */ }
    }

    // Validate the stored token by fetching the current user
    let cancelled = false;
    api
      .get<User>("/api/auth/me")
      .then((userData) => {
        if (!cancelled) {
          setUser(userData);
          // Keep cache up to date for next startup
          if (getRememberMePreference()) {
            localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
          }
        }
      })
      .catch((err) => {
        // Clear auth on explicit auth failures or when the account no longer exists.
        // Network/transient server errors should not log the user out.
        if (!cancelled && err instanceof ApiRequestError && (err.status === 401 || err.status === 403 || err.status === 404)) {
          clearAuthToken();
          localStorage.removeItem(USER_CACHE_KEY);
          setUser(null);
        }
        // For network/server errors, keep the cached user so the session survives a slow startup.
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

  const login = useCallback(async (credentials: LoginRequest, rememberMe = false) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", credentials);
      const token = (response as any).token ?? (response as any).Token ?? null;
      const user = (response as any).user ?? (response as any).User ?? null;
      setAuthToken(token, rememberMe);
      setUser(user);
      if (token && user) {
        saveAccount(user.email, user.fullName, token, user.avatarUrl ?? undefined);
        if (rememberMe) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      }
      return user;
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
      const response = await api.post<AuthResponse>("/api/auth/register", data);
      const token = (response as any).token ?? (response as any).Token ?? null;
      const user = (response as any).user ?? (response as any).User ?? null;
      setAuthToken(token);
      setUser(user);
      if (token && user) saveAccount(user.email, user.fullName, token, user.avatarUrl ?? undefined);
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
    localStorage.removeItem(USER_CACHE_KEY);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.get<User>("/api/auth/me");
      setUser(userData);
    } catch (err) {
      // Don't clear token on refresh failure, error will be handled by caller
    }
  }, []);

  const updateUser = useCallback((updatedUser: User, newToken: string) => {
    setAuthToken(newToken);
    setUser(updatedUser);
    if (getRememberMePreference()) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updatedUser));
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    token: getAuthToken(),
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
