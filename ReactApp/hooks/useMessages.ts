// ── useMessages Hook ───────────────────────────────────────────────────────
//
// Custom hook for fetching and managing messages.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiRequestError } from "../services/api";

// ── Types ─────────────────────────────────────────────────────────────────

export interface Contact {
  id: number;
  name: string;
  initials: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isStarred: boolean;
}

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  body: string;
  isRead: boolean;
  isSystemMessage: boolean;
  sentAt: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;   // "image" | "pdf" | "file"
  attachmentSize?: number;
}

export interface SendMessagePayload {
  receiverId: number;
  body?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
}

export interface UploadResult {
  url: string;
  name: string;
  type: string;
  size: number;
}

// Hook return type
interface UseMessagesReturn {
  contacts: Contact[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  refetchMessages: (contactId: number) => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  uploadAttachment: (file: File) => Promise<UploadResult>;
  resolveContact: (email: string) => Promise<Contact | null>;
  addContactLocally: (contact: Contact) => void;
  activeContactId: number | null;
  setActiveContactId: (id: number | null) => void;
  unreadCount: number;
  markConversationAsRead: (contactId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteConversation: (contactId: number) => Promise<void>;
}

// ── Helper ────────────────────────────────────────────────────────────────

function toContact(raw: any): Contact {
  const rawTime = raw.lastMessageTime;
  let lastMessageTime: string | undefined;
  if (rawTime && rawTime !== "0001-01-01T00:00:00") {
    lastMessageTime = rawTime;
  }
  return {
    id: raw.id,
    name: raw.name,
    initials: raw.initials ?? "",
    avatarUrl: raw.avatarUrl,
    lastMessage: raw.lastMessage,
    lastMessageTime,
    unreadCount: raw.unreadCount ?? 0,
    isStarred: raw.isStarred ?? false,
  };
}

function toMessage(raw: any): Message {
  return {
    id: raw.id,
    senderId: raw.senderId,
    senderName: raw.senderName ?? "",
    receiverId: raw.receiverId,
    body: raw.body ?? "",
    isRead: raw.isRead ?? false,
    isSystemMessage: raw.isSystemMessage ?? false,
    sentAt: raw.sentAt,
    attachmentUrl: raw.attachmentUrl ?? undefined,
    attachmentName: raw.attachmentName ?? undefined,
    attachmentType: raw.attachmentType ?? undefined,
    attachmentSize: raw.attachmentSize ?? undefined,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────

export const useMessages = (): UseMessagesReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable ref so event listeners always see the latest activeContactId
  const activeContactIdRef = useRef<number | null>(null);
  useEffect(() => {
    activeContactIdRef.current = activeContactId;
  }, [activeContactId]);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/api/messages/contacts");
      setContacts((data ?? []).map(toContact));
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message
          : err instanceof Error ? err.message
          : "Failed to load contacts"
      );
    }
  }, []);

  const fetchMessages = useCallback(async (contactId: number) => {
    try {
      const data = await api.get<any[]>(`/api/messages/${contactId}`);
      setMessages((data ?? []).map(toMessage));
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message
          : err instanceof Error ? err.message
          : "Failed to load messages"
      );
    }
  }, []);

  const refetch = useCallback(() => {
    fetchContacts();
    if (activeContactIdRef.current !== null) {
      fetchMessages(activeContactIdRef.current);
    }
  }, [fetchContacts, fetchMessages]);

  const refetchMessages = useCallback((contactId: number) => {
    fetchMessages(contactId);
  }, [fetchMessages]);

  // ── addContactLocally ────────────────────────────────────────────────────
  // Adds a resolved contact to the local list so the chat pane opens
  // immediately even before the first message is sent.
  const addContactLocally = useCallback((contact: Contact) => {
    setContacts(prev => {
      if (prev.some(c => c.id === contact.id)) return prev;
      return [contact, ...prev];
    });
  }, []);

  // ── sendMessage ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    try {
      const raw = await api.post<any>("/api/messages", payload);
      const newMessage = toMessage(raw);
      setMessages(prev => [...prev, newMessage]);
      // Upsert the contact in the sidebar (add if new, update lastMessage if existing)
      setContacts(prev => {
        const exists = prev.some(c => c.id === payload.receiverId);
        if (exists) {
          return prev.map(c =>
            c.id === payload.receiverId
              ? { ...c, lastMessage: payload.body || payload.attachmentName, lastMessageTime: newMessage.sentAt }
              : c
          );
        }
        // Not yet in list (theoretically addContactLocally should have been called,
        // but guard anyway with a minimal entry that fetchContacts will soon enrich).
        return prev;
      });
      // Re-sync contact list from backend (updates ordering, last-message, unread counts)
      fetchContacts();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message
          : err instanceof Error ? err.message
          : "Failed to send message"
      );
      throw err;
    }
  }, [fetchContacts]);

  const uploadAttachment = useCallback(async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    const raw = await api.postForm<any>("/api/messages/upload", formData);
    return { url: raw.url, name: raw.name, type: raw.type, size: raw.size };
  }, []);

  const resolveContact = useCallback(async (email: string): Promise<Contact | null> => {
    try {
      const raw = await api.post<any>("/api/messages/resolve-contact", { email });
      return toContact(raw);
    } catch {
      return null;
    }
  }, []);

  const markConversationAsRead = useCallback(async (contactId: number) => {
    try {
      await api.patch(`/api/messages/${contactId}/read`);
      setContacts(prev => prev.map(c =>
        c.id === contactId ? { ...c, unreadCount: 0 } : c
      ));
      setMessages(prev => prev.map(m =>
        m.receiverId !== contactId ? { ...m, isRead: true } : m
      ));
    } catch { /* non-critical */ }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/api/messages/read-all");
      setContacts(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
    } catch { /* non-critical */ }
  }, []);

  const deleteConversation = useCallback(async (contactId: number) => {
    try {
      await api.delete(`/api/messages/conversation/${contactId}`);
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setActiveContactId(null);
      setMessages([]);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message
          : err instanceof Error ? err.message
          : "Failed to delete conversation"
      );
      throw err;
    }
  }, []);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api.get<any[]>("/api/messages/contacts")
      .then(data => { if (!cancelled) setContacts((data ?? []).map(toContact)); })
      .catch(err => {
        if (!cancelled) setError(
          err instanceof ApiRequestError ? err.message
            : err instanceof Error ? err.message
            : "Failed to load contacts"
        );
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Load messages when active contact changes ────────────────────────────
  useEffect(() => {
    if (activeContactId !== null) {
      fetchMessages(activeContactId);
    } else {
      setMessages([]);
    }
  }, [activeContactId, fetchMessages]);

  // ── Real-time: refresh when a MessageReceived notification arrives ────────
  useEffect(() => {
    const handleNotification = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.type) return;
      const type = (detail.type as string).toLowerCase();
      if (type === "messagereceived") {
        fetchContacts();
        if (activeContactIdRef.current !== null) {
          fetchMessages(activeContactIdRef.current);
        }
      }
    };
    window.addEventListener("taskflow:notification-received", handleNotification);
    return () => window.removeEventListener("taskflow:notification-received", handleNotification);
  }, [fetchContacts, fetchMessages]);

  // ── Refresh on visibility/focus (fixes "hard reload needed") ─────────────
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchContacts();
        if (activeContactIdRef.current !== null) {
          fetchMessages(activeContactIdRef.current);
        }
      }
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchContacts, fetchMessages]);

  const unreadCount = contacts.reduce((total, c) => total + c.unreadCount, 0);

  return {
    contacts,
    messages,
    isLoading,
    error,
    refetch,
    refetchMessages,
    sendMessage,
    uploadAttachment,
    resolveContact,
    addContactLocally,
    activeContactId,
    setActiveContactId,
    unreadCount,
    markConversationAsRead,
    markAllAsRead,
    deleteConversation,
  };
};
