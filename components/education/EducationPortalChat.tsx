"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  type EducationActor,
  formatEducationResponse,
  postActorChat,
} from "@/lib/education-api";

const ACTORS: { id: EducationActor; label: string; icon: string }[] = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "teacher", label: "Teacher", icon: "📚" },
  { id: "school", label: "School", icon: "🏫" },
  { id: "coaching_center", label: "Coaching", icon: "📝" },
];

const SAMPLES: Record<EducationActor, string[]> = {
  student: [
    "Which History chapters had the most CBSE questions in the last 5 years?",
    "Generate 5 MCQs on photosynthesis for Class 10 CBSE.",
    "What documents do I need before FAFSA?",
  ],
  teacher: [
    "Set up a dummy NEET Mathematics questionnaire with 15 MCQs.",
    "Create a 45-min Grade 8 lesson on ecosystems with SWAN activities.",
  ],
  school: [
    "Allocate hours for Class 11 Physics chapter Sound — 4 weeks, 5 periods/week.",
    "Plan CBSE Class 10 Science term schedule with revision blocks.",
  ],
  coaching_center: [
    "Create a 60-minute mock test for Class 7 CBSE Science.",
    "Design a diagnostic paper for Class 12 Physics Electrostatics.",
  ],
};

type ChatMsg = { role: "user" | "bot"; text: string };

type Props = {
  mode?: "widget" | "page";
};

function ChatPanel({
  actor,
  setActor,
  messages,
  typing,
  input,
  setInput,
  send,
  scrollRef,
  className,
}: {
  actor: EducationActor;
  setActor: (a: EducationActor) => void;
  messages: ChatMsg[];
  typing: boolean;
  input: string;
  setInput: (v: string) => void;
  send: (text?: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="bg-cyan-600 px-4 py-3.5 text-sm font-semibold text-white">
        Education Portal · ManjuLab CSR
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-teal-100 bg-teal-50/80 p-2">
        {ACTORS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActor(a.id)}
            className={`min-w-[4.5rem] flex-1 rounded-lg border px-1 py-1.5 text-[11px] ${
              actor === a.id
                ? "border-cyan-600 bg-cyan-600 text-white"
                : "border-teal-200 bg-white text-slate-700 hover:border-teal-300"
            }`}
          >
            {a.icon} {a.label}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-[13px] leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-cyan-600 text-white"
                : "border border-slate-200 bg-white text-slate-800"
            }`}
          >
            {m.text}
          </div>
        ))}
        {typing && <p className="text-xs text-slate-500">Thinking…</p>}
      </div>

      <div className="flex flex-wrap gap-1.5 px-3 pb-2">
        {SAMPLES[actor].map((q) => (
          <button
            key={q}
            type="button"
            title={q}
            onClick={() => send(q)}
            className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-cyan-400 hover:text-cyan-700"
          >
            {q.length > 48 ? `${q.slice(0, 45)}…` : q}
          </button>
        ))}
      </div>

      <div className="flex gap-2 border-t border-slate-200 bg-white p-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask as student, teacher, school…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={typing}
          className="rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export function EducationPortalChat({ mode = "widget" }: Props) {
  const [open, setOpen] = useState(mode === "page");
  const [actor, setActor] = useState<EducationActor>("student");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const greet = useCallback(() => {
    setMessages([
      {
        role: "bot",
        text: "Hi! I am the ManjuLab CSR Education Portal. Pick your role above and ask about CBSE exams, FAFSA, lesson plans, or mock tests.",
      },
    ]);
  }, []);

  useEffect(() => {
    if (mode === "page" && messages.length === 0) greet();
  }, [mode, messages.length, greet]);

  function toggleOpen() {
    setOpen((v) => {
      if (!v && messages.length === 0) greet();
      return !v;
    });
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setTyping(true);
    try {
      const data = await postActorChat(actor, msg, {});
      setMessages((m) => [...m, { role: "bot", text: formatEducationResponse(data) }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Sorry, could not reach Education Portal. ${e instanceof Error ? e.message : "Network error"}`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  if (mode === "page") {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">CSR · Education Portal</p>
          <h1 className="section-title mt-2">Chat</h1>
          <p className="section-subtitle max-w-2xl">
            Role-based coaching for students, teachers, schools, and coaching centers — FAFSA, CBSE exams, lesson
            plans, and mock tests.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/education/explore" className="btn-secondary inline-flex items-center gap-2 text-sm">
              Explore knowledge base
              <ArrowRight size={14} />
            </Link>
            <Link href="/education" className="text-sm text-slate-400 hover:text-slate-200">
              Module overview
            </Link>
          </div>
        </div>
        <div className="flex h-[min(680px,calc(100vh-12rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <ChatPanel
            actor={actor}
            setActor={setActor}
            messages={messages}
            typing={typing}
            input={input}
            setInput={setInput}
            send={send}
            scrollRef={scrollRef}
            className="flex h-full flex-col"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Open Education Portal chat"
        className="fixed bottom-5 left-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-2xl text-white shadow-lg shadow-cyan-900/30 transition hover:bg-cyan-500"
      >
        🎓
      </button>

      {open && (
        <div className="fixed bottom-[5.5rem] left-5 z-[9999] flex h-[520px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <ChatPanel
            actor={actor}
            setActor={setActor}
            messages={messages}
            typing={typing}
            input={input}
            setInput={setInput}
            send={send}
            scrollRef={scrollRef}
            className="flex h-full flex-col"
          />
        </div>
      )}
    </>
  );
}
