// ── useChatbot Hook ───────────────────────────────────────────────────────
//
// Custom hook for fetching and managing chatbot conversations.
// Provides loading, error, data, and refetch states.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// Chatbot message interface matching backend DTO
interface ChatbotMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

// Chatbot conversation interface matching backend DTO
interface ChatbotConversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatbotMessage[];
}

// Conversation list item (simplified for list view)
interface ConversationListItem {
  id: string;
  title: string;
  updatedAt: string;
}

// Hook return type
interface UseChatbotReturn {
  conversations: ChatbotConversation[];
  conversationList: ConversationListItem[];
  activeConversation: ChatbotConversation | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  refetchActiveConversation: (id: string) => void;
  createConversation: (data: CreateConversationRequest) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
  activeConversationId: string | null;
}

// Request types for chatbot operations
interface CreateConversationRequest {
  title: string;
}

interface SendMessageRequest {
  text: string;
}

export const useChatbot = (): UseChatbotReturn => {
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [conversationList, setConversationList] = useState<ConversationListItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<ChatbotConversation[]>("/api/chatbot/conversations");
      if (!cancelled) {
        setConversations(data);
        setConversationList(data.map(conv => ({
          id: conv.id,
          title: conv.title,
          updatedAt: conv.updatedAt,
        })));
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load conversations";
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

  const fetchConversation = useCallback(async (id: string) => {
    let cancelled = false;
    setError(null);

    try {
      const data = await api.get<ChatbotConversation>(`/api/chatbot/conversations/${id}`);
      if (!cancelled) {
        setConversations(prev =>
          prev.map(conv => conv.id === id ? data : conv)
        );
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load conversation";
        setError(message);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const refetch = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  const refetchActiveConversation = useCallback((id: string) => {
    fetchConversation(id);
  }, [fetchConversation]);

  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    try {
      const newConversation = await api.post<ChatbotConversation>("/chatbot/conversations", data);
      setConversations(prev => [...prev, newConversation]);
      setConversationList(prev => [...prev, {
        id: newConversation.id,
        title: newConversation.title,
        updatedAt: newConversation.updatedAt,
      }]);
      setActiveConversationId(newConversation.id);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create conversation";
      setError(message);
      throw err;
    }
  }, []);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    try {
      const newMessage = await api.post<ChatbotMessage>(`/chatbot/conversations/${conversationId}/messages`, { text });
      
      // Update the conversation with the new message
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: newMessage.createdAt,
            };
          }
          return conv;
        })
      );

      // Update conversation list
      setConversationList(prev =>
        prev.map(item => 
          item.id === conversationId 
            ? { ...item, updatedAt: newMessage.createdAt }
            : item
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
      throw err;
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await api.delete(`/chatbot/conversations/${id}`);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      setConversationList(prev => prev.filter(item => item.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to delete conversation";
      setError(message);
      throw err;
    }
  }, [activeConversationId]);

  const setActiveConversationIdCallback = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || null;

  return {
    conversations,
    conversationList,
    activeConversation,
    isLoading,
    error,
    refetch,
    refetchActiveConversation,
    createConversation,
    sendMessage,
    deleteConversation,
    setActiveConversationId: setActiveConversationIdCallback,
    activeConversationId,
  };
};
