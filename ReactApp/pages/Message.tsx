import { useState, useRef, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";
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

/* ── Static data ── */
const SEED_CONTACTS: Contact[] = [
  { id: 1, name: "Sarah Chen",      initials: "SC", avatarClass: "bg-pink-200 text-pink-700",     preview: "Can you review the latest mockups when you get a chance?", time: "Just now",   unread: 1, starred: false },
  { id: 2, name: "Mike Johnson",    initials: "MJ", avatarClass: "bg-blue-200 text-blue-700",     preview: "The API docs are ready for review.",                        time: "10 min ago", unread: 1, starred: false },
  { id: 3, name: "Alex Kim",        initials: "AK", avatarClass: "bg-green-200 text-green-700",   preview: "Pushed the backend fix. Let me know if it resolves it.",   time: "45 min ago", unread: 1, starred: false },
  { id: 4, name: "Emily Rodriguez", initials: "ER", avatarClass: "bg-purple-200 text-purple-700", preview: "Thanks for the feedback on the wireframes!",               time: "2 hr ago",   unread: 0, starred: false },
  { id: 5, name: "Dev Team",        initials: "DT", avatarClass: "bg-orange-200 text-orange-700", preview: "Standup is moved to 10 AM tomorrow.",                     time: "Yesterday",  unread: 0, starred: false },
];

const SEED_MSGS: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, side: "received", type: "text", text: "Can you review the latest mockups when you get a chance?", time: "Just now" },
    { id: 2, side: "sent",     type: "text", text: "Sure! Sending you my feedback shortly.", time: "Just now" },
  ],
  2: [
    { id: 1, side: "received", type: "text",  text: "The API docs are ready for review.", time: "10 min ago" },
    { id: 2, side: "received", type: "voice", duration: "00:42", time: "10 min ago" },
    { id: 3, side: "sent",     type: "text",  text: "Great, I'll take a look now.", time: "8 min ago" },
    { id: 4, side: "sent",     type: "text",  text: "Looks good so far! A few minor comments coming.", time: "5 min ago" },
  ],
  3: [
    { id: 1, side: "received", type: "text", text: "Pushed the backend fix. Let me know if it resolves it.", time: "45 min ago" },
    { id: 2, side: "sent",     type: "text", text: "Testing now...", time: "40 min ago" },
    { id: 3, side: "sent",     type: "text", text: "Confirmed! The issue is fixed. Thanks!", time: "38 min ago" },
  ],
  4: [
    { id: 1, side: "sent",     type: "text", text: "Your wireframes look great overall. A few small tweaks on the nav section.", time: "2 hr ago" },
    { id: 2, side: "received", type: "text", text: "Thanks for the feedback on the wireframes!", time: "2 hr ago" },
  ],
  5: [
    { id: 1, side: "received", type: "text", text: "Standup is moved to 10 AM tomorrow.", time: "Yesterday" },
    { id: 2, side: "sent",     type: "text", text: "Got it, thanks for the heads up!", time: "Yesterday" },
  ],
};

/* ── Waveform (SVG bars from Figma heights) ── */
const WAVE_HEIGHTS = [4,4,4,4,4,4,6,6,6,6,6,9,9,9,9,12,9,9,9,9,9,18,16,16,16,16,12,12,9,9,9,9,9,12,16,9,9,9,12,12,18,16,16,16,16,12,12,9,9,9,9,4,4,9,4,12,12,4,4,12,12,12,12,4,4,18,9,9,9,4,4,4,9,9,9,9,9,9,4,4,9,9,16,9,9,9,4,4,12,4,12,9,9,9,18,16,12,12,4,9,9,9,6,6,6,6,6,6,4,4,4,4];

function Waveform() {
  return (
    <svg width={WAVE_HEIGHTS.length * 2.5} height={22} viewBox={`0 0 ${WAVE_HEIGHTS.length * 2.5} 22`} className="block text-blue-600" aria-hidden="true">
      {WAVE_HEIGHTS.map((h, i) => (
        <rect key={i} x={i * 2.5} y={(22 - h) / 2} width={1.5} height={h} rx={1} fill="currentColor" />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════ */
export default function Message() {
  /* ── Loading / error simulation ── */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [allMsgs, setAllMsgs]     = useState<Record<number, ChatMessage[]>>({});
  const [activeId, setActiveId]   = useState<number | null>(null);
  const [search, setSearch]       = useState("");
  const [input, setInput]         = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setContacts(SEED_CONTACTS);
        setAllMsgs(SEED_MSGS);
        setActiveId(2);
        setLoading(false);
      } catch {
        setError("Failed to load messages. Please try again.");
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const activeMsgs    = activeId !== null ? (allMsgs[activeId] ?? []) : [];
  const activeContact = contacts.find(c => c.id === activeId) ?? null;

  const filteredContacts = search
    ? contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : contacts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeMsgs.length]);

  const selectContact = (id: number) => {
    setActiveId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowContacts(false); // close mobile panel
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || activeId === null) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAllMsgs(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { id: Date.now(), side: "sent", type: "text", text, time }],
    }));
    setContacts(prev => prev.map(c => c.id === activeId ? { ...c, preview: text, time } : c));
    setInput("");
  };

  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setContacts(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ── Page states ── */
  if (loading) {
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
          <PageError message={error} onRetry={() => window.location.reload()} />
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
                      c.id === activeId ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`size-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.avatarClass}`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm font-medium ${c.id === activeId ? "text-blue-700" : "text-gray-900"}`}>{c.name}</span>
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
                                <Waveform />
                                <span className="text-sm text-blue-600 font-medium">{msg.duration}</span>
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
                      onKeyDown={e => e.key === "Enter" && sendMessage()}
                      placeholder="Type your message here ..."
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      aria-label="Type a message"
                    />
                    <button
                      onClick={sendMessage}
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
