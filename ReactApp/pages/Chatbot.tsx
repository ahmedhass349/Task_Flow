import { FormEvent, useMemo, useRef, useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Clock3,
  Plus,
  Trash2,
  FileText,
  ListChecks,
  FolderKanban,
  MessageSquare,
  Paperclip,
  X,
  AlertTriangle,
  Code2,
  ScanSearch,
  Copy,
  Check,
  Pencil,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { PageLoading, PageError } from "../Components/PageState";
import { useChatbot } from "../hooks/useChatbot";
import { useAuth } from "../context/AuthContext";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isEdited?: boolean;
  time: string;
}

/** Metadata for each chat mode — colors, icons, labels used across the UI. */
const MODE_META = {
  general: {
    label: "General",
    Icon: MessageSquare,
    active:   "bg-blue-100 text-blue-700 border-blue-300 shadow-sm",
    inactive: "bg-white text-blue-400 border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300",
    badge:    "bg-blue-50 text-blue-500 border-blue-100",
  },
  coder: {
    label: "Coder",
    Icon: Code2,
    active:   "bg-violet-100 text-violet-700 border-violet-300 shadow-sm",
    inactive: "bg-white text-violet-400 border-violet-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300",
    badge:    "bg-violet-50 text-violet-500 border-violet-100",
  },
  scanner: {
    label: "Scanner",
    Icon: ScanSearch,
    active:   "bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm",
    inactive: "bg-white text-emerald-400 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300",
    badge:    "bg-emerald-50 text-emerald-500 border-emerald-100",
  },
} as const;
type ChatModeKey = keyof typeof MODE_META;

const starterPrompts = [
  { icon: ListChecks, label: "Plan my tasks for this week based on priority and due dates." },
  { icon: FileText, label: "Create a daily standup summary from my open tasks." },
  { icon: MessageSquare, label: "Draft a message to the team about overdue items." },
  { icon: FolderKanban, label: "Suggest a sprint goal using the active projects list." },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

function avatarBg(email: string): string {
  const palette = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#14b8a6"];
  let h = 0;
  for (let i = 0; i < email.length; i++) h = email.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

function accountInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Mini version of the TaskFlow pixel-grid logo, scaled to fit inside a chat avatar. */
function TaskFlowPixelIcon({ px = 6 }: { px?: number }) {
  // Each row is [opacity, ...] for a 4×4 grid
  const grid = [
    [1,    0,    0.60, 0   ],
    [0,    0.60, 0.45, 0.30],
    [0.60, 0.45, 0.30, 0.15],
    [0,    0.30, 0.15, 0   ],
  ];
  return (
    <div style={{ width: px * 4, height: px * 4, position: "relative", flexShrink: 0 }}>
      {grid.map((row, r) =>
        row.map((opacity, c) =>
          opacity > 0 ? (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                width: px,
                height: px,
                left: c * px,
                top: r * px,
                background: "#155EEF",
                opacity,
              }}
            />
          ) : null
        )
      )}
    </div>
  );
}

export default function Chatbot() {
  const { user } = useAuth();
  const userInitials = user ? accountInitials(user.fullName) : "U";
  const userBg = user ? avatarBg(user.email) : "#3b82f6";

  const {
    conversationList,
    activeConversation,
    isLoading,
    isStreaming,
    streamingText,
    error,
    refetch,
    createConversation,
    streamMessage,
    editMessageAndRestream,
    deleteConversation,
    clearAllConversations,
    setActiveConversationId,
    activeConversationId,
  } = useChatbot();

  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    content: string;   // raw base64 (no prefix) for images/PDFs; plain text for text files
    mimeType: string;
    isMedia: boolean;  // true for image/* or application/pdf
  } | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatModeKey>("general");
  const [switchMarkers, setSwitchMarkers] = useState<Array<{ afterIndex: number; toMode: ChatModeKey }>>([]); 
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isMedia = file.type.startsWith("image/") || file.type === "application/pdf";
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      let content = result;
      if (isMedia) {
        // Strip "data:<mime>;base64," prefix — keep only raw base64
        const commaIdx = result.indexOf(",");
        content = commaIdx >= 0 ? result.slice(commaIdx + 1) : result;
      }
      setAttachedFile({ name: file.name, content, mimeType: file.type, isMedia });
    };
    if (isMedia) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  const uiMessages = useMemo(() => {
    if (!activeConversation) return [];
    return activeConversation.messages.map(msg => ({
      id: msg.id,
      role: msg.role as MessageRole,
      text: msg.text,
      isEdited: (msg as any).isEdited ?? false,
      time: formatTime(msg.createdAt),
    }));
  }, [activeConversation]);

  // Clear switch markers when the user navigates to a different conversation
  useEffect(() => {
    setSwitchMarkers([]);
  }, [activeConversationId]);

  /** Interleaved list of messages + mode-switch dividers for rendering. */
  const renderedItems = useMemo(() => {
    type MsgItem    = { type: "message"; data: ChatMessage };
    type DivItem    = { type: "divider"; toMode: ChatModeKey; key: string };
    const items: Array<MsgItem | DivItem> = [];
    uiMessages.forEach((msg, idx) => {
      items.push({ type: "message", data: msg });
      switchMarkers
        .filter(m => m.afterIndex === idx)
        .forEach((marker, mi) => {
          items.push({ type: "divider", toMode: marker.toMode, key: `sw-${idx}-${mi}` });
        });
    });
    return items;
  }, [uiMessages, switchMarkers]);

  const handleSendText = useCallback(async (
    text: string,
    fileContent?: string,
    fileName?: string,
    attachedBase64?: string,
    attachedMimeType?: string
  ) => {
    if (!text.trim() && !attachedBase64) return;
    setStreamError(null);
    let convId = activeConversationId;
    if (!convId) {
      const title = text.trim().slice(0, 60) || (attachedMimeType?.startsWith("image/") ? "Image conversation" : "Attached file");
      try {
        convId = await createConversation({ title });
      } catch {
        return;
      }
    }
    if (convId) {
      try {
        await streamMessage(convId, text, fileContent, fileName, attachedBase64, attachedMimeType, chatMode);
      } catch {
        // Error handled by the hook
      }
    }
  }, [activeConversationId, createConversation, streamMessage, chatMode]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (isStreaming) return;
    const file = attachedFile;
    if (!text && !file) return;
    setInput("");
    setAttachedFile(null);
    // Route to base64 path for images/PDFs, text-content path for plain files
    const effectiveText = text || (file?.isMedia ? "Please analyze this attachment." : "");
    if (file?.isMedia) {
      await handleSendText(effectiveText, undefined, undefined, file.content, file.mimeType);
    } else {
      await handleSendText(effectiveText, file?.content, file?.name);
    }
  };

  const handleCopyConversation = useCallback(() => {
    const text = uiMessages
      .map(m => `[${m.role === "user" ? "You" : "AI"}] ${m.time}\n${m.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [uiMessages]);

  const handleSaveEdit = useCallback(async (msgId: string) => {
    if (!editValue.trim() || !activeConversationId) return;
    setEditingId(null);
    setStreamError(null);
    try {
      await editMessageAndRestream(activeConversationId, msgId, editValue.trim(), chatMode);
    } catch {
      // Error handled by the hook
    }
  }, [editValue, activeConversationId, editMessageAndRestream, chatMode]);

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
    } catch {
      // Error handled by the hook
    }
  };

  const handleClearAll = async () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      return;
    }
    setConfirmClearAll(false);
    try {
      await clearAllConversations();
    } catch {
      // Error handled by the hook
    }
  };

  // Auto-scroll to bottom when messages or streaming text change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages, streamingText]);

  // Dismiss clear-all confirmation on outside context change
  useEffect(() => {
    if (confirmClearAll) {
      const timer = setTimeout(() => setConfirmClearAll(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmClearAll]);

  /* ── Page states ── */
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <PageLoading message="Loading chatbot..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <PageError message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const hasConversations = conversationList.length > 0;
  const hasMessages = uiMessages.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto p-6 gap-5">

            {/* Page header */}
            <div className="flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-500 mt-0.5">Context-aware support for planning, summaries, and task execution</p>
              </div>
              <button
                onClick={() => { setActiveConversationId(null); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="New chat"
              >
                <Plus className="size-4" />
                New Chat
              </button>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5">

              {/* ── Conversation sidebar ── */}
              <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock3 className="size-4 text-blue-600" />
                    <h2 className="text-sm font-semibold">Recent Chats</h2>
                    {hasConversations && (
                      <span className="text-xs text-gray-400 font-normal">({conversationList.length})</span>
                    )}
                  </div>
                  {hasConversations && (
                    <button
                      onClick={handleClearAll}
                      className={`text-xs px-2 py-1 rounded-md transition-colors ${
                        confirmClearAll
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                      title={confirmClearAll ? "Click again to confirm" : "Clear all chats"}
                      aria-label="Clear all conversations"
                    >
                      {confirmClearAll ? "Confirm?" : "Clear all"}
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {!hasConversations ? (
                    <div className="px-4 py-10 text-center text-sm text-gray-400">
                      <MessageSquare className="size-8 text-gray-300 mx-auto mb-2" />
                      No conversations yet.
                      <br />Start a new chat to get going.
                    </div>
                  ) : (
                    conversationList.map((conv) => {
                      const isActive = activeConversationId === conv.id;
                      return (
                        <div
                          key={conv.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveConversationId(conv.id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveConversationId(conv.id); }}
                          className={`group w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                            isActive ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}>
                                {conv.title}
                              </p>
                              {conv.lastMessagePreview && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{conv.lastMessagePreview}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[11px] text-gray-400">{relativeTime(conv.updatedAt)}</p>
                                {conv.messageCount != null && conv.messageCount > 0 && (
                                  <span className="text-[11px] text-gray-400">· {conv.messageCount} msg{conv.messageCount !== 1 ? "s" : ""}</span>
                                )}
                              </div>
                              {conv.usedModes && conv.usedModes.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap mt-1">
                                  {conv.usedModes.map(mode => {
                                    const M = MODE_META[mode as ChatModeKey];
                                    if (!M) return null;
                                    return (
                                      <span key={mode} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${M.badge}`}>
                                        <M.Icon size={9} />{M.label}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleDeleteConversation(e, conv.id)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label={`Delete chat: ${conv.title}`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* ── Main chat panel ── */}
              <section className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                {/* Chat header */}
                <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap flex-shrink-0 bg-gradient-to-r from-blue-50/60 to-violet-50/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <TaskFlowPixelIcon px={5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {activeConversation ? activeConversation.title : "TaskFlow AI Assistant"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isStreaming ? (
                          <span className="text-blue-600 animate-pulse">Typing…</span>
                        ) : (
                          "Ask anything about your tasks and projects"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    {/* Mode selector */}
                    {(Object.entries(MODE_META) as Array<[ChatModeKey, typeof MODE_META[ChatModeKey]]>).map(([id, meta]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (id !== chatMode && uiMessages.length > 0) {
                            setSwitchMarkers(prev => [...prev, { afterIndex: uiMessages.length - 1, toMode: id }]);
                          }
                          setChatMode(id);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                          chatMode === id ? meta.active : meta.inactive
                        }`}
                      >
                        <meta.Icon size={11} />
                        {meta.label}
                      </button>
                    ))}
                    {/* Copy conversation */}
                    {hasMessages && (
                      <button
                        type="button"
                        onClick={handleCopyConversation}
                        aria-label="Copy conversation"
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all bg-white text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      >
                        {copied ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50/80 to-white/90">
                  {!hasMessages && !isStreaming ? (
                    /* Welcome / starter prompts */
                    <div className="h-full flex flex-col items-center justify-center gap-6 py-8">
                      <div className="text-center">
                        <div className="size-16 rounded-2xl bg-white border-2 border-blue-100 shadow-md flex items-center justify-center mx-auto mb-4">
                          <TaskFlowPixelIcon px={8} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">How can I help you today?</h3>
                        <p className="text-sm text-gray-500 mt-1">Ask a question or pick a starter prompt below.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                        {starterPrompts.map(({ icon: Icon, label }) => (
                          <button
                            key={label}
                            onClick={() => !isStreaming && handleSendText(label)}
                            disabled={isStreaming}
                            className="flex items-start gap-3 text-left px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <Icon className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 group-hover:text-blue-700">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {renderedItems.map(item => {
                        if (item.type === "divider") {
                          const { Icon: SwitchIcon, label: switchLabel, badge } = MODE_META[item.toMode];
                          return (
                            <div key={item.key} className="flex items-center gap-3 py-0.5">
                              <div className="flex-1 h-px bg-gray-200" />
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badge}`}>
                                <SwitchIcon size={10} />
                                switched to {switchLabel}
                              </span>
                              <div className="flex-1 h-px bg-gray-200" />
                            </div>
                          );
                        }

                        const message = item.data;
                        return (
                          <div
                            key={message.id}
                            className={`group flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {/* AI avatar */}
                            {message.role === "assistant" && (
                              <div className="size-7 rounded-lg bg-white border border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0 mb-1">
                                <TaskFlowPixelIcon px={4} />
                              </div>
                            )}

                            <div
                              className={`max-w-[76%] rounded-2xl px-4 py-3 shadow-sm ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white rounded-br-sm"
                                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              {message.role === "assistant" ? (
                                <div className="text-sm leading-relaxed">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      p({ children }) { return <p className="mb-1.5 last:mb-0">{children}</p>; },
                                      pre({ children }) { return <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto text-xs my-2 font-mono whitespace-pre">{children}</pre>; },
                                      code({ className, children }) {
                                        if (className?.startsWith("language-")) {
                                          return <code className="font-mono text-xs">{children}</code>;
                                        }
                                        return <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[0.8em]">{children}</code>;
                                      },
                                      ul({ children }) { return <ul className="list-disc list-outside pl-4 space-y-0.5 my-1.5">{children}</ul>; },
                                      ol({ children }) { return <ol className="list-decimal list-outside pl-4 space-y-0.5 my-1.5">{children}</ol>; },
                                      li({ children }) { return <li>{children}</li>; },
                                      h1({ children }) { return <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>; },
                                      h2({ children }) { return <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>; },
                                      h3({ children }) { return <h3 className="text-sm font-semibold mt-1.5 mb-0.5">{children}</h3>; },
                                      strong({ children }) { return <strong className="font-semibold">{children}</strong>; },
                                      a({ href, children }) { return <a href={href} className="text-blue-600 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">{children}</a>; },
                                      blockquote({ children }) { return <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-500 my-1.5">{children}</blockquote>; },
                                      hr() { return <hr className="border-gray-200 my-2" />; },
                                    }}
                                  >
                                    {message.text}
                                  </ReactMarkdown>
                                </div>
                              ) : editingId === message.id ? (
                                /* ── Inline edit UI ── */
                                <div className="min-w-[200px]">
                                  <textarea
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="w-full bg-blue-500 text-white text-sm resize-none outline-none rounded placeholder:text-blue-300 min-h-[60px] leading-relaxed"
                                    autoFocus
                                    onKeyDown={e => {
                                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSaveEdit(message.id); }
                                      if (e.key === "Escape") { setEditingId(null); }
                                    }}
                                  />
                                  <div className="flex justify-end gap-1.5 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingId(null)}
                                      className="px-2.5 py-0.5 text-[11px] rounded bg-blue-500 hover:bg-blue-400 text-white transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEdit(message.id)}
                                      className="px-2.5 py-0.5 text-[11px] rounded bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                      Save &amp; Resend
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                              )}
                              <div className={`mt-1.5 flex items-center gap-1 ${message.role === "user" ? "justify-end" : ""}`}>
                                <p className={`text-[11px] ${message.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                                  {message.time}
                                </p>
                                {message.isEdited && (
                                  <span className={`text-[10px] italic ${message.role === "user" ? "text-blue-300" : "text-gray-400"}`}>· edited</span>
                                )}
                                {message.role === "user" && !isStreaming && editingId !== message.id && (
                                  <button
                                    type="button"
                                    aria-label="Edit message"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 text-blue-300 hover:text-white"
                                    onClick={() => { setEditingId(message.id); setEditValue(message.text); }}
                                  >
                                    <Pencil size={10} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* User avatar */}
                            {message.role === "user" && (
                              <div
                                className="size-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mb-1"
                                style={{ background: userBg }}
                              >
                                {userInitials}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Streaming bubble */}
                      {isStreaming && (
                        <div className="flex items-end gap-2 justify-start">
                          <div className="size-7 rounded-lg bg-white border border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0 mb-1">
                            <TaskFlowPixelIcon px={4} />
                          </div>
                          <div className="max-w-[76%] rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-200 text-gray-800 rounded-bl-sm">
                            {streamingText ? (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {streamingText}
                                <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
                              </p>
                            ) : (
                              <div className="flex items-center gap-1 py-1">
                                <span className="size-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="size-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="size-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Stream error banner */}
                {streamError && (
                  <div className="mx-5 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs flex-shrink-0">
                    <AlertTriangle className="size-3.5 flex-shrink-0" />
                    <span className="flex-1">{streamError}</span>
                    <button onClick={() => setStreamError(null)} aria-label="Dismiss error">
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Input bar */}
                <div className="px-5 py-4 border-t border-gray-200 bg-white space-y-2 flex-shrink-0">
                  {/* File attachment chip */}
                  {attachedFile && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs w-fit">
                      {attachedFile.isMedia && attachedFile.mimeType.startsWith("image/") ? (
                        <img
                          src={`data:${attachedFile.mimeType};base64,${attachedFile.content}`}
                          alt="Attachment preview"
                          className="h-8 w-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <Paperclip className="size-3" />
                      )}
                      <span className="max-w-[200px] truncate">{attachedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-blue-400 hover:text-blue-600"
                        aria-label="Remove attachment"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.json,.csv,.py,.ts,.tsx,.js,.jsx,.pdf,image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      aria-label="Attach file"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isStreaming}
                      className="size-10 rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Attach file"
                    >
                      <Paperclip className="size-4" />
                    </button>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isStreaming}
                      placeholder="Ask anything about your tasks, projects, or workflow…"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Chat input"
                    />
                    <button
                      type="submit"
                      disabled={isStreaming || (!input.trim() && !attachedFile)}
                      className="size-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <Send className="size-4" />
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
