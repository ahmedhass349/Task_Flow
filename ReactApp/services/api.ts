import type { ApiError } from "../types";
import { getApiBaseUrl } from "../config/api";

// ── Auth state for header-based user switching ───────────────────────────

let currentUserEmail: string | null = null;

/** Set the email of the currently active user.  Sent as X-User-Email on every request. */
export function setCurrentUserEmail(email: string | null) {
  currentUserEmail = email;
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

/** Extracts a human-readable message from any thrown value. */
export function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

// ── Core fetch wrapper ───────────────────────────────────────────────────

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const baseUrl = getApiBaseUrl() || "";
  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (currentUserEmail) {
    headers["X-User-Email"] = currentUserEmail;
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
      message: (errorData as { message?: string } | null)?.message || `Request failed with status ${response.status}`,
      status: response.status,
      errors: (errorData as { errors?: Record<string, string[]> } | null)?.errors,
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

  const maybeWrapped = data as Record<string, unknown> | T;

  // Normalise casing: handle both "success" (camelCase) and "Success" (PascalCase).
  const isWrapped = typeof maybeWrapped === "object" && maybeWrapped !== null &&
    ("success" in maybeWrapped || "Success" in maybeWrapped);

  if (isWrapped) {
    const wrapped = maybeWrapped as Record<string, unknown>;
    const ok = wrapped.success ?? wrapped.Success;
    if (!ok) {
      throw new ApiRequestError({
        message: (wrapped.message as string) || (wrapped.Message as string) || "Request failed",
        status: response.status,
        errors: wrapped.errors as Record<string, string[]> | undefined,
      });
    }
    return ((wrapped.data ?? wrapped.Data ?? null) as T);
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
    const baseUrl = getApiBaseUrl() || "";
    const url = `${baseUrl}${endpoint}`;

    return fetch(url, { method: "POST", body: formData, signal })
      .then(async (response) => {
        if (response.status === 204) return undefined as T;
        const data: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          throw new ApiRequestError({
            message: (data as { message?: string } | null)?.message || `Upload failed with status ${response.status}`,
            status: response.status,
          });
        }
        const formDataWrapped = data as Record<string, unknown> | T;
        const isFormWrapped = typeof formDataWrapped === "object" && formDataWrapped !== null &&
          ("success" in formDataWrapped || "Success" in formDataWrapped);
        if (isFormWrapped) {
          const fw = formDataWrapped as Record<string, unknown>;
          const ok = fw.success ?? fw.Success;
          if (!ok) throw new ApiRequestError({ message: (fw.message as string) || (fw.Message as string) || "Upload failed", status: response.status });
          return ((fw.data ?? fw.Data ?? null) as T);
        }
        return data as T;
      });
  },
};
