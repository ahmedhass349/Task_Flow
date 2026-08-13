// ── API Configuration for Task Flow ────────────────────────────────────────
//
// Centralized endpoint configuration for all API calls.
// Supports:
// 1. Tauri desktop app (gets backend URL via invoke('get_backend_url'))
// 2. Web dev server (uses localhost with proxy or environment variable)
// 3. Production deployment (uses configurable base URL)

// Detect if running in Tauri
const isTauri = typeof window !== 'undefined' && typeof (window as any).__TAURI_INTERNALS__ !== 'undefined';

// Initialize API base URL - resolved dynamically in Tauri desktop builds
let API_BASE_URL = "";
let apiBaseUrlInitialized = false;

// Get API base URL - handles both Tauri and web contexts
const initializeApiBaseUrl = async (): Promise<string> => {
  if (apiBaseUrlInitialized) {
    return API_BASE_URL;
  }

  if (isTauri) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const backendUrl = await invoke<string>('get_backend_url');
      if (backendUrl) {
        API_BASE_URL = backendUrl;
        apiBaseUrlInitialized = true;
        return backendUrl;
      }
      // Backend URL not available yet — caller should retry
      return "";
    } catch (error) {
      // IPC failed (e.g. CSP blocked the custom protocol before postMessage fallback).
      // Do NOT set apiBaseUrlInitialized = true here — the caller (initializeApi) will
      // retry after 500ms, and by then Tauri should have fallen back to the postMessage
      // interface, allowing the next invoke() attempt to succeed.
      return "";
    }
  }

  // Web context (dev server): relative URLs work via webpack proxy.
  // No need to retry — mark initialized immediately.
  API_BASE_URL = "";
  apiBaseUrlInitialized = true;
  return "";
};

// Helper function to build endpoint URL
const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

// Export initialization function for use in React app entry
// Retries up to 30 times (500ms apart) waiting for the backend URL to become available
// via Tauri IPC, so API calls use the correct backend origin.
export const initializeApi = async (): Promise<void> => {
  for (let i = 0; i < 30; i++) {
    const url = await initializeApiBaseUrl();
    if (url) return;
    await new Promise(r => setTimeout(r, 500));
  }
  // Final attempt — if still empty, fall back to relative URLs
  await initializeApiBaseUrl();
};

// Build endpoints object - these are functions that return the URL at call time
const createEndpoints = () => ({
  // Authentication endpoints
  auth: {
    login: buildUrl("/api/auth/login"),
    register: buildUrl("/api/auth/register"),
    logout: buildUrl("/api/auth/logout"),
    me: buildUrl("/api/auth/me"),
    forgotPassword: buildUrl("/api/auth/forgot-password"),
    resetPassword: buildUrl("/api/auth/reset-password"),
  },

  // Tasks endpoints
  tasks: {
    getAll: buildUrl("/api/tasks"),
    getById: (id: number) => buildUrl(`/api/tasks/${id}`),
    create: buildUrl("/api/tasks"),
    update: (id: number) => buildUrl(`/api/tasks/${id}`),
    delete: (id: number) => buildUrl(`/api/tasks/${id}`),
    toggleStar: (id: number) => buildUrl(`/api/tasks/${id}/star`),
    updateStatus: (id: number) => buildUrl(`/api/tasks/${id}/status`),
    getComments: (taskId: number) => buildUrl(`/api/tasks/${taskId}/comments`),
    createComment: (taskId: number) => buildUrl(`/api/tasks/${taskId}/comments`),
    updateComment: (id: number) => buildUrl(`/api/task-comments/${id}`),
    deleteComment: (id: number) => buildUrl(`/api/task-comments/${id}`),
  },

  // Projects endpoints
  projects: {
    getAll: buildUrl("/api/projects"),
    getById: (id: number) => buildUrl(`/api/projects/${id}`),
    create: buildUrl("/api/projects"),
    update: (id: number) => buildUrl(`/api/projects/${id}`),
    delete: (id: number) => buildUrl(`/api/projects/${id}`),
    toggleStar: (id: number) => buildUrl(`/api/projects/${id}/star`),
    getMembers: (id: number) => buildUrl(`/api/projects/${id}/members`),
  },

  // Teams endpoints (SQLite local)
  teams: {
    getAll: buildUrl("/api/teams"),
    getById: (id: number) => buildUrl(`/api/teams/${id}`),
    create: buildUrl("/api/teams"),
    update: (id: number) => buildUrl(`/api/teams/${id}`),
    delete: (id: number) => buildUrl(`/api/teams/${id}`),
    getMembers: (id: number) => buildUrl(`/api/teams/${id}/members`),
    addMember: (id: number) => buildUrl(`/api/teams/${id}/members`),
    removeMember: (id: number, memberUserId: number) => buildUrl(`/api/teams/${id}/members/${memberUserId}`),
  },

  // Teams invitation relay endpoints (MongoDB shared)
  teamsInvitations: {
    presence: buildUrl("/api/teams/presence"),
    searchUsers: (q: string) => buildUrl(`/api/teams/users/search?q=${encodeURIComponent(q)}`),
    sendInvitation: buildUrl("/api/teams/invitations/send"),
    cancelInvitation: (id: string) => buildUrl(`/api/teams/invitations/${id}/cancel`),
    incoming: buildUrl("/api/teams/invitations/incoming"),
    outgoing: buildUrl("/api/teams/invitations/outgoing"),
    accept: (id: string) => buildUrl(`/api/teams/invitations/${id}/accept`),
    decline: (id: string) => buildUrl(`/api/teams/invitations/${id}/decline`),
    sharedMembers: (teamId: string) => buildUrl(`/api/teams/${teamId}/members-shared`),
    removeSharedMember: (teamId: string, email: string) => buildUrl(`/api/teams/${teamId}/members-shared/${encodeURIComponent(email)}`),
  },

  // Dashboard endpoints
  dashboard: {
    stats: buildUrl("/api/dashboard/stats"),
    activity: buildUrl("/api/dashboard/activity"),
  },

  // Calendar events endpoints
  calendarEvents: {
    getAll: buildUrl("/api/calendar-events"),
    getById: (id: number) => buildUrl(`/api/calendar-events/${id}`),
    create: buildUrl("/api/calendar-events"),
    update: (id: number) => buildUrl(`/api/calendar-events/${id}`),
    delete: (id: number) => buildUrl(`/api/calendar-events/${id}`),
  },

  // Messages endpoints
  messages: {
    getContacts: buildUrl("/api/messages/contacts"),
    getConversation: (contactId: number) => buildUrl(`/api/messages/${contactId}`),
    send: buildUrl("/api/messages"),
  },

  // Notifications endpoints
  notifications: {
    getAll: buildUrl("/api/notifications"),
    markAsRead: (id: number) => buildUrl(`/api/notifications/${id}/read`),
    markAllAsRead: buildUrl("/api/notifications/read-all"),
  },

  // Settings endpoints
  settings: {
    getProfile: buildUrl("/api/settings/profile"),
    updateProfile: buildUrl("/api/settings/profile"),
    changePassword: buildUrl("/api/settings/password"),
    deleteAccount: buildUrl("/api/settings/account"),
  },

  // Chatbot endpoints
  chatbot: {
    getConversations: buildUrl("/api/chatbot/conversations"),
    getConversation: (id: number) => buildUrl(`/api/chatbot/conversations/${id}`),
    createConversation: buildUrl("/api/chatbot/conversations"),
    sendMessage: (id: number) => buildUrl(`/api/chatbot/conversations/${id}/messages`),
    deleteConversation: (id: number) => buildUrl(`/api/chatbot/conversations/${id}`),
  },

});

// Export ENDPOINTS - reassigned by refreshEndpoints() after async init resolves
export let ENDPOINTS = createEndpoints();

/**
 * Phase 3 fix: re-builds ENDPOINTS with the resolved API_BASE_URL.
 * Must be called after initializeApi() resolves (before root.render) so that
 * Tauri desktop apps get the correct localhost:PORT prefix on all URLs.
 */
export const refreshEndpoints = (): void => {
  ENDPOINTS = createEndpoints();
};

// Export function to get current base URL
export const getApiBaseUrl = (): string => API_BASE_URL;

// Export signal for when API is ready (retries until the backend URL is resolved)
export const getApiReady = async (): Promise<void> => {
  for (let i = 0; i < 30; i++) {
    const url = await initializeApiBaseUrl();
    if (url) return;
    await new Promise(r => setTimeout(r, 500));
  }
  await initializeApiBaseUrl();
};

// Export default base URL
export default API_BASE_URL;
