import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import {
  Bot,
  Send,
  Clock3,
  Plus,
  Trash2,
  Lightbulb,
  FileText,
  ListChecks,
  FolderKanban,
  MessageSquare,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { PageLoading, PageError } from "../Components/PageState";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: number;
  role: MessageRole;
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const starterPrompts = [
  "Plan my tasks for this week based on priority and due dates.",
  "Create a daily standup summary from my open tasks.",
  "Draft a message to the team about overdue items.",
  "Suggest a sprint goal using the active projects list.",
];

const seedConversations: Conversation[] = [
  {
    id: 1,
    title: "Sprint Planning Assistant",
    updatedAt: "Just now",
    messages: [
      {
        id: 11,
        role: "assistant",
        text: "Hello Demo User. I can help you plan tasks, draft updates, and summarize project progress. What should we work on first?",
        time: nowLabel(),
      },
    ],
  },
  {
    id: 2,
    title: "Weekly Status Draft",
    updatedAt: "2h ago",
    messages: [
      {
        id: 21,
        role: "assistant",
        text: "You can ask me to generate a status report grouped by project and priority.",
        time: "10:11 AM",
      },
      {
        id: 22,
        role: "user",
        text: "Give me a clean summary for leadership in 5 bullet points.",
        time: "10:12 AM",
      },
    ],
  },
];

export default function Chatbot() {
  /* ── Loading / error simulation ── */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number>(0);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setConversations(seedConversations);
        setActiveConversationId(1);
        setLoading(false);
      } catch {
        setError("Failed to load chatbot data. Please try again.");
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0],
    [conversations, activeConversationId],
  );

  const activeMessages = activeConversation?.messages ?? [];

  const createConversation = () => {
    const newConversation: Conversation = {
      id: Date.now(),
      title: "New Chat",
      updatedAt: "Just now",
      messages: [
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Ready when you are. Tell me your goal and I will help break it into actionable tasks.",
          time: nowLabel(),
        },
      ],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setInput("");
  };

  const removeConversation = (conversationId: number) => {
    setConversations((prev) => {
      const next = prev.filter((conversation) => conversation.id !== conversationId);
      if (!next.length) {
        const fallback: Conversation = {
          id: Date.now(),
          title: "New Chat",
          updatedAt: "Just now",
          messages: [
            {
              id: Date.now() + 1,
              role: "assistant",
              text: "I am here to help with your planning and workflow questions.",
              time: nowLabel(),
            },
          ],
        };
        setActiveConversationId(fallback.id);
        return [fallback];
      }

      if (activeConversationId === conversationId) {
        setActiveConversationId(next[0].id);
      }

      return next;
    });
  };

  const pushAssistantReply = (conversationId: number, sourceText: string) => {
    const response =
      "Here is a suggested next step: prioritize the highest-impact task first, define a clear owner, and set a concrete due date. If you want, I can convert this into a full task checklist.";

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              updatedAt: "Just now",
              messages: [
                ...conversation.messages,
                {
                  id: Date.now() + 2,
                  role: "assistant",
                  text: sourceText.toLowerCase().includes("summary")
                    ? "Summary ready. I grouped updates by status: completed, in progress, and blocked items. Want a short leadership version as well?"
                    : response,
                  time: nowLabel(),
                },
              ],
            }
          : conversation,
      ),
    );

    requestAnimationFrame(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const submitMessage = (event?: FormEvent, overrideText?: string) => {
    event?.preventDefault();
    const text = (overrideText ?? input).trim();
    if (!text || !activeConversation) {
      return;
    }

    const conversationId = activeConversation.id;

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title: conversation.title === "New Chat" ? text.slice(0, 32) : conversation.title,
              updatedAt: "Just now",
              messages: [
                ...conversation.messages,
                {
                  id: Date.now(),
                  role: "user",
                  text,
                  time: nowLabel(),
                },
              ],
            }
          : conversation,
      ),
    );

    setInput("");

    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => pushAssistantReply(conversationId, text), 320);
    });
  };

  const submitPrompt = (prompt: string) => {
    submitMessage(undefined, prompt);
  };

  /* ── Page states ── */
  if (loading) {
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
          <PageError message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chatbot</h1>
                <p className="text-gray-600 mt-1">AI workspace assistant for planning, summaries, and fast execution support</p>
              </div>
              <button
                onClick={createConversation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="Create new chat"
              >
                <Plus className="size-4" />
                New Chat
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
              <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden h-fit">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock3 className="size-4 text-blue-600" />
                    <h2 className="text-sm font-semibold">Recent Chats</h2>
                  </div>
                </div>

                <div className="max-h-[560px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">
                      <MessageSquare className="size-8 text-gray-300 mx-auto mb-2" />
                      No conversations yet.
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const isActive = activeConversationId === conversation.id;
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => setActiveConversationId(conversation.id)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                            isActive ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}>
                                {conversation.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{conversation.updatedAt}</p>
                            </div>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                removeConversation(conversation.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label={`Delete chat: ${conversation.title}`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>

              <section className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col min-h-[640px]">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">TaskFlow AI Assistant</p>
                      <p className="text-xs text-gray-500 truncate">Context-aware support for your workspace</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Productivity</span>
                    <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">Planning</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                  <div className="space-y-4">
                    {activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <p className={`mt-2 text-[11px] ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-gray-200 bg-white space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => submitPrompt(prompt)}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submitMessage} className="flex items-center gap-2">
                    <input
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Ask the assistant anything about your tasks, projects, or workflow..."
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label="Chat input"
                    />
                    <button
                      type="submit"
                      className="size-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                      aria-label="Send message"
                    >
                      <Send className="size-4" />
                    </button>
                  </form>
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="size-4" />
                  <h3 className="text-sm font-semibold">Smart Suggestions</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">Get recommended next actions based on deadlines and workload trends.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-violet-700">
                  <FileText className="size-4" />
                  <h3 className="text-sm font-semibold">Status Summaries</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">Generate concise project updates you can send to leadership or team channels.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ListChecks className="size-4" />
                  <h3 className="text-sm font-semibold">Action Plans</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">Convert high-level goals into a practical checklist with due dates and owners.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-900">
                <FolderKanban className="size-4 text-orange-600" />
                <h3 className="text-sm font-semibold">Best Results Tips</h3>
              </div>
              <ul className="mt-3 text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Include project names and deadlines in your prompt for better prioritization.</li>
                <li>Ask for outputs in a specific format, like checklist, summary, or message draft.</li>
                <li>Use follow-up prompts to refine scope, tone, and action ownership.</li>
              </ul>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
