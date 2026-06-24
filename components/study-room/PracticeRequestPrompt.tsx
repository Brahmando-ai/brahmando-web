"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  type PracticeRequest,
  type PracticeSubject,
  subjectLabel,
} from "@/lib/study-room/practiceRequest";

const SUBJECTS: { id: PracticeSubject; label: string; icon: string }[] = [
  { id: "science", label: "Science", icon: "🧪" },
  { id: "math", label: "Mathematics", icon: "📐" },
];

type Props = {
  variant: "landing" | "room";
  chapterTitle?: string;
  chapterId?: string;
  initialSubject?: PracticeSubject;
  initialText?: string;
  onSubmit: (request: PracticeRequest) => void;
};

export function PracticeRequestPrompt({
  variant,
  chapterTitle,
  chapterId,
  initialSubject = "science",
  initialText = "",
  onSubmit,
}: Props) {
  const [subject, setSubject] = useState<PracticeSubject>(initialSubject);
  const [text, setText] = useState(initialText);

  const scoped = variant === "room";
  const placeholder = scoped
    ? chapterTitle
      ? `What do you want to practice in ${chapterTitle}? Official + AI mix OK.`
      : "Describe what you want to practice in this chapter…"
    : "e.g. 5 short questions on Ohm's law and solenoids — official + AI mix is fine";

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit({
      subject,
      text: trimmed,
      chapterId: scoped ? chapterId : undefined,
      fromLanding: variant === "landing",
    });
    if (variant === "landing") {
      setText("");
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${
        scoped
          ? "border-violet-300/25 bg-violet-400/5"
          : "border-cyan-300/25 bg-cyan-400/5"
      }`}
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        {scoped ? "Practice request" : "What would you like to practice?"}
      </p>

      {!scoped && (
        <div className="mb-3 flex gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSubject(s.id)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                subject === s.id
                  ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                  : "border-slate-600/40 bg-slate-800/40 text-slate-300 hover:border-slate-500/50"
              }`}
            >
              <span className="mr-1">{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      )}

      {scoped && (
        <p className="mb-2 text-xs text-slate-400">
          {subjectLabel(subject)} · {chapterTitle ?? "Chapter"}
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={scoped ? 3 : 2}
        className="w-full resize-none rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] leading-relaxed text-slate-500">
          {scoped
            ? "Scoped to this chapter. Official CBSE-X + AI mix when Abhyas is wired."
            : "Pick a subject, describe your request, then open the study room."}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="btn-primary shrink-0 px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {scoped ? "Request practice set" : "Open Study Room"}
        </button>
      </div>
    </div>
  );
}
