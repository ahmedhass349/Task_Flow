import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Search, Star, MoreVertical, Smile, Paperclip,
  Send, Plus, MessageCircle, ChevronDown,
  X, Download, FileText, File, Loader2, Trash2,
  Users, LogOut, CheckSquare, Square,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { PageLoading, PageError } from "../Components/PageState";
import { useMessages } from "../hooks/useMessages";
import { useGroupChats } from "../hooks/useGroupChats";
import { useTeams, type SharedMember } from "../hooks/useTeams";
import { useAuth } from "../context/AuthContext";

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-pink-500",
  "bg-sky-500", "bg-green-500", "bg-orange-500",
  "bg-rose-500", "bg-indigo-500", "bg-teal-500",
];

function avatarColor(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map(n => n[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function formatTimestamp(iso: string): string {
  if (!iso || iso === "0001-01-01T00:00:00Z" || iso === "0001-01-01T00:00:00") return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatContactTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  if (diffD < 7) return `${diffD}d`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function groupMessagesByDate(messages: any[]) {
  const groups: { label: string; messages: any[] }[] = [];
  let currentLabel = "";
  for (const msg of messages) {
    const d = new Date(msg.sentAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else label = d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

    if (label !== currentLabel) {
      groups.push({ label, messages: [] });
      currentLabel = label;
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

// â”€â”€ Emoji Picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤓","😅","🙏","😢","😡",
  "👍","👎","👏","🙌","🤝","🙏","💪","🎉","🔥","💯",
  "❤️","💙","💚","💛","🧡","💜","🖤","🤍","💔","💕",
  "😮","😲","🥳","🤩","🥲","😬","🤐","🤫","🤭","😏",
];

function EmojiPicker({ onSelect, onClose }: { onSelect: (e: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 w-72"
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map(e => (
          <button
            key={e}
            onClick={() => { onSelect(e); }}
            className="text-xl hover:bg-gray-100 rounded-lg p-1 transition-colors leading-none"
            type="button"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// â”€â”€ Attachment Preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AttachmentBubble({
  url, name, type, size, side,
}: {
  url: string; name?: string; type?: string; size?: number; side: "sent" | "received";
}) {
  const displayName = name ?? url.split("/").pop() ?? "file";
  const displaySize = formatFileSize(size);

  if (type === "image") {
    return (
      <div className="relative group max-w-xs rounded-2xl overflow-hidden">
        <img src={url} alt={displayName} className="max-w-full max-h-64 object-cover rounded-2xl" />
        <a
          href={url}
          download={displayName}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
          aria-label={`Download ${displayName}`}
        >
          <Download className="size-7 text-white" />
        </a>
      </div>
    );
  }

  const icon = type === "pdf"
    ? <FileText className="size-7 text-red-500 flex-shrink-0" />
    : <File className="size-7 text-blue-500 flex-shrink-0" />;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm min-w-[200px] max-w-xs ${
      side === "sent" ? "bg-blue-600 text-white" : "bg-white text-gray-800"
    }`}>
      {icon}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${side === "sent" ? "text-white" : "text-gray-900"}`}>{displayName}</p>
        {displaySize && <p className={`text-xs ${side === "sent" ? "text-blue-200" : "text-gray-400"}`}>{displaySize}</p>}
      </div>
      <a
        href={url}
        download={displayName}
        className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors flex-shrink-0 ${side === "sent" ? "text-white" : "text-gray-500"}`}
        aria-label={`Download ${displayName}`}
      >
        <Download className="size-4" />
      </a>
    </div>
  );
}

// â”€â”€ Pending Attachment Preview Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function PendingAttachmentBar({
  file, onRemove,
}: { file: File; onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-t border-blue-100">
      {previewUrl ? (
        <img src={previewUrl} alt="preview" className="size-10 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <File className="size-6 text-blue-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-lg hover:bg-blue-100 transition-colors text-gray-500"
        type="button"
        aria-label="Remove attachment"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

// â”€â”€ Avatar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Avatar({ name, avatarUrl, size = "md" }: { name: string; avatarUrl?: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "size-8" : "size-10";
  const text = size === "sm" ? "text-xs" : "text-sm";

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`${sz} rounded-xl object-cover flex-shrink-0`} />;
  }

  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${text} ${avatarColor(name)} text-white`}>
      {getInitials(name)}
    </div>
  );
}

// â”€â”€ Start Conversation Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface StartConversationModalProps {
  allSharedMembers: SharedMember[];
  existingContactIds: Set<number>;
  onStart: (email: string) => Promise<void>;
  onClose: () => void;
}

function StartConversationModal({ allSharedMembers, existingContactIds, onStart, onClose }: StartConversationModalProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deduplicate members by email, exclude ones already in contacts
  const members = useMemo(() => {
    const seen = new Set<string>();
    return allSharedMembers.filter(m => {
      if (seen.has(m.userEmail)) return false;
      seen.add(m.userEmail);
      return true;
    });
  }, [allSharedMembers]);

  const filtered = search
    ? members.filter(m =>
        m.userFullName.toLowerCase().includes(search.toLowerCase()) ||
        m.userEmail.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  const handleSelect = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await onStart(email);
      onClose();
    } catch {
      setError("Could not start conversation. The user may not have an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Start a Conversation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
            <Search className="size-4 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>
        )}

        {/* Members list */}
        <div className="overflow-y-auto max-h-72">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              {members.length === 0 ? "No team members found. Join a team first." : "No members match your search."}
            </div>
          ) : (
            filtered.map(m => (
              <button
                key={m.userEmail}
                onClick={() => handleSelect(m.userEmail)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
              >
                <Avatar name={m.userFullName || m.userEmail} avatarUrl={m.avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{m.userFullName || m.userEmail}</p>
                  <p className="text-xs text-gray-400 truncate">{m.userEmail} Â· {m.teamName}</p>
                </div>
                {existingContactIds.has(0) && (
                  <span className="text-xs text-blue-500 flex-shrink-0">Chat</span>
                )}
              </button>
            ))
          )}
        </div>

        {loading && (
          <div className="px-5 py-3 flex items-center justify-center gap-2 text-sm text-gray-500 border-t border-gray-100">
            <Loader2 className="size-4 animate-spin" />
            Starting conversation...
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create Group Modal ────────────────────────────────────────────────────────

interface CreateGroupModalProps {
  allSharedMembers: SharedMember[];
  currentUserId: number;
  onCreate: (name: string, memberEmails: string[]) => Promise<void>;
  onClose: () => void;
}

function CreateGroupModal({ allSharedMembers, currentUserId, onCreate, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deduplicate members by email, exclude self (we don't have userId here, rely on server to exclude)
  const members = useMemo(() => {
    const seen = new Set<string>();
    return allSharedMembers.filter(m => {
      if (!m.userEmail || seen.has(m.userEmail)) return false;
      seen.add(m.userEmail);
      return true;
    });
  }, [allSharedMembers]);

  const filtered = search
    ? members.filter(m =>
        m.userFullName.toLowerCase().includes(search.toLowerCase()) ||
        m.userEmail.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  const toggleMember = (email: string) => {
    setSelectedEmails(prev => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!groupName.trim()) { setError("Please enter a group name."); return; }
    if (selectedEmails.size === 0) { setError("Please select at least one member."); return; }
    setLoading(true);
    setError(null);
    try {
      await onCreate(groupName.trim(), Array.from(selectedEmails));
      onClose();
    } catch {
      setError("Could not create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Create Group Chat</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        {/* Group name */}
        <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <input
            autoFocus
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="Group name..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-blue-400"
          />
        </div>

        {/* Search members */}
        <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
            <Search className="size-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
          {selectedEmails.size > 0 && (
            <p className="text-xs text-blue-600 mt-2 font-medium">{selectedEmails.size} member{selectedEmails.size !== 1 ? "s" : ""} selected</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg flex-shrink-0">{error}</div>
        )}

        {/* Members list */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              {members.length === 0 ? "No team members found. Join a team first." : "No members match your search."}
            </div>
          ) : (
            filtered.map(m => {
              const isSelected = selectedEmails.has(m.userEmail);
              return (
                <button
                  key={m.userEmail}
                  onClick={() => toggleMember(m.userEmail)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                >
                  {isSelected
                    ? <CheckSquare className="size-5 text-blue-600 flex-shrink-0" />
                    : <Square className="size-5 text-gray-300 flex-shrink-0" />
                  }
                  <Avatar name={m.userFullName || m.userEmail} avatarUrl={m.avatarUrl} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.userFullName || m.userEmail}</p>
                    <p className="text-xs text-gray-400 truncate">{m.teamName}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !groupName.trim() || selectedEmails.size === 0}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Message() {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;

  const {
    contacts, messages, isLoading, error, refetch,
    sendMessage, uploadAttachment, resolveContact, addContactLocally,
    activeContactId, setActiveContactId,
    markConversationAsRead, deleteConversation,
  } = useMessages();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    groups, activeGroupId, setActiveGroupId, groupMessages,
    isLoadingGroups, isLoadingMessages,
    fetchGroups, fetchGroupMessages, createGroup,
    sendGroupMessage, markGroupAsRead, leaveGroup, uploadGroupAttachment,
  } = useGroupChats();

  // Group chat input state (separate from DM input)
  const [groupInput, setGroupInput] = useState("");
  const [groupPendingFile, setGroupPendingFile] = useState<File | null>(null);
  const [isGroupSending, setIsGroupSending] = useState(false);
  const [isGroupUploading, setIsGroupUploading] = useState(false);
  const [showGroupEmojiPicker, setShowGroupEmojiPicker] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const groupBottomRef = useRef<HTMLDivElement>(null);
  const groupFileInputRef = useRef<HTMLInputElement>(null);
  const groupTextInputRef = useRef<HTMLInputElement>(null);

  const { allSharedMembers, fetchAllSharedMembers } = useTeams();

  // Fetch team members once for Start Conversation modal
  useEffect(() => {
    fetchAllSharedMembers();
    fetchGroups();
  }, [fetchAllSharedMembers, fetchGroups]);

  const [search, setSearch] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeContactId]);

  // Fetch group messages when active group changes
  useEffect(() => {
    if (activeGroupId !== null) {
      fetchGroupMessages(activeGroupId);
    }
  }, [activeGroupId, fetchGroupMessages]);

  // Scroll group messages to bottom
  useEffect(() => {
    groupBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages.length, activeGroupId]);

  // Merge backend contacts + team members not yet chatted with
  const contactsById = useMemo(() => new Map(contacts.map(c => [c.id, c])), [contacts]);

  // Build a full contact list: existing contacts first, then uncontacted shared members
  const mergedContacts = useMemo(() => {
    // Start with all backend contacts
    const list = [...contacts];
    // Add allSharedMembers not yet in contacts (keyed by email via resolveContact)
    // We don't have user IDs from MongoDB members, so we just show them in the modal
    return list;
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!search) return mergedContacts;
    const q = search.toLowerCase();
    return mergedContacts.filter(c => c.name.toLowerCase().includes(q));
  }, [mergedContacts, search]);

  const activeContact = activeContactId !== null ? contactsById.get(activeContactId) ?? null : null;

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  // Set first contact as active if none selected
  useEffect(() => {
    if (activeContactId === null && contacts.length > 0) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId, setActiveContactId]);

  // Auto mark-as-read when a conversation is opened
  useEffect(() => {
    if (activeContactId === null) return;
    const contact = contacts.find(c => c.id === activeContactId);
    if (contact && contact.unreadCount > 0) {
      markConversationAsRead(activeContactId);
    }
  }, [activeContactId]); // eslint-disable-line react-hooks/exhaustive-deps

  const existingContactIds = useMemo(() => new Set(contacts.map(c => c.id)), [contacts]);

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleSend = useCallback(async () => {
    if (activeContactId === null) return;
    const trimmed = input.trim();
    if (!trimmed && !pendingFile) return;

    setIsSending(true);
    try {
      if (pendingFile) {
        setIsUploading(true);
        let uploadResult;
        try {
          uploadResult = await uploadAttachment(pendingFile);
        } finally {
          setIsUploading(false);
        }
        await sendMessage({
          receiverId: activeContactId,
          body: trimmed,
          attachmentUrl: uploadResult.url,
          attachmentName: uploadResult.name,
          attachmentType: uploadResult.type,
          attachmentSize: uploadResult.size,
        });
        setPendingFile(null);
      } else {
        await sendMessage({ receiverId: activeContactId, body: trimmed });
      }
      setInput("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      // error shown by hook
    } finally {
      setIsSending(false);
    }
  }, [activeContactId, input, pendingFile, sendMessage, uploadAttachment]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPendingFile(f);
    e.target.value = "";
  }, []);

  const handleStartConversation = useCallback(async (email: string) => {
    const contact = await resolveContact(email);
    if (!contact) throw new Error("User not found");
    // Add to local contacts list immediately so the chat pane opens at once
    addContactLocally(contact);
    setActiveContactId(contact.id);
    // fetchMessages will be triggered automatically by the activeContactId effect
  }, [resolveContact, addContactLocally, setActiveContactId]);

  const handleGroupSend = useCallback(async () => {
    if (activeGroupId === null) return;
    const trimmed = groupInput.trim();
    if (!trimmed && !groupPendingFile) return;
    setIsGroupSending(true);
    try {
      if (groupPendingFile) {
        setIsGroupUploading(true);
        let uploadResult;
        try {
          uploadResult = await uploadGroupAttachment(groupPendingFile);
        } finally {
          setIsGroupUploading(false);
        }
        await sendGroupMessage(activeGroupId, {
          body: trimmed,
          attachmentUrl: uploadResult.url,
          attachmentName: uploadResult.name,
          attachmentType: uploadResult.type,
          attachmentSize: uploadResult.size,
        });
        setGroupPendingFile(null);
      } else {
        await sendGroupMessage(activeGroupId, { body: trimmed });
      }
      setGroupInput("");
      setTimeout(() => groupBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      // error handled silently
    } finally {
      setIsGroupSending(false);
    }
  }, [activeGroupId, groupInput, groupPendingFile, sendGroupMessage, uploadGroupAttachment]);

  const handleGroupKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGroupSend();
    }
  }, [handleGroupSend]);

  const handleGroupFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setGroupPendingFile(f);
    e.target.value = "";
  }, []);

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageLoading message="Loading messages..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageError message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* â”€â”€ Page header â”€â”€ */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="w-px h-4 bg-gray-300 hidden sm:block" />
            <p className="text-sm text-gray-500 hidden sm:block">
              <span className="text-blue-600 font-semibold">{contacts.length}</span>
              <span className="ml-1">Conversations</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile contacts toggle */}
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="Toggle contacts"
            >
              <MessageCircle className="size-4" />
              Contacts
            </button>
            <button
              onClick={() => setShowStartModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              aria-label="Start new conversation"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              aria-label="Create group chat"
            >
              <Users className="size-4" />
              <span className="hidden sm:inline">New Group</span>
            </button>
          </div>
        </div>

        {/* â”€â”€ Two-column layout â”€â”€ */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* â”€â”€ Left: contact list â”€â”€ */}
          <div className={`
            absolute inset-y-0 left-0 z-20 w-[300px] sm:w-[340px] bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-200
            lg:relative lg:translate-x-0 lg:z-auto
            ${showContacts ? "translate-x-0" : "-translate-x-full"}
          `}>
            {/* List header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900">All Messages</span>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Filter">
                  <ChevronDown className="size-4 text-gray-500" />
                </button>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="More options">
                <MoreVertical className="size-4 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <Search className="size-4 text-gray-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400"
                  aria-label="Search conversations"
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <MessageCircle className="size-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {search ? "No matches." : "No conversations yet."}
                  </p>
                  {!search && (
                    <button
                      onClick={() => setShowStartModal(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start a Conversation
                    </button>
                  )}
                </div>
              ) : (
                filteredContacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveContactId(c.id);
                      setShowContacts(false);
                      if (c.unreadCount > 0) markConversationAsRead(c.id);
                    }}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${
                      c.id === activeContactId
                        ? "bg-blue-50 border-l-[3px] border-l-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Avatar name={c.name} avatarUrl={c.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-medium truncate ${c.id === activeContactId ? "text-blue-700" : "text-gray-900"}`}>
                          {c.name}
                        </span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                          <span className="text-xs text-gray-400">{formatContactTime(c.lastMessageTime)}</span>
                          {c.unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {c.unreadCount > 9 ? "9+" : c.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-gray-500 truncate flex-1">
                          {c.lastMessage || "No messages yet"}
                        </p>
                        {c.isStarred && <Star className="size-3 text-yellow-500 fill-yellow-400 flex-shrink-0" />}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Groups section */}
            <div className="flex-shrink-0 border-t border-gray-100">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Groups</span>
                {isLoadingGroups && <Loader2 className="size-3 text-gray-400 animate-spin" />}
              </div>
              {groups.length === 0 ? (
                <div className="px-4 pb-3 text-center">
                  <p className="text-xs text-gray-400">No groups yet.</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-52">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGroupId(g.id);
                        setActiveContactId(null);
                        setShowContacts(false);
                        markGroupAsRead(g.id);
                      }}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${
                        g.id === activeGroupId
                          ? "bg-purple-50 border-l-[3px] border-l-purple-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`size-8 rounded-xl flex items-center justify-center flex-shrink-0 ${avatarColor(g.name)} text-white`}>
                        <Users className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-sm font-medium truncate ${g.id === activeGroupId ? "text-purple-700" : "text-gray-900"}`}>
                            {g.name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                            {g.lastMessage && (
                              <span className="text-xs text-gray-400">{formatContactTime(g.lastMessage.sentAt)}</span>
                            )}
                            {g.unreadCount > 0 && (
                              <span className="min-w-[20px] h-5 px-1 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {g.unreadCount > 9 ? "9+" : g.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {g.lastMessage
                            ? `${g.lastMessage.senderName}: ${g.lastMessage.body || "Attachment"}`
                            : `${g.members.length} member${g.members.length !== 1 ? "s" : ""}`
                          }
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile backdrop */}
          {showContacts && (
            <div
              className="absolute inset-0 z-10 bg-black/20 lg:hidden"
              onClick={() => setShowContacts(false)}
              aria-hidden="true"
            />
          )}

          {/* â”€â”€ Right: chat area â”€â”€ */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Group chat view */}
            {activeGroupId !== null && (() => {
              const activeGroup = groups.find(g => g.id === activeGroupId) ?? null;
              const groupedGroupMsgs = groupMessagesByDate(groupMessages);
              return (
                <>
                  {/* Group chat header */}
                  <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activeGroup ? avatarColor(activeGroup.name) : "bg-purple-500"} text-white`}>
                        <Users className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{activeGroup?.name ?? "Group"}</p>
                        <p className="text-xs text-gray-400">{activeGroup?.members.length ?? 0} members</p>
                      </div>
                    </div>
                    <button
                      className="p-2 text-red-400 hover:bg-red-50 border border-gray-200 rounded-xl transition-colors"
                      aria-label="Leave group"
                      onClick={() => setShowLeaveConfirm(true)}
                    >
                      <LogOut className="size-4" />
                    </button>
                  </div>

                  {/* Group messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-5 bg-gray-50 space-y-6">
                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="size-6 text-purple-400 animate-spin" />
                      </div>
                    ) : groupMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <Users className="size-12 text-gray-200 mb-3" />
                        <p className="text-sm text-gray-400">No messages yet - say hello!</p>
                      </div>
                    ) : (
                      groupedGroupMsgs.map(group => (
                        <div key={group.label}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium px-2 bg-gray-50">{group.label}</span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>
                          <div className="flex flex-col gap-3">
                            {group.messages.map((msg: any) => {
                              const isSent = msg.senderId === currentUserId;
                              const hasAttachment = !!msg.attachmentUrl;
                              return (
                                <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                                  <div className={`flex flex-col max-w-[72%] ${isSent ? "items-end" : "items-start"}`}>
                                    {!isSent && (
                                      <span className="text-xs font-semibold text-purple-600 px-1 mb-0.5">{msg.senderName}</span>
                                    )}
                                    {hasAttachment && (
                                      <AttachmentBubble
                                        url={msg.attachmentUrl!}
                                        name={msg.attachmentName}
                                        type={msg.attachmentType}
                                        size={msg.attachmentSize}
                                        side={isSent ? "sent" : "received"}
                                      />
                                    )}
                                    {msg.body && (
                                      <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                                        hasAttachment ? "mt-1" : ""
                                      } rounded-[18px] ${
                                        isSent
                                          ? "bg-purple-600 text-white rounded-br-[4px]"
                                          : "bg-white text-gray-800 rounded-bl-[4px]"
                                      }`}>
                                        {msg.body}
                                      </div>
                                    )}
                                    <span className="mt-1 text-xs text-gray-400 px-1">{formatTimestamp(msg.sentAt)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={groupBottomRef} />
                  </div>

                  {/* Group input bar */}
                  <div className="flex-shrink-0 bg-white border-t border-gray-200">
                    {groupPendingFile && (
                      <PendingAttachmentBar file={groupPendingFile} onRemove={() => setGroupPendingFile(null)} />
                    )}
                    <div className="px-4 py-3 flex items-center gap-2">
                      <div className="relative flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowGroupEmojiPicker(p => !p)}
                          className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
                          aria-label="Add emoji"
                        >
                          <Smile className="size-5 text-purple-600" />
                        </button>
                        {showGroupEmojiPicker && (
                          <EmojiPicker
                            onSelect={(e) => {
                              setGroupInput(prev => prev + e);
                              groupTextInputRef.current?.focus();
                            }}
                            onClose={() => setShowGroupEmojiPicker(false)}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => groupFileInputRef.current?.click()}
                        className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0"
                        aria-label="Attach file"
                      >
                        {isGroupUploading
                          ? <Loader2 className="size-5 text-purple-600 animate-spin" />
                          : <Paperclip className="size-5 text-purple-600" />
                        }
                      </button>
                      <input
                        ref={groupFileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.mp3,.mp4,.mov"
                        className="hidden"
                        onChange={handleGroupFileChange}
                        aria-label="Attach file to group"
                      />
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                        <input
                          ref={groupTextInputRef}
                          value={groupInput}
                          onChange={e => setGroupInput(e.target.value)}
                          onKeyDown={handleGroupKeyDown}
                          placeholder={groupPendingFile ? "Add a caption (optional)..." : "Message the group..."}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                          aria-label="Type a group message"
                          disabled={isGroupSending}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleGroupSend}
                        disabled={isGroupSending || (!groupInput.trim() && !groupPendingFile)}
                        className="size-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Send group message"
                      >
                        {isGroupSending
                          ? <Loader2 className="size-4 text-white animate-spin" />
                          : <Send className="size-4 text-white" />
                        }
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* DM chat view */}
            {activeGroupId === null && (activeContact === null ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="size-14 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Select a conversation</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">or start a new one</p>
                  <button
                    onClick={() => setShowStartModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start a Conversation
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={activeContact.name} avatarUrl={activeContact.avatarUrl} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activeContact.name}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors" aria-label="Search in chat">
                      <Search className="size-4" />
                    </button>
                    <button
                      className="p-2 text-red-400 hover:bg-red-50 border border-gray-200 rounded-xl transition-colors"
                      aria-label="Delete conversation"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-5 bg-gray-50 space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <MessageCircle className="size-12 text-gray-200 mb-3" />
                      <p className="text-sm text-gray-400">No messages yet â€” say hello!</p>
                    </div>
                  ) : (
                    groupedMessages.map(group => (
                      <div key={group.label}>
                        {/* Date divider */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400 font-medium px-2 bg-gray-50">{group.label}</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="flex flex-col gap-3">
                          {group.messages.map((msg: any) => {
                            const isSent = msg.senderId === currentUserId;
                            const hasAttachment = !!msg.attachmentUrl;

                            // System message (farewell) rendered as centered separator
                            if (msg.isSystemMessage) {
                              return (
                                <div key={msg.id} className="flex items-center gap-3 py-1">
                                  <div className="flex-1 h-px bg-gray-200" />
                                  <span className="text-xs text-gray-400 font-medium px-2 italic">{msg.body}</span>
                                  <div className="flex-1 h-px bg-gray-200" />
                                </div>
                              );
                            }

                            return (
                              <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                                <div className={`flex flex-col max-w-[72%] ${isSent ? "items-end" : "items-start"}`}>
                                  {/* Attachment bubble */}
                                  {hasAttachment && (
                                    <AttachmentBubble
                                      url={msg.attachmentUrl!}
                                      name={msg.attachmentName}
                                      type={msg.attachmentType}
                                      size={msg.attachmentSize}
                                      side={isSent ? "sent" : "received"}
                                    />
                                  )}

                                  {/* Text bubble (only if there's a body) */}
                                  {msg.body && (
                                    <div
                                      className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                                        hasAttachment ? "mt-1" : ""
                                      } rounded-[18px] ${
                                        isSent
                                          ? "bg-blue-600 text-white rounded-br-[4px]"
                                          : "bg-white text-gray-800 rounded-bl-[4px]"
                                      }`}
                                    >
                                      {msg.body}
                                    </div>
                                  )}

                                  <span className="mt-1 text-xs text-gray-400 px-1">
                                    {formatTimestamp(msg.sentAt)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* â”€â”€ Input bar â”€â”€ */}
                <div className="flex-shrink-0 bg-white border-t border-gray-200">
                  {/* Pending attachment preview */}
                  {pendingFile && (
                    <PendingAttachmentBar file={pendingFile} onRemove={() => setPendingFile(null)} />
                  )}

                  <div className="px-4 py-3 flex items-center gap-2">
                    {/* Emoji */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(p => !p)}
                        className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
                        aria-label="Add emoji"
                      >
                        <Smile className="size-5 text-blue-600" />
                      </button>
                      {showEmojiPicker && (
                        <EmojiPicker
                          onSelect={(e) => {
                            setInput(prev => prev + e);
                            textInputRef.current?.focus();
                          }}
                          onClose={() => setShowEmojiPicker(false)}
                        />
                      )}
                    </div>

                    {/* Attachment */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0"
                      aria-label="Attach file"
                    >
                      {isUploading
                        ? <Loader2 className="size-5 text-blue-600 animate-spin" />
                        : <Paperclip className="size-5 text-blue-600" />
                      }
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.mp3,.mp4,.mov"
                      className="hidden"
                      onChange={handleFileChange}
                      aria-label="Attach file"
                    />

                    {/* Text input */}
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                      <input
                        ref={textInputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={pendingFile ? "Add a caption (optional)..." : "Type a message..."}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                        aria-label="Type a message"
                        disabled={isSending}
                      />
                    </div>

                    {/* Send */}
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isSending || (!input.trim() && !pendingFile)}
                      className="size-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      aria-label="Send message"
                    >
                      {isSending
                        ? <Loader2 className="size-4 text-white animate-spin" />
                        : <Send className="size-4 text-white" />
                      }
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Start Conversation Modal */}
      {showStartModal && (
        <StartConversationModal
          allSharedMembers={allSharedMembers}
          existingContactIds={existingContactIds}
          onStart={handleStartConversation}
          onClose={() => setShowStartModal(false)}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          allSharedMembers={allSharedMembers}
          currentUserId={currentUserId}
          onCreate={async (name, memberUserIds) => {
            const g = await createGroup(name, memberUserIds);
            setActiveGroupId(g.id);
            setActiveContactId(null);
          }}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}

      {/* Delete Conversation Confirmation Modal */}
      {showDeleteConfirm && activeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Delete Conversation</h2>
              <p className="text-sm text-gray-500">
                This will permanently remove this conversation from your view.{" "}
                <strong>{activeContact.name}</strong> will see a message that you left the chat.
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 pb-5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  if (activeContactId !== null) await deleteConversation(activeContactId);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Confirmation Modal */}
      {showLeaveConfirm && activeGroupId !== null && (() => {
        const grp = groups.find(g => g.id === activeGroupId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLeaveConfirm(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Leave Group</h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to leave <strong>{grp?.name ?? "this group"}</strong>? You will no longer receive messages from this group.
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 pb-5">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowLeaveConfirm(false);
                    if (activeGroupId !== null) await leaveGroup(activeGroupId);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

