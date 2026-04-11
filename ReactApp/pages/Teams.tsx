import { useState, useRef, useEffect } from "react";
import {
  Users,
  Mail,
  UserPlus,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Search,
  Trash2,
  Plus,
  Users2,
  UserCheck,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";
import {
  useTeams,
  type Invitation,
  type SharedMember,
  type UserSearchResult,
  type SendInvitationRequest,
  type Team,
} from "../hooks/useTeams";

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Tab = "all-members" | "members" | "incoming" | "outgoing";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map(n => n[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-pink-500",
  "bg-sky-500", "bg-green-500", "bg-orange-500",
];

const avatarColor = (str: string) =>
  AVATAR_COLORS[
    str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];

const statusBadge: Record<string, string> = {
  Pending:   "bg-yellow-100 text-yellow-700",
  Accepted:  "bg-green-100 text-green-700",
  Declined:  "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
  Expired:   "bg-gray-100 text-gray-400",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

// ── Create Team Modal ─────────────────────────────────────────────────────

interface CreateTeamModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => Promise<void>;
}

function CreateTeamModal({ onClose, onCreate }: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setCreateError("Team name is required"); return; }
    setCreating(true);
    setCreateError(null);
    try {
      await onCreate({ name: trimmed, description: description.trim() || undefined });
      onClose();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Create a Team</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team name<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Engineering"
              className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="What is this team for?"
              className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {createError && <p className="text-sm text-red-500">{createError}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {creating && <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Invite Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface InviteModalProps {
  teams: Team[];
  onClose: () => void;
  onSend: (data: SendInvitationRequest) => Promise<void>;
  searchUsers: (q: string) => Promise<UserSearchResult[]>;
}

function InviteModal({ teams, onClose, onSend, searchUsers }: InviteModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<UserSearchResult | null>(null);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [role, setRole] = useState("Member");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const res = await searchUsers(q);
      setResults(res);
      setSearching(false);
    }, 350);
  };

  const selectedTeam = teams.find(t => t.id === teamId);

  const handleSend = async () => {
    if (!selected) return;
    setSending(true);
    setSendError(null);
    try {
      await onSend({
        recipientEmail: selected.email,
        teamId: teamId || undefined,
        teamName: selectedTeam?.name || undefined,
        message,
        role,
      });
      setSentOk(true);
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  if (sentOk) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
          <CheckCircle className="size-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Invitation Sent</h2>
          <p className="text-gray-500 text-sm mb-6">
            An invitation was sent to <strong>{selected?.email}</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Invite to Team</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Find user by email or name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Results dropdown */}
            {(results.length > 0 || searching) && !selected && (
              <div className="mt-1 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {searching && (
                  <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
                )}
                {!searching && results.map(u => (
                  <button
                    key={u.email}
                    onClick={() => { setSelected(u); setQuery(u.email); setResults([]); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className={`${avatarColor(u.email)} size-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(u.fullName || u.email)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.fullName || u.email}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                    {!u.acceptsInvitations && (
                      <span className="ml-auto text-xs text-gray-400 flex-shrink-0">Not accepting</span>
                    )}
                  </button>
                ))}
                {!searching && results.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400">No users found</div>
                )}
              </div>
            )}

            {selected && (
              <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                <div className={`${avatarColor(selected.email)} size-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {getInitials(selected.fullName || selected.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{selected.fullName || selected.email}</p>
                  <p className="text-xs text-gray-500 truncate">{selected.email}</p>
                </div>
                <button onClick={() => { setSelected(null); setQuery(""); }} className="text-gray-400 hover:text-red-500">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Team selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team <span className="text-gray-400 font-normal">(optional)</span></label>
            <select
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— No specific team —</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
              placeholder="Say something nice..."
              className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {sendError && (
            <p className="text-sm text-red-500">{sendError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!selected || sending}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Invitation card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface IncomingCardProps {
  inv: Invitation;
  onAccept: (id: string) => Promise<void>;
  onDecline: (id: string) => Promise<void>;
}

function IncomingCard({ inv, onAccept, onDecline }: IncomingCardProps) {
  const [busy, setBusy] = useState(false);

  const act = async (fn: () => Promise<void>) => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };

  return (
    <div className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
      <div className={`${avatarColor(inv.senderEmail)} size-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {getInitials(inv.senderFullName || inv.senderEmail)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-gray-900">{inv.senderFullName || inv.senderEmail}</p>
            <p className="text-xs text-gray-500">{inv.senderEmail}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge[inv.status] ?? "bg-gray-100 text-gray-500"}`}>
            {inv.status}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-1">
          Inviting you to <strong>{inv.teamName}</strong> as <span className="font-medium">{inv.role}</span>
        </p>
        {inv.message && <p className="text-sm text-gray-500 italic mt-0.5">"{inv.message}"</p>}
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="size-3" /> {fmtDate(inv.sentAt)}
          {inv.expiresAt && <> Â· expires {fmtDate(inv.expiresAt)}</>}
        </p>
      </div>
      {inv.status === "Pending" && (
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => act(() => onAccept(inv.id))}
            disabled={busy}
            aria-label="Accept invitation"
            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <CheckCircle className="size-5" />
          </button>
          <button
            onClick={() => act(() => onDecline(inv.id))}
            disabled={busy}
            aria-label="Decline invitation"
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <XCircle className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

interface OutgoingCardProps {
  inv: Invitation;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function OutgoingCard({ inv, onCancel, onDelete }: OutgoingCardProps) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
      <div className={`${avatarColor(inv.recipientEmail)} size-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {getInitials(inv.recipientFullName || inv.recipientEmail)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-gray-900">{inv.recipientFullName || inv.recipientEmail}</p>
            <p className="text-xs text-gray-500">{inv.recipientEmail}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge[inv.status] ?? "bg-gray-100 text-gray-500"}`}>
            {inv.status}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-1">
          Team: <strong>{inv.teamName || "\u2014"}</strong> &middot; Role: <span className="font-medium">{inv.role}</span>
        </p>
        {inv.message && <p className="text-sm text-gray-500 italic mt-0.5">&quot;{inv.message}&quot;</p>}
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="size-3" /> {fmtDate(inv.sentAt)}
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {inv.status === "Pending" && (
          <button
            onClick={async () => { setBusy(true); try { await onCancel(inv.id); } finally { setBusy(false); } }}
            disabled={busy}
            aria-label="Cancel invitation"
            title="Cancel invitation"
            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        )}
        <button
          onClick={async () => { setBusy(true); try { await onDelete(inv.id); } finally { setBusy(false); } }}
          disabled={busy}
          aria-label="Delete invitation"
          title="Delete permanently"
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
// â”€â”€ Shared member card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SharedMemberCardProps {
  member: SharedMember;
  onRemove: (email: string) => Promise<void>;
  showTeam?: boolean;
}

function SharedMemberCard({ member, onRemove, showTeam }: SharedMemberCardProps) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className={`${avatarColor(member.userEmail)} size-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {getInitials(member.userFullName || member.userEmail)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{member.userFullName || member.userEmail}</p>
          {showTeam && member.teamName && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{member.teamName}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <Mail className="size-3" />
          <span className="truncate">{member.userEmail}</span>
          <span className="ml-2 font-medium text-gray-700">· {member.role}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <Clock className="size-3" /> Joined {fmtDate(member.joinedAt)}
        </p>
      </div>
      <button
        onClick={async () => { setBusy(true); try { await onRemove(member.userEmail); } finally { setBusy(false); } }}
        disabled={busy}
        aria-label="Remove member"
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Teams() {
  const {
    teams,
    isLoading,
    error,
    refetch,
    incomingInvitations,
    outgoingInvitations,
    invitationsLoading,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
    sharedMembers,
    sharedMembersLoading,
    fetchSharedMembers,
    removeSharedMember,
    allSharedMembers,
    allSharedMembersLoading,
    fetchAllSharedMembers,
    createTeam,
    searchUsers,
    deleteInvitation,
    addMemberToTeam,
    removeMemberAllRecords,
  } = useTeams();

  const [activeTab, setActiveTab] = useState<Tab>("all-members");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showAddMemberPicker, setShowAddMemberPicker] = useState(false);

  const pendingIn = incomingInvitations.filter(i => i.status === "Pending").length;
  const pendingOut = outgoingInvitations.filter(i => i.status === "Pending").length;

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    fetchSharedMembers(teamId);
  };

  const handleRemoveSharedMember = async (email: string) => {
    if (!selectedTeamId) return;
    await removeSharedMember(selectedTeamId, email);
  };

  const tabs = [
    { id: "all-members" as Tab, label: "Members", icon: Users2 },
    { id: "members" as Tab, label: "My Team", icon: Users },
    { id: "incoming" as Tab, label: "Incoming", icon: Inbox, badge: pendingIn },
    { id: "outgoing" as Tab, label: "Sent", icon: Send, badge: pendingOut },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                <p className="text-gray-500 mt-1">Invite teammates and manage shared access across devices</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  <Plus className="size-4" />
                  Create a Team
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <UserPlus className="size-4" />
                  Invite a Member
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "all-members") fetchAllSharedMembers();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* â”€â”€ TAB: MY TEAM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {/* all-members tab */}
            {activeTab === "all-members" && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">All Members</h2>
                  {allSharedMembersLoading && (
                    <span className="size-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin inline-block" />
                  )}
                </div>
                {!allSharedMembersLoading && allSharedMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Users2 className="size-10 mb-2 opacity-30" />
                    <p className="text-sm">No members yet</p>
                    <p className="text-xs mt-1">Invite someone and ask them to accept your invitation.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {allSharedMembers.map(m => (
                      <SharedMemberCard
                        key={m.id}
                        member={m}
                        onRemove={async (email) => removeMemberAllRecords(email)}
                        showTeam
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "members" && (
              <>
                {isLoading && <PageLoading message="Loading teams..." />}
                {error && <PageError message={error} onRetry={refetch} />}
                {!isLoading && !error && teams.length === 0 && (
                  <PageEmpty
                    icon={Users}
                    title="No teams yet"
                    description="Create your first team, then invite members to collaborate."
                    action={{ label: "Invite a Member", onClick: () => setShowInviteModal(true) }}
                  />
                )}

                {!isLoading && !error && teams.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Team list */}
                    <div className="lg:col-span-1 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Your Teams</p>
                      {teams.map(team => (
                        <button
                          key={team.id}
                          onClick={() => handleSelectTeam(team.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-colors ${
                            selectedTeamId === team.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <p className="font-semibold text-gray-900">{team.name}</p>
                          {team.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{team.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{team.memberCount} local member{team.memberCount !== 1 ? "s" : ""}</p>
                        </button>
                      ))}
                    </div>

                    {/* Shared members panel */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
                      {!selectedTeamId ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                          <Users className="size-10 mb-2 opacity-30" />
                          <p className="text-sm">Select a team to see shared members</p>
                        </div>
                      ) : (
                        <>
                          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">
                              Members &mdash; {teams.find(t => t.id === selectedTeamId)?.name}
                            </h2>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { fetchAllSharedMembers(); setShowAddMemberPicker(true); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                <UserCheck className="size-3.5" /> Add Member
                              </button>
                              {sharedMembersLoading && (
                                <span className="size-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                              )}
                            </div>
                          </div>
                          {!sharedMembersLoading && sharedMembers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-36 text-gray-400">
                              <Users className="size-8 mb-2 opacity-30" />
                              <p className="text-sm">No shared members yet â€” invite someone!</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {sharedMembers.map(m => (
                                <SharedMemberCard
                                  key={m.id}
                                  member={m}
                                  onRemove={handleRemoveSharedMember}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* â”€â”€ TAB: INCOMING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === "incoming" && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Incoming Invitations</h2>
                  {invitationsLoading && (
                    <span className="size-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  )}
                </div>
                {!invitationsLoading && incomingInvitations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Inbox className="size-10 mb-2 opacity-30" />
                    <p className="text-sm">No invitations received yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {incomingInvitations.map(inv => (
                      <IncomingCard
                        key={inv.id}
                        inv={inv}
                        onAccept={acceptInvitation}
                        onDecline={declineInvitation}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* â”€â”€ TAB: OUTGOING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === "outgoing" && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Sent Invitations</h2>
                  {invitationsLoading && (
                    <span className="size-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  )}
                </div>
                {!invitationsLoading && outgoingInvitations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Send className="size-10 mb-2 opacity-30" />
                    <p className="text-sm">You haven't sent any invitations yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {outgoingInvitations.map(inv => (
                      <OutgoingCard
                        key={inv.id}
                        inv={inv}
                        onCancel={cancelInvitation}
                        onDelete={deleteInvitation}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
          <Footer />
        </main>
      </div>

      {showInviteModal && (
        <InviteModal
          teams={teams}
          onClose={() => setShowInviteModal(false)}
          onSend={sendInvitation}
          searchUsers={searchUsers}
        />
      )}

      {showCreateTeamModal && (
        <CreateTeamModal
          onClose={() => setShowCreateTeamModal(false)}
          onCreate={createTeam}
        />
      )}

      {showAddMemberPicker && selectedTeamId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddMemberPicker(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add Member to Team</h3>
              <button onClick={() => setShowAddMemberPicker(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {(() => {
                const available = allSharedMembers.filter(
                  m => !sharedMembers.some(s => s.userEmail === m.userEmail)
                );
                if (available.length === 0) return (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <UserCheck className="size-8 mb-2 opacity-30" />
                    <p className="text-sm">All accepted members are already in this team</p>
                  </div>
                );
                return available.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                    <div className={`${avatarColor(m.userEmail)} size-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {getInitials(m.userFullName || m.userEmail)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{m.userFullName || m.userEmail}</p>
                      <p className="text-xs text-gray-500">{m.userEmail}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await addMemberToTeam(selectedTeamId, m.userEmail, m.userFullName || m.userEmail);
                        setShowAddMemberPicker(false);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
