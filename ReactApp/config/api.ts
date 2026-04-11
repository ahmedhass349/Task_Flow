// ── API Configuration for Task Flow ────────────────────────────────────────
//
// Centralized endpoint configuration for all API calls.
// Supports:
// 1. Electron desktop app (gets backend URL from main process)
// 2. Web dev server (uses localhost with proxy or environment variable)
// 3. Production deployment (uses configurable base URL)

// Detect if running in Electron (preload.js exposes window.electronAPI)
const isElectron = typeof window !== 'undefined' && (window as any).electronAPI !== undefined;

// Initialize API base URL - will be set dynamically for Electron
let API_BASE_URL = "";
let apiBaseUrlInitialized = false;

// Get API base URL - handles both Electron and web contexts
const initializeApiBaseUrl = async (): Promise<string> => {
  if (apiBaseUrlInitialized) {
    return API_BASE_URL;
  }

  if (isElectron && (window as any).electronAPI?.invoke) {
    try {
      const backendUrl = await (window as any).electronAPI.invoke('get-backend-url');
      if (backendUrl) {
        API_BASE_URL = backendUrl;
        apiBaseUrlInitialized = true;
        return backendUrl;
      }
    } catch (error) {
      // Failed to get Electron backend URL, will fall back to web context
    }
  }

  // Web context: use environment variable or empty string (will use relative URLs via webpack proxy)
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";
  API_BASE_URL = envUrl;
  apiBaseUrlInitialized = true;
  return envUrl;
};

// Helper function to build endpoint URL
const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

// Export initialization function for use in React app entry
export const initializeApi = async (): Promise<void> => {
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

// Export ENDPOINTS - this will be updated once API is initialized
export let ENDPOINTS = createEndpoints();

// Export function to get current base URL
export const getApiBaseUrl = (): string => API_BASE_URL;

// Export signal for when API is ready
export const getApiReady = async (): Promise<void> => {
  await initializeApiBaseUrl();
};

// Export default base URL
export default API_BASE_URL;
