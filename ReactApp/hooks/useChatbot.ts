// ── useChatbot Hook ───────────────────────────────────────────────────────
//
// Custom hook for fetching and managing chatbot conversations.
// Provides loading, error, data, streaming, and refetch states.

import { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiRequestError, getAuthToken } from "../services/api";
import { getApiBaseUrl } from "../config/api";

// Chatbot message interface matching backend DTO
interface ChatbotMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  text: string;
  isEdited?: boolean;
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
  messageCount?: number;
  lastMessagePreview?: string;
  usedModes?: string[];
}

// Hook return type
interface UseChatbotReturn {
  conversations: ChatbotConversation[];
  conversationList: ConversationListItem[];
  activeConversation: ChatbotConversation | null;
  isLoading: boolean;
  isStreaming: boolean;
  streamingText: string;
  error: string | null;
  refetch: () => void;
  refetchActiveConversation: (id: string) => void;
  createConversation: (data: CreateConversationRequest) => Promise<string>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  streamMessage: (conversationId: string, text: string, fileContent?: string, fileName?: string, attachedFileBase64?: string, attachedFileMimeType?: string, chatMode?: string) => Promise<void>;
  editMessageAndRestream: (conversationId: string, messageId: string, newText: string, chatMode?: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  clearAllConversations: () => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
  activeConversationId: string | null;
}

// Request types for chatbot operations
interface CreateConversationRequest {
  title: string;
}

// ── Normalizers ───────────────────────────────────────────────────────────
function normalizeMsg(m: any, fallbackConvId?: string): ChatbotMessage {
  return {
    ...m,
    id: String(m.id),
    conversationId: String(m.conversationId ?? fallbackConvId ?? ""),
  };
}

function normalizeConv(c: any): ChatbotConversation {
  const id = String(c.id);
  return {
    ...c,
    id,
    messages: Array.isArray(c.messages)
      ? c.messages.map((m: any) => normalizeMsg(m, id))
      : [],
  };
}

export const useChatbot = (): UseChatbotReturn => {
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [conversationList, setConversationList] = useState<ConversationListItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>("/api/chatbot/conversations");
      const normalized = (data ?? []).map(normalizeConv);
      setConversations(normalized);
      setConversationList(normalized.map(c => ({ id: c.id, title: c.title, updatedAt: c.updatedAt, messageCount: (c as any).messageCount, lastMessagePreview: (c as any).lastMessagePreview })));
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load conversations";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConversation = useCallback(async (id: string) => {
    try {
      const data = await api.get<any>(`/api/chatbot/conversations/${id}`);
      const normalized = normalizeConv(data);
      setConversations(prev => {
        const exists = prev.some(c => c.id === id);
        if (exists) return prev.map(c => c.id === id ? normalized : c);
        return [...prev, normalized];
      });
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load conversation";
      setError(message);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchConversation(activeConversationId);
    }
  }, [activeConversationId, fetchConversation]);

  const refetch = useCallback(() => { fetchConversations(); }, [fetchConversations]);

  const refetchActiveConversation = useCallback((id: string) => {
    fetchConversation(id);
  }, [fetchConversation]);

  const createConversation = useCallback(async (data: CreateConversationRequest): Promise<string> => {
    const raw = await api.post<any>("/api/chatbot/conversations", data);
    const normalized = normalizeConv(raw);
    setConversations(prev => [...prev, normalized]);
    setConversationList(prev => [...prev, { id: normalized.id, title: normalized.title, updatedAt: normalized.updatedAt }]);
    setActiveConversationId(normalized.id);
    return normalized.id;
  }, []);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    const tempId = `opt_${Date.now()}`;
    const optimisticMsg: ChatbotMessage = {
      id: tempId,
      conversationId,
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages ?? []), optimisticMsg] }
          : c
      )
    );

    try {
      await api.post<any>(`/api/chatbot/conversations/${conversationId}/messages`, { text });
      await fetchConversation(conversationId);
      setConversationList(prev =>
        prev.map(item =>
          item.id === conversationId
            ? { ...item, updatedAt: new Date().toISOString() }
            : item
        )
      );
    } catch (err) {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, messages: (c.messages ?? []).filter(m => m.id !== tempId) }
            : c
        )
      );
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to send message";
      setError(message);
      throw err;
    }
  }, [fetchConversation]);

  const streamMessage = useCallback(async (
    conversationId: string,
    text: string,
    fileContent?: string,
    fileName?: string,
    attachedFileBase64?: string,
    attachedFileMimeType?: string,
    chatMode?: string
  ) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const tempUserId = `opt_user_${Date.now()}`;
    const isImageAttach = !!attachedFileBase64 && !!attachedFileMimeType && attachedFileMimeType.startsWith("image/");
    const displayText = fileContent && fileName
      ? `[File: ${fileName}]\n\n${text}`
      : isImageAttach
        ? `[Image attached]${text ? `\n\n${text}` : ""}`
        : attachedFileBase64 && attachedFileMimeType === "application/pdf" && fileName
          ? `[PDF: ${fileName}]${text ? `\n\n${text}` : ""}`
          : text;

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages ?? []), { id: tempUserId, conversationId, role: "user" as const, text: displayText, createdAt: new Date().toISOString() }] }
          : c
      )
    );

    setIsStreaming(true);
    setStreamingText("");

    const baseUrl = getApiBaseUrl() || "";
    const token = getAuthToken();
    const url = `${baseUrl}/api/chatbot/conversations/${conversationId}/messages/stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text,
          fileContent: fileContent ?? null,
          fileName: fileName ?? null,
          attachedFileBase64: attachedFileBase64 ?? null,
          attachedFileMimeType: attachedFileMimeType ?? null,
          chatMode: chatMode ?? "general",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let partial = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n");
        partial = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice("data: ".length).trim();
          if (!raw) continue;

          let parsed: any;
          try { parsed = JSON.parse(raw); } catch { continue; }

          if (parsed.error) {
            setConversations(prev =>
              prev.map(c =>
                c.id === conversationId
                  ? { ...c, messages: c.messages.filter(m => m.id !== tempUserId) }
                  : c
              )
            );
            setError(parsed.error);
          } else if (parsed.done) {
            const botMsg: ChatbotMessage = {
              id: String(parsed.message.id),
              conversationId,
              role: "assistant",
              text: parsed.message.text,
              createdAt: parsed.message.createdAt,
            };
            setConversations(prev =>
              prev.map(c => {
                if (c.id !== conversationId) return c;
                return { ...c, messages: [...c.messages.filter(m => m.id !== tempUserId), botMsg] };
              })
            );
            setConversationList(prev =>
              prev.map(item =>
                item.id === conversationId
                  ? { ...item, updatedAt: new Date().toISOString(), usedModes: Array.from(new Set([...(item.usedModes ?? []), chatMode ?? "general"])) }
                  : item
              )
            );
            await fetchConversation(conversationId);
          } else if (typeof parsed.token === "string") {
            accumulated += parsed.token;
            setStreamingText(accumulated);
          }
        }
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, messages: c.messages.filter(m => m.id !== tempUserId) }
            : c
        )
      );
      const message = err instanceof Error ? err.message : "Streaming failed";
      setError(message);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  }, [fetchConversation]);

  const editMessageAndRestream = useCallback(async (
    conversationId: string,
    messageId: string,
    newText: string,
    chatMode?: string
  ) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Update the local state: edit the message text, mark as edited, remove subsequent messages
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        const msgIndex = c.messages.findIndex(m => m.id === messageId);
        if (msgIndex === -1) return c;
        const updated = c.messages.map((m, i) =>
          i === msgIndex ? { ...m, text: newText, isEdited: true } : m
        );
        // Keep only messages up to and including the edited one
        return { ...c, messages: updated.slice(0, msgIndex + 1) };
      })
    );

    setIsStreaming(true);
    setStreamingText("");

    const baseUrl = getApiBaseUrl() || "";
    const token = getAuthToken();
    const url = `${baseUrl}/api/chatbot/conversations/${conversationId}/messages/${messageId}/edit-stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text: newText, chatMode: chatMode ?? "general" }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Edit-stream request failed: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let partial = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n");
        partial = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice("data: ".length).trim();
          if (!raw) continue;

          let parsed: any;
          try { parsed = JSON.parse(raw); } catch { continue; }

          if (parsed.error) {
            setError(parsed.error);
          } else if (parsed.done) {
            const botMsg: ChatbotMessage = {
              id: String(parsed.message.id),
              conversationId,
              role: "assistant",
              text: parsed.message.text,
              createdAt: parsed.message.createdAt,
            };
            setConversations(prev =>
              prev.map(c =>
                c.id !== conversationId ? c : { ...c, messages: [...c.messages, botMsg] }
              )
            );
            setConversationList(prev =>
              prev.map(item =>
                item.id === conversationId
                  ? { ...item, updatedAt: new Date().toISOString(), usedModes: Array.from(new Set([...(item.usedModes ?? []), chatMode ?? "general"])) }
                  : item
              )
            );
            await fetchConversation(conversationId);
          } else if (typeof parsed.token === "string") {
            accumulated += parsed.token;
            setStreamingText(accumulated);
          }
        }
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Streaming failed";
      setError(message);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  }, [fetchConversation]);

  const clearAllConversations = useCallback(async () => {
    try {
      await api.delete("/api/chatbot/conversations");
      setConversations([]);
      setConversationList([]);
      setActiveConversationId(null);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to clear conversations";
      setError(message);
      throw err;
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/chatbot/conversations/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
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

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  return {
    conversations,
    conversationList,
    activeConversation,
    isLoading,
    isStreaming,
    streamingText,
    error,
    refetch,
    refetchActiveConversation,
    createConversation,
    sendMessage,
    streamMessage,
    editMessageAndRestream,
    deleteConversation,
    clearAllConversations,
    setActiveConversationId: setActiveConversationIdCallback,
    activeConversationId,
  };
};
