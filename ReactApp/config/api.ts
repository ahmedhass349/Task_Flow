// ── API Configuration for Task Flow ────────────────────────────────────────
//
// Centralized endpoint configuration for all API calls.
// Uses environment variable for base URL with fallback to localhost.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    me: `${API_BASE_URL}/api/auth/me`,
    forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
  },

  // Tasks endpoints
  tasks: {
    getAll: `${API_BASE_URL}/api/tasks`,
    getById: (id: number) => `${API_BASE_URL}/api/tasks/${id}`,
    create: `${API_BASE_URL}/api/tasks`,
    update: (id: number) => `${API_BASE_URL}/api/tasks/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/tasks/${id}`,
    toggleStar: (id: number) => `${API_BASE_URL}/api/tasks/${id}/star`,
    updateStatus: (id: number) => `${API_BASE_URL}/api/tasks/${id}/status`,
    getComments: (taskId: number) => `${API_BASE_URL}/api/tasks/${taskId}/comments`,
    createComment: (taskId: number) => `${API_BASE_URL}/api/tasks/${taskId}/comments`,
    updateComment: (id: number) => `${API_BASE_URL}/api/task-comments/${id}`,
    deleteComment: (id: number) => `${API_BASE_URL}/api/task-comments/${id}`,
  },

  // Projects endpoints
  projects: {
    getAll: `${API_BASE_URL}/api/projects`,
    getById: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
    create: `${API_BASE_URL}/api/projects`,
    update: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
    toggleStar: (id: number) => `${API_BASE_URL}/api/projects/${id}/star`,
    getMembers: (id: number) => `${API_BASE_URL}/api/projects/${id}/members`,
  },

  // Teams endpoints
  teams: {
    getAll: `${API_BASE_URL}/api/teams`,
    getById: (id: number) => `${API_BASE_URL}/api/teams/${id}`,
    create: `${API_BASE_URL}/api/teams`,
    update: (id: number) => `${API_BASE_URL}/api/teams/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/teams/${id}`,
    getMembers: (id: number) => `${API_BASE_URL}/api/teams/${id}/members`,
    addMember: (id: number) => `${API_BASE_URL}/api/teams/${id}/members`,
    removeMember: (id: number, memberUserId: number) => `${API_BASE_URL}/api/teams/${id}/members/${memberUserId}`,
  },

  // Dashboard endpoints
  dashboard: {
    stats: `${API_BASE_URL}/api/dashboard/stats`,
    activity: `${API_BASE_URL}/api/dashboard/activity`,
  },

  // Calendar events endpoints
  calendarEvents: {
    getAll: `${API_BASE_URL}/api/calendar-events`,
    getById: (id: number) => `${API_BASE_URL}/api/calendar-events/${id}`,
    create: `${API_BASE_URL}/api/calendar-events`,
    update: (id: number) => `${API_BASE_URL}/api/calendar-events/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/calendar-events/${id}`,
  },

  // Messages endpoints
  messages: {
    getContacts: `${API_BASE_URL}/api/messages/contacts`,
    getConversation: (contactId: number) => `${API_BASE_URL}/api/messages/${contactId}`,
    send: `${API_BASE_URL}/api/messages`,
  },

  // Notifications endpoints
  notifications: {
    getAll: `${API_BASE_URL}/api/notifications`,
    markAsRead: (id: number) => `${API_BASE_URL}/api/notifications/${id}/read`,
    markAllAsRead: `${API_BASE_URL}/api/notifications/read-all`,
  },

  // Settings endpoints
  settings: {
    getProfile: `${API_BASE_URL}/api/settings/profile`,
    updateProfile: `${API_BASE_URL}/api/settings/profile`,
    changePassword: `${API_BASE_URL}/api/settings/password`,
    deleteAccount: `${API_BASE_URL}/api/settings/account`,
  },

  // Chatbot endpoints
  chatbot: {
    getConversations: `${API_BASE_URL}/api/chatbot/conversations`,
    getConversation: (id: number) => `${API_BASE_URL}/api/chatbot/conversations/${id}`,
    createConversation: `${API_BASE_URL}/api/chatbot/conversations`,
    sendMessage: (id: number) => `${API_BASE_URL}/api/chatbot/conversations/${id}/messages`,
    deleteConversation: (id: number) => `${API_BASE_URL}/api/chatbot/conversations/${id}`,
  },
};

export default API_BASE_URL;
