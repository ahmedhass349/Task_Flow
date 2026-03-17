import { useState, useRef, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";
import { useMessages } from "../hooks/useMessages";
import {
  Search, Star, MoreVertical, Smile, Mic, ThumbsUp,
  Send, Plus, ChevronDown, Clock, MessageCircle,
} from "lucide-react";

/* ── Types ── */
interface Contact {
  id: number;
  name: string;
  initials: string;
  avatarClass: string;
  preview: string;
  time: string;
  unread: number;
  starred: boolean;
}

interface ChatMessage {
  id: number;
  side: "received" | "sent";
  type: "text" | "voice";
  text?: string;
  duration?: string;
  time: string;
}

/* ── Component ── */
export default function Message() {
  const { contacts, messages, isLoading, error, refetch, sendMessage: sendMessageHook, activeContactId, setActiveContactId } = useMessages();
  
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Convert backend contacts to UI format
  const uiContacts = contacts.map(contact => ({
    id: parseInt(contact.id),
    name: contact.name,
    initials: contact.name.split(' ').map(n => n[0]).join(''),
    avatarClass: "bg-blue-200 text-blue-700", // Default, could be enhanced
    preview: contact.lastMessage || "No messages yet",
    time: contact.lastMessageTime ? formatRelativeTime(contact.lastMessageTime) : "",
    unread: contact.unreadCount,
    starred: false, // Backend doesn't provide this
  }));

  // Convert backend messages to UI format
  const uiMessages = messages.map(msg => ({
    id: parseInt(msg.id),
    side: msg.senderId === "current-user" ? "sent" as const : "received" as const,
    type: "text" as const,
    text: msg.body,
    time: formatRelativeTime(msg.sentAt),
  }));

  // Helper to format relative time
  function formatRelativeTime(iso: string): string {
    const created = new Date(iso);
    const diffMs = Date.now() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "Yesterday";
    return `${diffD} days ago`;
  }

  const handleSendMessage = async () => {
    if (input.trim() && activeContactId) {
      try {
        await sendMessageHook(activeContactId, input.trim());
        setInput("");
        // Scroll to bottom
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const activeMsgs = uiMessages;
  const activeContact = uiContacts.find(c => c.id === parseInt(activeContactId || "")) ?? null;

  const filteredContacts = search
    ? uiContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : uiContacts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContactId, uiMessages.length]);

  const selectContact = (id: number) => {
    setActiveContactId(id.toString());
    setShowContacts(false); // close mobile panel
  };

  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Backend doesn't support starring contacts, this would need to be implemented
  };

  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ── Page states ── */
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

  if (contacts.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <PageEmpty
            title="No conversations yet"
            description="Start a new conversation to get going."
            icon={MessageCircle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* ── Page header ── */}
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
            <button aria-label="New message" className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Messages</span>
            </button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* ──────────── Left: contact list ──────────── */}
          {/* Desktop: always visible. Mobile: slide-over when toggled */}
          <div className={`
            absolute inset-y-0 left-0 z-20 w-[300px] sm:w-[360px] bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-200
            lg:relative lg:translate-x-0 lg:z-auto
            ${showContacts ? "translate-x-0" : "-translate-x-full"}
          `}>

            {/* List header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900">All Messages</span>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Filter messages">
                  <ChevronDown className="size-4 text-gray-500" />
                </button>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="More options">
                <MoreVertical className="size-4 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <Search className="size-4 text-gray-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search or start a new chat"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400"
                  aria-label="Search contacts"
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No contacts match your search.</div>
              ) : (
                filteredContacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => selectContact(c.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${
                      c.id === parseInt(activeContactId || "0") ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`size-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.avatarClass}`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-medium ${c.id === parseInt(activeContactId || "0") ? "text-blue-700" : "text-gray-900"}`}>{c.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {c.unread > 0 && (
                            <span className="size-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {c.unread}
                            </span>
                          )}
                          <button
                            onClick={e => toggleStar(c.id, e)}
                            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                            aria-label={c.starred ? "Unstar conversation" : "Star conversation"}
                          >
                            <Star className={`size-3.5 ${c.starred ? "fill-blue-600 text-blue-600" : "text-gray-400"}`} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">{c.preview}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>
                    </div>
                  </button>
                ))
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

          {/* ──────────── Right: chat area ──────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeContact === null ? (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageCircle className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Select a conversation to start chatting.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeContact.avatarClass}`}>
                      {activeContact.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activeContact.name}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors" aria-label="Star conversation">
                      <Star className="size-4 text-blue-600 fill-blue-600" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors" aria-label="Search in conversation">
                      <Search className="size-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors" aria-label="More options">
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
                  {/* Date divider */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium px-2">Today · {timeStr}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {activeMsgs.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="size-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {activeMsgs.map(msg => (
                        <div key={msg.id} className={`flex ${msg.side === "sent" ? "justify-end" : "justify-start"}`}>
                          <div className={`flex flex-col ${msg.side === "sent" ? "items-end" : "items-start"}`}>
                            {msg.type === "text" ? (
                              <div
                                className={`px-5 py-3 text-sm leading-relaxed whitespace-pre-line max-w-xs shadow-sm rounded-[20px] ${
                                  msg.side === "sent"
                                    ? "bg-blue-600 text-white rounded-br-[4px]"
                                    : "bg-white text-gray-800 rounded-bl-[4px]"
                                }`}
                              >
                                {msg.text}
                              </div>
                            ) : (
                              /* Voice note */
                              <div className="flex items-center gap-3 px-5 py-3 shadow-sm bg-white rounded-[20px] rounded-bl-none">
                                <button
                                  className="size-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors"
                                  aria-label="Play voice message"
                                >
                                  <Mic className="size-4 text-white" />
                                </button>
                              </div>
                            )}
                            <span className="mt-1 text-xs text-gray-400 px-1">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* ── Input bar ── */}
                <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-3">
                  <button
                    className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0"
                    aria-label="Add emoji"
                  >
                    <Smile className="size-5 text-blue-600" />
                  </button>

                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message here ..."
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      aria-label="Type a message"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="size-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="size-3.5 text-white" />
                    </button>
                  </div>

                  <button
                    className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0 hidden sm:flex"
                    aria-label="Record voice message"
                  >
                    <Mic className="size-5 text-blue-600" />
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0 hidden sm:flex"
                    aria-label="Send thumbs up"
                  >
                    <ThumbsUp className="size-5 text-blue-600" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
