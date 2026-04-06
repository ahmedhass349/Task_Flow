// ── useMessages Hook ───────────────────────────────────────────────────────
//
// Custom hook for fetching and managing messages.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Contact interface matching backend DTO
interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// Message interface matching backend DTO
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  body: string;
  isRead: boolean;
  sentAt: string;
}

// Hook return type
interface UseMessagesReturn {
  contacts: Contact[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  refetchMessages: (contactId: string) => void;
  sendMessage: (contactId: string, body: string) => Promise<void>;
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  unreadCount: number;
}

export const useMessages = (): UseMessagesReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Contact[]>("/api/messages/contacts");
      if (!cancelled) {
        setContacts(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load contacts";
        setError(message);
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchMessages = useCallback(async (contactId: string) => {
    let cancelled = false;
    setError(null);

    try {
      const data = await api.get<Message[]>(`/api/messages/${contactId}`);
      if (!cancelled) {
        setMessages(data);
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load messages";
        setError(message);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(() => {
    fetchContacts();
    if (activeContactId) {
      fetchMessages(activeContactId);
    }
  }, [fetchContacts, fetchMessages, activeContactId]);

  const refetchMessages = useCallback((contactId: string) => {
    fetchMessages(contactId);
  }, [fetchMessages]);

  const sendMessage = useCallback(async (contactId: string, body: string) => {
    try {
      const newMessage = await api.post<Message>("/api/messages", { receiverId: contactId, body });
      setMessages(prev => [...prev, newMessage]);
      // Update contact's last message
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? { ...contact, lastMessage: body, lastMessageTime: newMessage.sentAt }
            : contact
        )
      );
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to send message";
      setError(message);
    }
  }, []);

  // Auto-fetch messages when active contact changes
  useEffect(() => {
    if (activeContactId) {
      fetchMessages(activeContactId);
    } else {
      setMessages([]);
    }
  }, [activeContactId, fetchMessages]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const unreadCount = contacts.reduce((total, contact) => total + contact.unreadCount, 0);

  return {
    contacts,
    messages,
    isLoading,
    error,
    refetch,
    refetchMessages,
    sendMessage,
    activeContactId,
    setActiveContactId,
    unreadCount,
  };
};
