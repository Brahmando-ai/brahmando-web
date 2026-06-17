"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
} from "react";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";

/* ─── Config ────────────────────────────────────────────────────────── */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://chat.brahmando.com";
const API_KEY = "sk-bh-brahmando-2026";
const BOT_NAME = "Deepak";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */
let msgCounter = 0;
function uid() {
  return `msg-${Date.now()}-${++msgCounter}`;
}

/* ════════════════════════════════════════════════════════════════════ */
export function DeepakChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* auto-scroll on new content */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* focus input when panel opens */
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* ── Send message via SSE stream ─────────────────────────────────── */
  const sendMessage = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || streaming) return;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      const assistantMsg: Message = {
        id: uid(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setStreaming(true);

      try {
        const res = await fetch(`${API_BASE}/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
          },
          body: JSON.stringify({ message: text, session_id: sessionId }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No stream");

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            if (line.startsWith("event: metadata")) continue;
            if (line.startsWith("event: error")) continue;

            if (line.startsWith("data: ")) {
              const payload = line.slice(6);

              /* metadata JSON — skip display */
              if (payload.startsWith("{") && payload.includes('"tier"')) {
                continue;
              }

              if (payload === "[DONE]") break;

              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + payload,
                  };
                }
                return updated;
              });
            }
          }
        }
      } catch (err) {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: "Sorry, I couldn't connect right now. Please try again.",
            };
          }
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [input, streaming, sessionId]
  );

  /* ── Greeting on first open ──────────────────────────────────────── */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: "assistant",
          content:
            "Hey! I'm **Deepak**, the Brahmando AI assistant. Ask me anything about our AI agents, tools, and services. 🚀",
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, messages.length]);

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <>
      {/* ─── Chat Panel ─────────────────────────────────────────── */}
      {open && (
        <div
          id="deepak-chat-panel"
          className="deepak-panel fixed bottom-20 right-5 z-[190] flex flex-col
                     w-[calc(100vw-2.5rem)] max-w-[400px]
                     h-[min(520px,calc(100vh-7rem))]
                     rounded-2xl overflow-hidden animate-rise"
        >
          {/* Header */}
          <div className="deepak-header flex items-center gap-3 px-4 py-3 shrink-0">
            <div className="deepak-avatar flex h-8 w-8 items-center justify-center rounded-full">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-50">{BOT_NAME}</p>
              <p className="text-[11px] text-slate-400">Brahmando AI</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg
                         text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="deepak-messages flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-1 ${
                    msg.role === "user"
                      ? "bg-blue-500/20 text-blue-400"
                      : "deepak-avatar-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={12} />
                  ) : (
                    <Bot size={12} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`deepak-bubble max-w-[80%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "deepak-bubble-user"
                      : "deepak-bubble-assistant"
                  }`}
                >
                  {msg.content ? (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  ) : (
                    <span className="deepak-typing">
                      <span className="deepak-dot" />
                      <span className="deepak-dot" />
                      <span className="deepak-dot" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="deepak-input-bar flex items-center gap-2 px-3 py-2.5 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Deepak anything..."
              disabled={streaming}
              className="deepak-input flex-1 bg-transparent px-3 py-2 text-sm
                         text-slate-100 placeholder:text-slate-500
                         outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="deepak-send flex h-8 w-8 items-center justify-center
                         rounded-lg transition-all
                         disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {streaming ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      )}

      {/* ─── Floating Action Button ─────────────────────────────── */}
      <button
        id="deepak-chat-fab"
        onClick={() => setOpen((v) => !v)}
        className={`deepak-fab fixed bottom-4 right-5 z-[191]
                    flex h-12 w-12 items-center justify-center
                    rounded-full shadow-lg transition-all duration-300
                    hover:scale-110 active:scale-95
                    ${open ? "rotate-90 opacity-0 pointer-events-none" : "rotate-0 opacity-100"}`}
        aria-label="Open chat"
      >
        <MessageCircle size={22} className="text-white" />
      </button>
    </>
  );
}
