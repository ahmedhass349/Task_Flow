import { useState, useRef, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import {
  Search, Star, MoreVertical, Smile, Mic, ThumbsUp,
  Send, Plus, ChevronDown, Clock,
} from "lucide-react";

/* ── Types ── */
interface Contact {
  id: number;
  name: string;
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
const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: "Jennifer Markus", preview: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:30 PM", unread: 0, starred: false },
  { id: 2, name: "Iva Ryan",         preview: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:30 PM", unread: 2, starred: false },
  { id: 3, name: "Jerry Helfer",     preview: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:30 PM", unread: 0, starred: false },
  { id: 4, name: "David Elson",      preview: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:30 PM", unread: 0, starred: false },
  { id: 5, name: "Mary Freund",      preview: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:30 PM", unread: 0, starred: false },
];

const INITIAL_MSGS: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, side: "received", type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:45 PM" },
    { id: 2, side: "sent",     type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:45 PM" },
  ],
  2: [
    { id: 1, side: "received", type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:45 PM" },
    { id: 2, side: "received", type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:45 PM" },
    { id: 3, side: "received", type: "voice", duration: "01:24", time: "04:45 PM" },
    { id: 4, side: "sent",     type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:50 PM" },
    { id: 5, side: "sent",     type: "text",  text: "Oh, hello! All perfectly.\nI will check it and get back to you soon", time: "04:55 PM" },
  ],
  3: [
    { id: 1, side: "received", type: "text", text: "Hey! Did you finish the Hi-FI wireframes for flora app design?", time: "05:10 PM" },
    { id: 2, side: "sent",     type: "text", text: "Almost done, will send it over tonight!", time: "05:15 PM" },
  ],
  4: [
    { id: 1, side: "received", type: "text", text: "Can you review the PR when you get a chance?", time: "03:00 PM" },
    { id: 2, side: "sent",     type: "text", text: "Sure, I'll take a look now.", time: "03:05 PM" },
  ],
  5: [
    { id: 1, side: "sent",     type: "text", text: "Team standup moved to 10 AM tomorrow.", time: "02:00 PM" },
    { id: 2, side: "received", type: "text", text: "Got it, thanks!", time: "02:05 PM" },
  ],
};

/* ── Waveform (SVG bars from Figma heights) ── */
const WAVE_HEIGHTS = [4,4,4,4,4,4,6,6,6,6,6,9,9,9,9,12,9,9,9,9,9,18,16,16,16,16,12,12,9,9,9,9,9,12,16,9,9,9,12,12,18,16,16,16,16,12,12,9,9,9,9,4,4,9,4,12,12,4,4,12,12,12,12,4,4,18,9,9,9,4,4,4,9,9,9,9,9,9,4,4,9,9,16,9,9,9,4,4,12,4,12,9,9,9,18,16,12,12,4,9,9,9,6,6,6,6,6,6,4,4,4,4];

function Waveform() {
  return (
    <svg width={WAVE_HEIGHTS.length * 2.5} height={22} viewBox={`0 0 ${WAVE_HEIGHTS.length * 2.5} 22`} style={{ display: "block" }}>
      {WAVE_HEIGHTS.map((h, i) => (
        <rect key={i} x={i * 2.5} y={(22 - h) / 2} width={1.5} height={h} rx={1} fill="#3D64FD" />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════ */
export default function Message() {
  const [contacts, setContacts]   = useState(INITIAL_CONTACTS);
  const [allMsgs, setAllMsgs]     = useState(INITIAL_MSGS);
  const [activeId, setActiveId]   = useState(2);
  const [search, setSearch]       = useState("");
  const [input, setInput]         = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeMsgs    = allMsgs[activeId] ?? [];
  const activeContact = contacts.find(c => c.id === activeId)!;

  const filteredContacts = search
    ? contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : contacts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeMsgs.length]);

  const selectContact = (id: number) => {
    setActiveId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* ── Page header ── */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="w-px h-4 bg-gray-300" />
            <p className="text-sm text-gray-500">
              <span className="text-blue-600 font-semibold">6</span>
              <span className="ml-1">Running Projects</span>
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="size-4" />
            Messages
          </button>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ──────────── Left: contact list ──────────── */}
          <div className="w-[360px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">

            {/* List header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900">All Messages</span>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronDown className="size-4 text-gray-500" />
                </button>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
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
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectContact(c.id)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${
                    c.id === activeId ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <img src="https://placehold.co/36x36" alt={c.name} className="size-9 rounded-xl flex-shrink-0 object-cover" />
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
                        >
                          <Star className={`size-3.5 ${c.starred ? "fill-blue-600 text-blue-600" : "text-gray-400"}`} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{c.preview}</p>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Today · {c.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ──────────── Right: chat area ──────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Chat header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://placehold.co/36x36" alt={activeContact?.name} className="size-9 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activeContact?.name}</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                  <Star className="size-4 text-blue-600 fill-blue-600" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                  <Search className="size-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
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

              <div className="flex flex-col gap-4">
                {activeMsgs.map(msg => (
                  <div key={msg.id} className={`flex ${msg.side === "sent" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex flex-col ${msg.side === "sent" ? "items-end" : "items-start"}`}>
                      {msg.type === "text" ? (
                        <div
                          className="px-5 py-3 text-sm leading-relaxed whitespace-pre-line max-w-xs"
                          style={{
                            background:              msg.side === "sent" ? "#3D64FD" : "#fff",
                            color:                   msg.side === "sent" ? "#fff" : "#1f2937",
                            borderTopLeftRadius:     20,
                            borderTopRightRadius:    20,
                            borderBottomLeftRadius:  msg.side === "sent" ? 20 : 4,
                            borderBottomRightRadius: msg.side === "received" ? 20 : 4,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          }}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        /* Voice note */
                        <div
                          className="flex items-center gap-3 px-5 py-3"
                          style={{
                            background: "#fff",
                            borderTopLeftRadius:  20,
                            borderTopRightRadius: 20,
                            borderBottomRightRadius: 20,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          }}
                        >
                          <button className="size-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors">
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
              <div ref={bottomRef} />
            </div>

            {/* ── Input bar ── */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0">
                <Smile className="size-5 text-blue-600" />
              </button>

              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message here ..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
                <button
                  onClick={sendMessage}
                  className="size-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors"
                >
                  <Send className="size-3.5 text-white" />
                </button>
              </div>

              <button className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0">
                <Mic className="size-5 text-blue-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors flex-shrink-0">
                <ThumbsUp className="size-5 text-blue-600" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
