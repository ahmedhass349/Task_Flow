// â”€â”€ useTeams Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// MongoDB-backed teams invitation hook.
// Manages: local SQLite teams, shared invitations (incoming/outgoing), shared members.

import { useState, useEffect, useCallback } from "react";
import { api, ApiRequestError } from "../services/api";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Member" | "Admin";
  status: "active" | "invited" | "inactive";
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  members: TeamMember[];
  memberCount: number;
}

export interface Invitation {
  id: string;
  senderEmail: string;
  senderFullName: string;
  senderAvatarUrl: string;
  recipientEmail: string;
  recipientFullName: string;
  teamId: string;
  teamName: string;
  message: string;
  role: string;
  status: "Pending" | "Accepted" | "Declined" | "Cancelled" | "Expired";
  sentAt: string;
  respondedAt?: string;
  expiresAt: string;
  declineReason?: string;
}

export interface SharedMember {
  id: string;
  teamId: string;
  teamName: string;
  userEmail: string;
  userFullName: string;
  avatarUrl: string;
  role: string;
  ownerEmail: string;
  joinedAt: string;
  isActive: boolean;
  lastSeen?: string;
  localUserId?: number;
}

export interface UserSearchResult {
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  lastSeen?: string;
  acceptsInvitations: boolean;
}

export interface AnnouncementRecipient {
  email: string;
  name: string;
  hasRead: boolean;
  readAt?: string;
}

export interface AnnouncementWithReceipts {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  recipients: AnnouncementRecipient[];
}

export interface SendInvitationRequest {
  recipientEmail: string;
  teamId?: string;
  teamName?: string;
  message?: string;
  role?: string;
}

// â”€â”€ Hook return type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface UseTeamsReturn {
  // SQLite local teams
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createTeam: (data: { name: string; description?: string }) => Promise<void>;
  updateTeam: (id: string, data: { name?: string; description?: string }) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;

  // Invitations
  incomingInvitations: Invitation[];
  outgoingInvitations: Invitation[];
  invitationsLoading: boolean;
  sendInvitation: (data: SendInvitationRequest) => Promise<void>;
  acceptInvitation: (id: string) => Promise<void>;
  declineInvitation: (id: string, reason?: string) => Promise<void>;
  cancelInvitation: (id: string) => Promise<void>;
  deleteInvitation: (id: string) => Promise<void>;
  refetchInvitations: () => void;

  // Shared (MongoDB) members
  sharedMembers: SharedMember[];
  sharedMembersLoading: boolean;
  fetchSharedMembers: (teamId: string) => Promise<void>;
  removeSharedMember: (teamId: string, memberEmail: string) => Promise<void>;
  removeMemberAllRecords: (memberEmail: string) => Promise<void>;
  addMemberToTeam: (teamId: string, memberEmail: string, memberFullName: string, role?: string) => Promise<SharedMember>;

  // All shared members (across all teams)
  allSharedMembers: SharedMember[];
  allSharedMembersLoading: boolean;
  fetchAllSharedMembers: () => Promise<void>;

  // Teams where I am a member (added by others)
  membershipsByMe: SharedMember[];
  membershipsByMeLoading: boolean;
  fetchMembershipsByMe: () => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;

  // User search
  searchUsers: (query: string) => Promise<UserSearchResult[]>;

  // Announcements
  sendAnnouncement: (teamId: string, message: string, title?: string) => Promise<void>;
  getAnnouncements: (teamId: string) => Promise<AnnouncementWithReceipts[]>;
  markAnnouncementRead: (announcementId: string) => Promise<void>;
}

// â”€â”€ Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const useTeams = (): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [incomingInvitations, setIncomingInvitations] = useState<Invitation[]>([]);
  const [outgoingInvitations, setOutgoingInvitations] = useState<Invitation[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);

  const [sharedMembers, setSharedMembers] = useState<SharedMember[]>([]);
  const [sharedMembersLoading, setSharedMembersLoading] = useState(false);

  const [allSharedMembers, setAllSharedMembers] = useState<SharedMember[]>([]);
  const [allSharedMembersLoading, setAllSharedMembersLoading] = useState(false);

  const [membershipsByMe, setMembershipsByMe] = useState<SharedMember[]>([]);
  const [membershipsByMeLoading, setMembershipsByMeLoading] = useState(false);

  // â”€â”€ SQLite teams â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await api.get<Team[]>("/api/teams");
      setTeams(data);
    } catch (err) {
      if (!silent) {
        setError(
          err instanceof ApiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load teams"
        );
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  const createTeam = useCallback(async (data: { name: string; description?: string }) => {
    const newTeam = await api.post<Team>("/api/teams", data);
    setTeams(prev => [...prev, newTeam]);
  }, []);

  const updateTeam = useCallback(async (id: string, data: { name?: string; description?: string }) => {
    const updated = await api.put<Team>(`/api/teams/${id}`, data);
    setTeams(prev => prev.map(t => (t.id === id ? updated : t)));
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    await api.delete(`/api/teams/${id}`);
    setTeams(prev => prev.filter(t => t.id !== id));
  }, []);

  // â”€â”€ Invitations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const fetchInvitations = useCallback(async (silent = false) => {
    if (!silent) {
      setInvitationsLoading(true);
    }
    try {
      const [incoming, outgoing] = await Promise.all([
        api.get<Invitation[]>("/api/teams/invitations/incoming"),
        api.get<Invitation[]>("/api/teams/invitations/outgoing"),
      ]);
      setIncomingInvitations(incoming ?? []);
      setOutgoingInvitations(outgoing ?? []);
    } catch {
      // Invitation relay unavailable â€” keep empty lists, don't block UI
    } finally {
      if (!silent) {
        setInvitationsLoading(false);
      }
    }
  }, []);

  const sendInvitation = useCallback(async (data: SendInvitationRequest) => {
    await api.post("/api/teams/invitations/send", data);
    fetchInvitations();
  }, [fetchInvitations]);

  const fetchMembershipsByMe = useCallback(async (silent = false) => {
    if (!silent) {
      setMembershipsByMeLoading(true);
    }
    try {
      const members = await api.get<SharedMember[]>('/api/teams/members-shared/as-member');
      setMembershipsByMe(members ?? []);
    } catch {
      setMembershipsByMe([]);
    } finally {
      if (!silent) {
        setMembershipsByMeLoading(false);
      }
    }
  }, []);

  const declineInvitation = useCallback(async (id: string, reason?: string) => {
    await api.post(`/api/teams/invitations/${id}/decline`, { reason: reason ?? "" });
    setIncomingInvitations(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status: "Declined" as const } : inv))
    );
  }, []);

  const cancelInvitation = useCallback(async (id: string) => {
    await api.delete(`/api/teams/invitations/${id}/cancel`);
    setOutgoingInvitations(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status: "Cancelled" as const } : inv))
    );
  }, []);

  const deleteInvitation = useCallback(async (id: string) => {
    await api.delete(`/api/teams/invitations/${id}`);
    setOutgoingInvitations(prev => prev.filter(inv => inv.id !== id));
    setIncomingInvitations(prev => prev.filter(inv => inv.id !== id));
  }, []);

  // â”€â”€ Shared members â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const fetchSharedMembers = useCallback(async (teamId: string, silent = false) => {
    if (!silent) {
      setSharedMembersLoading(true);
    }
    try {
      const members = await api.get<SharedMember[]>(`/api/teams/${teamId}/members-shared`);
      setSharedMembers(members ?? []);
    } catch {
      setSharedMembers([]);
    } finally {
      if (!silent) {
        setSharedMembersLoading(false);
      }
    }
  }, []);

  const fetchAllSharedMembers = useCallback(async (silent = false) => {
    if (!silent) {
      setAllSharedMembersLoading(true);
    }
    try {
      const members = await api.get<SharedMember[]>(`/api/teams/members-shared/all`);
      setAllSharedMembers(members ?? []);
    } catch {
      setAllSharedMembers([]);
    } finally {
      if (!silent) {
        setAllSharedMembersLoading(false);
      }
    }
  }, []);

  const removeSharedMember = useCallback(async (teamId: string, memberEmail: string) => {
    if (!teamId) {
      await api.delete(`/api/teams/members-shared-all/${encodeURIComponent(memberEmail)}`);
      setSharedMembers(prev => prev.filter(m => m.userEmail !== memberEmail));
      setAllSharedMembers(prev => prev.filter(m => m.userEmail !== memberEmail));
      return;
    }
    await api.delete(`/api/teams/${teamId}/members-shared/${encodeURIComponent(memberEmail)}`);
    setSharedMembers(prev => prev.filter(m => m.userEmail !== memberEmail));
    setAllSharedMembers(prev => prev.filter(m => !(m.userEmail === memberEmail && m.teamId === teamId)));
  }, []);

  const removeMemberAllRecords = useCallback(async (memberEmail: string) => {
    await api.delete(`/api/teams/members-shared-all/${encodeURIComponent(memberEmail)}`);
    setSharedMembers(prev => prev.filter(m => m.userEmail !== memberEmail));
    setAllSharedMembers(prev => prev.filter(m => m.userEmail !== memberEmail));
  }, []);

  const acceptInvitation = useCallback(async (id: string) => {
    await api.post(`/api/teams/invitations/${id}/accept`, {});
    setIncomingInvitations(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status: "Accepted" as const } : inv))
    );
    fetchMembershipsByMe();
    fetchAllSharedMembers();
  }, [fetchMembershipsByMe, fetchAllSharedMembers]);

  const addMemberToTeam = useCallback(async (teamId: string, memberEmail: string, memberFullName: string, role: string = "Member"): Promise<SharedMember> => {
    const result = await api.post<SharedMember>(`/api/teams/${teamId}/members-shared/assign`, {
      memberEmail,
      memberFullName,
      role,
    });
    setSharedMembers(prev => {
      if (prev.some(m => m.userEmail === memberEmail && m.teamId === teamId)) return prev;
      return [...prev, result];
    });
    setAllSharedMembers(prev => {
      if (prev.some(m => m.userEmail === memberEmail && m.teamId === teamId)) return prev;
      return [result, ...prev];
    });
    return result;
  }, []);

  // â”€â”€ User search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


  const leaveTeam = useCallback(async (teamId) => {
    if (!teamId) return;
    await api.delete(`/api/teams/${teamId}/membership`);
    setMembershipsByMe(prev => prev.filter(m => m.teamId !== teamId));
  }, []);

  const sendAnnouncement = useCallback(async (teamId: string, message: string, title?: string): Promise<void> => {
    await api.post(`/api/teams/${teamId}/announce`, { message, title });
  }, []);

  const getAnnouncements = useCallback(async (teamId: string): Promise<AnnouncementWithReceipts[]> => {
    try {
      return await api.get<AnnouncementWithReceipts[]>(`/api/teams/${teamId}/announcements`);
    } catch {
      return [];
    }
  }, []);

  const markAnnouncementRead = useCallback(async (announcementId: string): Promise<void> => {
    try {
      await api.post(`/api/teams/announcements/${announcementId}/read`, {});
    } catch {
      // non-critical
    }
  }, []);

  const searchUsers = useCallback(async (query: string): Promise<UserSearchResult[]> => {
    if (!query.trim()) return [];
    try {
      return await api.get<UserSearchResult[]>(`/api/teams/users/search?q=${encodeURIComponent(query)}`);
    } catch {
      return [];
    }
  }, []);

  // â”€â”€ Initial load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    fetchData();
    fetchInvitations();
    fetchAllSharedMembers();
    fetchMembershipsByMe();
  }, [fetchData, fetchInvitations, fetchAllSharedMembers, fetchMembershipsByMe]);

  // ── Refresh on page visibility / window focus ─────────────────────────────

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchData(true);
        fetchInvitations(true);
        fetchMembershipsByMe(true);
        fetchAllSharedMembers(true);
      }
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchData, fetchInvitations, fetchMembershipsByMe, fetchAllSharedMembers]);

  // ── Refresh on team-related notifications ─────────────────────────────────

  useEffect(() => {
    const TEAM_TYPES = ["teamdeleted", "teaminvitationreceived", "teaminvitationaccepted", "teaminvitationdeclined", "teammemberremoved", "teammemberleft"];
    const onNotification = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type && TEAM_TYPES.includes((detail.type as string).toLowerCase())) {
        fetchInvitations(true);
        fetchMembershipsByMe(true);
        fetchAllSharedMembers(true);
      }
    };
    window.addEventListener("taskflow:notification-received", onNotification);
    return () => window.removeEventListener("taskflow:notification-received", onNotification);
  }, [fetchInvitations, fetchMembershipsByMe, fetchAllSharedMembers]);

  // ── Presence heartbeat ──────────────────────────────────────────────────
  // Upserts this user's presence record in MongoDB so their profile (name,
  // avatar, email) stays discoverable across machines.
  // Called once on mount and every 2 minutes while the app is open.

  useEffect(() => {
    const ping = () => { api.post("/api/teams/presence", {}).catch(() => {}); };
    ping();
    const heartbeatId = setInterval(ping, 60_000);
    return () => clearInterval(heartbeatId);
  }, []);

  // ── 30-second safety-net polling (fallback when SignalR events are missed) ─

  useEffect(() => {
    const id = setInterval(() => {
      fetchInvitations(true);
      fetchMembershipsByMe(true);
      fetchAllSharedMembers(true);
    }, 30_000);
    return () => clearInterval(id);
  }, [fetchInvitations, fetchMembershipsByMe, fetchAllSharedMembers]);

  return {
    teams,
    isLoading,
    error,
    refetch: fetchData,
    createTeam,
    updateTeam,
    deleteTeam,
    incomingInvitations,
    outgoingInvitations,
    invitationsLoading,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
    deleteInvitation,
    refetchInvitations: fetchInvitations,
    sharedMembers,
    sharedMembersLoading,
    fetchSharedMembers,
    removeSharedMember,
    removeMemberAllRecords,
    addMemberToTeam,
    allSharedMembers,
    allSharedMembersLoading,
    fetchAllSharedMembers,
    membershipsByMe,
    membershipsByMeLoading,
    fetchMembershipsByMe,
    leaveTeam,
    searchUsers,
    sendAnnouncement,
    getAnnouncements,
    markAnnouncementRead,
  };
};

