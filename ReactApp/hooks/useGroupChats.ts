import { useState, useCallback } from "react";
import { api } from "../services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GroupChatMember {
  userId: number;
  fullName: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface GroupMessage {
  id: number;
  groupChatId: number;
  senderId: number;
  senderName: string;
  senderAvatarUrl?: string;
  body: string;
  sentAt: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
}

export interface GroupChat {
  id: number;
  name: string;
  createdByUserId: number;
  createdByName: string;
  createdAt: string;
  members: GroupChatMember[];
  lastMessage?: GroupMessage;
  unreadCount: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGroupChats() {
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchGroups = useCallback(async () => {
    setIsLoadingGroups(true);
    try {
      const res = await api.get<GroupChat[]>("/api/group-chats");
      setGroups(res ?? []);
    } catch {
      // silently fail — groups section just stays empty
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  const fetchGroupMessages = useCallback(async (groupId: number) => {
    setIsLoadingMessages(true);
    try {
      const res = await api.get<GroupMessage[]>(`/api/group-chats/${groupId}/messages`);
      setGroupMessages(res ?? []);
    } catch {
      setGroupMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createGroup = useCallback(async (name: string, memberEmails: string[]) => {
    const newGroup = await api.post<GroupChat>("/api/group-chats", { name, memberEmails });
    setGroups(prev => [newGroup, ...prev]);
    return newGroup;
  }, []);

  const sendGroupMessage = useCallback(async (
    groupId: number,
    payload: {
      body: string;
      attachmentUrl?: string;
      attachmentName?: string;
      attachmentType?: string;
      attachmentSize?: number;
    }
  ) => {
    const msg = await api.post<GroupMessage>(`/api/group-chats/${groupId}/messages`, payload);
    setGroupMessages(prev => [...prev, msg]);
    // update last message in group list
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, lastMessage: msg, unreadCount: 0 } : g
    ));
    return msg;
  }, []);

  const markGroupAsRead = useCallback(async (groupId: number) => {
    try {
      await api.patch(`/api/group-chats/${groupId}/read`);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, unreadCount: 0 } : g));
    } catch {
      // non-critical
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: number) => {
    await api.delete(`/api/group-chats/${groupId}/leave`);
    setGroups(prev => prev.filter(g => g.id !== groupId));
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
      setGroupMessages([]);
    }
  }, [activeGroupId]);

  const uploadGroupAttachment = useCallback(async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const result = await api.postForm<{ url: string; name: string; type: string; size: number }>(
      "/api/group-chats/upload",
      form
    );
    return result;
  }, []);

  return {
    groups,
    activeGroupId,
    setActiveGroupId,
    groupMessages,
    isLoadingGroups,
    isLoadingMessages,
    fetchGroups,
    fetchGroupMessages,
    createGroup,
    sendGroupMessage,
    markGroupAsRead,
    leaveGroup,
    uploadGroupAttachment,
  };
}
