// ── Centralized API Service for Task Flow ────────────────────────────────
//
// All API calls go through this module. It provides:
// - Base URL configuration
// - Automatic auth token injection
// - Consistent error handling
// - Typed request/response helpers
//
// Usage example available in repository docs or README.

import type { ApiError, ApiResponse } from "../types";
import { getApiBaseUrl } from "../config/api";

// ── Token management ─────────────────────────────────────────────────────

let authToken: string | null = null;
const TOKEN_KEY = "taskflow_token";
const SESSION_TOKEN_KEY = "taskflow_session_token";
const REMEMBER_ME_KEY = "taskflow_remember_me";

export function getRememberMePreference(): boolean {
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function setRememberMePreference(rememberMe: boolean): void {
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? "true" : "false");

  const localToken = localStorage.getItem(TOKEN_KEY);
  const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const tokenToKeep = localToken || sessionToken;

  if (!tokenToKeep) {
    return;
  }

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, tokenToKeep);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } else {
    sessionStorage.setItem(SESSION_TOKEN_KEY, tokenToKeep);
    localStorage.removeItem(TOKEN_KEY);
  }

  authToken = tokenToKeep;
}

export function setAuthToken(token: string | null, rememberMe = true): void {
  authToken = token;
  if (token) {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_ME_KEY, "true");
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    } else {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_ME_KEY, "false");
      localStorage.removeItem(TOKEN_KEY);
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    authToken = rememberMe
      ? localStorage.getItem(TOKEN_KEY)
      : sessionStorage.getItem(SESSION_TOKEN_KEY);
  }
  return authToken;
}

export function clearAuthToken(): void {
  authToken = null;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

// ── Error class ──────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiRequestError";
    this.status = apiError.status;
    this.errors = apiError.errors;
  }
}

// ── Core fetch wrapper ───────────────────────────────────────────────────

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const baseUrl = getApiBaseUrl() || (import.meta as any).env?.VITE_API_BASE_URL || "";
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method,
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Check response status BEFORE trying to parse JSON
  if (!response.ok) {
    // Try to get error details from body if possible
    let errorData: unknown;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        errorData = await response.json();
      }
    } catch {
      // If we can't parse error body, continue with status-based error
    }
    
    throw new ApiRequestError({
      message: (errorData as any)?.message || `Request failed with status ${response.status}`,
      status: response.status,
      errors: (errorData as any)?.errors,
    });
  }

  // Try to parse response body (only for successful responses)
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiRequestError({
      message: "Failed to parse server response",
      status: response.status,
    });
  }

  // Successful HTTP status. Most backend endpoints wrap payload in ApiResponse<T>.
  const maybeWrapped = data as ApiResponse<T> | T;

  if (typeof maybeWrapped === "object" && maybeWrapped !== null && "success" in maybeWrapped) {
    const wrapped = maybeWrapped as ApiResponse<T>;
    if (!wrapped.success) {
      throw new ApiRequestError({
        message: wrapped.message || "Request failed",
        status: response.status,
        errors: wrapped.errors,
      });
    }
    return (wrapped.data ?? (null as T));
  }

  return maybeWrapped as T;
}

// ── Public API methods ───────────────────────────────────────────────────

export const api = {
  get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: "GET", signal });
  },

  post<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: "POST", body, signal });
  },

  put<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: "PUT", body, signal });
  },

  patch<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: "PATCH", body, signal });
  },

  delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return request<T>(endpoint, { method: "DELETE", signal });
  },

  /** Upload FormData (multipart) — does NOT set Content-Type so the browser adds the boundary. */
  postForm<T>(endpoint: string, formData: FormData, signal?: AbortSignal): Promise<T> {
    const baseUrl = getApiBaseUrl() || (import.meta as any).env?.VITE_API_BASE_URL || "";
    const url = `${baseUrl}${endpoint}`;
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

    return fetch(url, { method: "POST", headers, body: formData, signal })
      .then(async (response) => {
        if (response.status === 204) return undefined as T;
        const data: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          throw new ApiRequestError({
            message: (data as any)?.message || `Upload failed with status ${response.status}`,
            status: response.status,
          });
        }
        const maybe = data as any;
        if (maybe && "success" in maybe) {
          if (!maybe.success) throw new ApiRequestError({ message: maybe.message || "Upload failed", status: response.status });
          return (maybe.data ?? null) as T;
        }
        return data as T;
      });
  },
};
