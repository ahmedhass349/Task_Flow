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
import { useChatbot } from "../hooks/useChatbot";

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

export default function Chatbot() {
  const { 
    conversationList, 
    activeConversation, 
    isLoading, 
    error, 
    refetch, 
    createConversation, 
    sendMessage, 
    deleteConversation, 
    setActiveConversationId, 
    activeConversationId 
  } = useChatbot();
  
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Convert backend conversations to UI format
  const uiConversations = useMemo(() => {
    return conversationList.map(conv => ({
      id: parseInt(conv.id),
      title: conv.title,
      updatedAt: conv.updatedAt,
      messages: [], // Will be loaded when conversation is selected
    }));
  }, [conversationList]);

  const uiMessages = useMemo(() => {
    if (!activeConversation) return [];
    return activeConversation.messages.map(msg => ({
      id: parseInt(msg.id),
      role: msg.role as MessageRole,
      text: msg.text,
      time: formatTime(msg.createdAt),
    }));
  }, [activeConversation]);

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && activeConversationId) {
      try {
        await sendMessage(activeConversationId, input.trim());
        setInput("");
        // Scroll to bottom
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const handleCreateConversation = async (title: string) => {
    try {
      await createConversation({ title });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages]);

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
                onClick={() => handleCreateConversation("New Chat")}
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
                  {uiConversations.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">
                      <MessageSquare className="size-8 text-gray-300 mx-auto mb-2" />
                      No conversations yet.
                    </div>
                  ) : (
                    uiConversations.map((conversation) => {
                      const isActive = parseInt(activeConversationId || "0") === conversation.id;
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => setActiveConversationId(conversation.id.toString())}
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
                                handleDeleteConversation(conversation.id.toString());
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
                    {uiMessages.map((message) => (
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
                        onClick={() => {
                      setInput(prompt);
                      setTimeout(() => {
                        const formEvent = new Event('submit', { cancelable: true }) as any;
                        handleSendMessage(formEvent);
                      }, 0);
                    }}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
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
