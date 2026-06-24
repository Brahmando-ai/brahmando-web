"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SAAS_ACCOUNT_URL, SAAS_SUBSCRIBE_URL } from "@/lib/education/saasUrls";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  MessageSquare,
  Play,
  Sparkles,
  UserRound,
} from "lucide-react";
import { StudentAlertBanner } from "@/components/study-room/StudentAlertBanner";
import { ChapterStatusBadge, MasteryBar } from "@/components/study-room/ChapterStatusBadge";
import { StudyTogetherPanel, dispatchInviteResponse } from "@/components/study-room/StudyTogetherPanel";
import { PracticeRequestPrompt } from "@/components/study-room/PracticeRequestPrompt";
import type { StudyPeer } from "@/components/study-room/StudyTogetherPanel";
import { StudyRoomInviteCard } from "@/components/study-room/StudyRoomInviteCard";
import { SkuSwitcher } from "@/components/study-room/SkuSwitcher";
import type { IncomingInvite } from "@/lib/study-room/mockPresence";
import type { QuickReply } from "@/lib/study-room/mockPresence";
import {
  getAtRiskChapters,
  getMasteryByChapterId,
} from "@/lib/study-room/mockProgressData";
import {
  loadPracticeRequest,
  savePracticeRequest,
  subjectLabel as practiceSubjectLabel,
  type PracticeRequest,
  type PracticeSubject,
} from "@/lib/study-room/practiceRequest";
import { useSearchParams } from "next/navigation";
import { useStudyRoomSku } from "@/lib/study-room/useStudyRoomSku";

import type { QuizQuestion } from "@/lib/study-room/types";

type Mode = "learn" | "quiz" | "board" | "teacher";

type ChatMessage = {
  id: string;
  role: "student" | "tutor" | "teacher" | "peer";
  text: string;
  authorName?: string;
};

function tutorWelcome(subject: string, chapter: string, boardMockLabel: string): string {
  return `Welcome to your study room. You're on **${chapter}** (${subject}). Ask me to explain a concept, give an example, or start a quick check. When you're ready, use **Chapter quiz (5)** or **${boardMockLabel}** on the right.`;
}

type StudyRoomMockProps = {
  skuId?: string | null;
};

export function StudyRoomMock({ skuId: skuProp }: StudyRoomMockProps) {
  const searchParams = useSearchParams();
  const skuRaw = skuProp ?? searchParams.get("sku");
  const { skuId, instance, subjects, chaptersBySubject, loading, error, fetchQuiz } = useStudyRoomSku(skuRaw);
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [mode, setMode] = useState<Mode>("learn");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [incomingInvite, setIncomingInvite] = useState<IncomingInvite | null>(null);
  const [dndOn, setDndOn] = useState(false);
  const [practiceRequestText, setPracticeRequestText] = useState("");
  const peerSeeded = useRef(false);
  const landingRequestApplied = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (loading || subjects.length === 0 || initialized.current) return;
    initialized.current = true;
    const firstSubject = subjects[0]!;
    const firstChapter = chaptersBySubject[firstSubject.id]?.[0];
    setSubjectId(firstSubject.id);
    if (firstChapter) {
      setChapterId(firstChapter.id);
      setMessages([
        {
          id: "welcome",
          role: "tutor",
          text: tutorWelcome(firstSubject.label, firstChapter.title, instance.boardMockLabel),
        },
      ]);
    }
  }, [loading, subjects, chaptersBySubject, instance.boardMockLabel]);

  useEffect(() => {
    initialized.current = false;
  }, [skuId]);

  useEffect(() => {
    if (!subjectId || !chapterId) return;
    let cancelled = false;
    setQuizLoading(true);
    fetchQuiz(subjectId, chapterId)
      .then((items) => {
        if (!cancelled) setQuizQuestions(items);
      })
      .finally(() => {
        if (!cancelled) setQuizLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subjectId, chapterId, fetchQuiz]);

  useEffect(() => {
    const stored = loadPracticeRequest();
    if (!stored || landingRequestApplied.current || loading) return;
    landingRequestApplied.current = true;
    const subj = stored.subject as PracticeSubject;
    if (chaptersBySubject[subj]?.length) {
      setSubjectId(subj);
    }
    if (stored.chapterId) {
      setChapterId(stored.chapterId);
    } else {
      const first = chaptersBySubject[subj]?.[0];
      if (first) setChapterId(first.id);
    }
    setPracticeRequestText(stored.text);
    const ch = chaptersBySubject[subj]?.find((c) => c.id === (stored.chapterId ?? chaptersBySubject[subj]?.[0]?.id));
    setMessages([
      {
        id: `welcome-request-${Date.now()}`,
        role: "tutor",
        text: stored.fromLanding
          ? `Got your request for **${practiceSubjectLabel(stored.subject)}**: "${stored.text}". Pick a chapter on the left or refine below.`
          : tutorWelcome(practiceSubjectLabel(stored.subject), ch?.title ?? "your chapter", instance.boardMockLabel),
      },
    ]);
  }, [loading, chaptersBySubject, instance.boardMockLabel]);

  useEffect(() => {
    if (peerSeeded.current) return;
    peerSeeded.current = true;
    const t = setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: "peer-arjun-intro",
          role: "peer",
          authorName: "Arjun M.",
          text: "Hey — I'm on Light too. Want to compare notes after the quiz?",
        },
      ]);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const chapters = chaptersBySubject[subjectId] ?? [];
  const chapter = chapters.find((c) => c.id === chapterId) ?? chapters[0];
  const subjectLabel = subjects.find((s) => s.id === subjectId)?.label ?? subjectId;

  const resetQuiz = useCallback(() => {
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizDone(false);
    setSelectedOption(null);
  }, []);

  const selectChapter = (id: string) => {
    setChapterId(id);
    setMode("learn");
    resetQuiz();
    const ch = chapters.find((c) => c.id === id);
    if (ch) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "tutor",
          text: tutorWelcome(subjectLabel, ch.title, instance.boardMockLabel),
        },
      ]);
    }
  };

  const selectSubject = (id: string) => {
    setSubjectId(id);
    const first = chaptersBySubject[id]?.[0];
    if (!first) return;
    setChapterId(first.id);
    setMode("learn");
    resetQuiz();
    const subj = subjects.find((s) => s.id === id)?.label ?? id;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "tutor",
        text: tutorWelcome(subj, first.title, instance.boardMockLabel),
      },
    ]);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const studentMsg: ChatMessage = { id: `s-${Date.now()}`, role: "student", text };
    setMessages((m) => [...m, studentMsg]);
    setInput("");
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `t-${Date.now()}`,
        role: "tutor",
        text: mockTutorReply(text, chapter.title, skuId),
      };
      setMessages((m) => [...m, reply]);
    }, 600);
  };

  const startQuiz = () => {
    resetQuiz();
    setMode("quiz");
  };

  const practiceChapter = useCallback(
    (targetId: string) => {
      const mastery = getMasteryByChapterId(targetId);
      if (!mastery) return;
      setSubjectId(mastery.subject);
      setChapterId(targetId);
      resetQuiz();
      setMessages([
        {
          id: `alert-practice-${Date.now()}`,
          role: "tutor",
          text: `Let's focus on **${mastery.title}**. Your mastery is ${mastery.masteryPct}% — starting the 5-question drill.`,
        },
      ]);
      setMode("quiz");
    },
    [resetQuiz]
  );

  const handlePeerMessage = useCallback((peer: StudyPeer, text: string) => {
    if (dndOn) return;
    setMessages((m) => [
      ...m,
      {
        id: `peer-${Date.now()}`,
        role: "peer",
        authorName: peer.name,
        text,
      },
    ]);
  }, [dndOn]);

  const handleStudentQuickReply = useCallback((text: string) => {
    setMessages((m) => [
      ...m,
      { id: `s-${Date.now()}`, role: "student", text },
    ]);
  }, []);

  const handleInviteJoin = useCallback((reply: QuickReply) => {
    dispatchInviteResponse("join", reply);
    setIncomingInvite(null);
  }, []);

  const handleInviteDecline = useCallback((reply: QuickReply) => {
    dispatchInviteResponse("decline", reply);
    setIncomingInvite(null);
  }, []);

  const handleInviteIgnore = useCallback(() => {
    dispatchInviteResponse("ignore");
    setIncomingInvite(null);
  }, []);

  const handlePracticeRequest = useCallback(
    (request: PracticeRequest) => {
      savePracticeRequest({ ...request, chapterId, fromLanding: false });
      setPracticeRequestText(request.text);
      setMessages((m) => [
        ...m,
        {
          id: `practice-req-${Date.now()}`,
          role: "student",
          text: request.text,
        },
        {
          id: `practice-req-reply-${Date.now()}`,
          role: "tutor",
          text: `Noted for **${chapter.title}** (${subjectLabel}). In production this calls \`POST /v1/session/start\` with \`content\`, \`chapter: "${chapterId}"\`, and \`scope: "anyo"\` for official + AI mix. Use **Chapter quiz (5)** for the mock drill now.`,
        },
      ]);
      setMode("learn");
    },
    [chapter.title, chapterId, subjectLabel]
  );

  const startBoardMock = () => {
    setMode("board");
    setMessages((m) => [
      ...m,
      {
        id: `board-${Date.now()}`,
        role: "tutor",
        text: `Starting **CBSE Class 10 ${subjectLabel}** board-style mock. Full paper: 40 MCQ + structured questions (mock). Timer optional in next iteration. Tap below when ready to begin the simulated paper.`,
      },
    ]);
  };

  const askTeacher = () => {
    setMode("teacher");
    setMessages((m) => [
      ...m,
      {
        id: `escalate-${Date.now()}`,
        role: "student",
        text: "I'd like help from a teacher on this chapter.",
      },
      {
        id: `teacher-${Date.now()}`,
        role: "teacher",
        text: `Hello! I'm reviewing your session on "${chapter.title}". Share the exact step where you're stuck — or your quiz score — and I'll guide you without giving away the full answer immediately.`,
      },
    ]);
  };

  const pickQuizOption = (idx: number) => {
    if (quizDone || selectedOption !== null) return;
    setSelectedOption(idx);
  };

  const nextQuizQuestion = () => {
    if (selectedOption === null) return;
    const nextAnswers = [...quizAnswers, selectedOption];
    setQuizAnswers(nextAnswers);
    setSelectedOption(null);
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
    }
  };

  const quizScore = quizAnswers.reduce(
    (acc, ans, i) => acc + (ans === quizQuestions[i]?.correctIndex ? 1 : 0),
    0
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400 sm:px-6">
        Loading {instance.displayName} study room…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-red-300 sm:px-6">
        Could not load curriculum: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SkuSwitcher activeSku={skuId} />
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Study Room · {instance.displayName}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-50 md:text-4xl">My Study Room</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">{instance.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <a
            href={SAAS_SUBSCRIBE_URL}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
          >
            Subscribe · {instance.displayName}
          </a>
          <a
            href={SAAS_ACCOUNT_URL}
            className="flex items-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-3 transition hover:border-cyan-300/40"
          >
            <GraduationCap className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-xs text-slate-400">Subscribed SKU</p>
              <p className="font-semibold text-cyan-100">{instance.id}</p>
            </div>
          </a>
        </div>
      </div>

      {skuId === "cbse10-core" && (
        <StudentAlertBanner chapters={getAtRiskChapters()} onPractice={practiceChapter} />
      )}

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Left: Subject + chapters */}
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-4 backdrop-blur-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSubject(s.id)}
                  className={`flex-1 min-w-[7rem] rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    subjectId === s.id
                      ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                      : "border-slate-600/40 bg-slate-800/40 text-slate-300 hover:border-slate-500/50"
                  }`}
                >
                  <span className="mr-1">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Chapters</p>
            <ul className="max-h-[360px] space-y-1 overflow-y-auto pr-1">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <button
                    type="button"
                    onClick={() => selectChapter(ch.id)}
                    className={`flex w-full flex-col gap-1.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                      chapterId === ch.id
                        ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/40"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                      <span className="flex-1 leading-snug">{ch.title}</span>
                      <span className="text-[10px] font-medium text-slate-400">{ch.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2 pl-6">
                      <div className="min-w-0 flex-1">
                        <MasteryBar pct={ch.progress} size="sm" />
                      </div>
                      {ch.status && <ChapterStatusBadge status={ch.status} />}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <PracticeRequestPrompt
                key={`${subjectId}-${chapterId}-${practiceRequestText.slice(0, 24)}`}
                variant="room"
                chapterTitle={chapter?.title ?? ""}
                chapterId={chapterId}
                initialSubject={(subjectId === "math" ? "math" : "science") as PracticeSubject}
                initialText={practiceRequestText}
                onSubmit={handlePracticeRequest}
              />
            </div>
          </div>
        </aside>

        {/* Center: Chat / Quiz / Board */}
        <main className="lg:col-span-6">
          <div className="flex h-[min(72vh,640px)] flex-col rounded-2xl border border-slate-300/20 bg-slate-900/55 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-400">{subjectLabel}</p>
                <p className="font-semibold text-slate-100">{chapter?.title ?? "Select a chapter"}</p>
              </div>
              <div className="flex items-center gap-2">
                {dndOn && (
                  <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-200">
                    DND
                  </span>
                )}
                <span className="tag">
                  {mode === "learn" && "Learn"}
                  {mode === "quiz" && "Chapter quiz"}
                  {mode === "board" && instance.boardMockLabel}
                  {mode === "teacher" && "Teacher"}
                </span>
              </div>
            </div>

            {incomingInvite && !dndOn && (mode === "learn" || mode === "teacher") && (
              <div className="border-b border-violet-500/20 bg-violet-500/5 p-4">
                <StudyRoomInviteCard
                  invite={incomingInvite}
                  onJoin={handleInviteJoin}
                  onDecline={handleInviteDecline}
                  onIgnore={handleInviteIgnore}
                />
              </div>
            )}

            {mode === "quiz" && !quizDone && (
              <div className="flex flex-1 flex-col p-4">
                {quizLoading || quizQuestions.length === 0 ? (
                  <p className="text-sm text-slate-400">Loading official questions…</p>
                ) : (
                  <>
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    Question {quizIndex + 1} of {quizQuestions.length}
                  </span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="mb-4 text-lg font-medium leading-snug text-slate-100">
                  {quizQuestions[quizIndex]?.prompt}
                </p>
                <ul className="space-y-2">
                  {quizQuestions[quizIndex]?.options.map((opt, idx) => {
                    const selected = selectedOption === idx;
                    const showResult = selectedOption !== null;
                    const correct = idx === quizQuestions[quizIndex]?.correctIndex;
                    return (
                      <li key={opt}>
                        <button
                          type="button"
                          onClick={() => pickQuizOption(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                            showResult && correct
                              ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100"
                              : showResult && selected && !correct
                                ? "border-red-400/40 bg-red-400/10 text-red-100"
                                : selected
                                  ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100"
                                  : "border-slate-600/40 bg-slate-800/40 text-slate-200 hover:border-slate-500/60"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextQuizQuestion}
                    disabled={selectedOption === null}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {quizIndex + 1 >= quizQuestions.length ? "See results" : "Next"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                  </>
                )}
              </div>
            )}

            {mode === "quiz" && quizDone && (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-400" />
                <h3 className="text-xl font-semibold text-slate-50">Chapter quiz complete</h3>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {quizScore} / {quizQuestions.length}
                </p>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Review mistakes in Light &amp; refraction formulas before your board mock.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={startQuiz} className="btn-secondary">
                    Retry quiz
                  </button>
                  <button type="button" onClick={askTeacher} className="btn-primary">
                    Ask Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("learn");
                      resetQuiz();
                    }}
                    className="btn-secondary"
                  >
                    Back to learn
                  </button>
                </div>
              </div>
            )}

            {mode === "board" && (
              <div className="flex flex-1 flex-col p-6">
                <div className="rounded-2xl border border-amber-300/25 bg-amber-400/5 p-5">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">CBSE Class 10 {subjectLabel} — Board simulation</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    <li>· Section A: 20 MCQ (1 mark each)</li>
                    <li>· Section B: 6 short answer (2 marks)</li>
                    <li>· Section C: 4 long answer (3 marks)</li>
                    <li>· Section D: 2 case-based (4 marks)</li>
                  </ul>
                  <p className="mt-4 text-xs text-slate-500">
                    First-pass mock — full timed paper UI in next iteration. Backend:{" "}
                    <code className="text-cyan-300/80">POST /practice/start?mode=board_mock</code>
                  </p>
                  <button
                    type="button"
                    className="btn-primary mt-5"
                    onClick={() => {
                      setMessages((m) => [
                        ...m,
                        {
                          id: `board-start-${Date.now()}`,
                          role: "tutor",
                          text: "Board mock session registered. In production this opens the full paper flow with timer and section navigation.",
                        },
                      ]);
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Begin mock paper
                  </button>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto space-y-3">
                  {messages.slice(-4).map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                </div>
              </div>
            )}

            {(mode === "learn" || mode === "teacher") && (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                </div>
                <div className="border-t border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Ask about this chapter…"
                      className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                    <button type="button" onClick={sendMessage} className="btn-primary shrink-0 px-5">
                      Send
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Explain key idea", "Give an example", "Common exam traps"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setInput(chip);
                        }}
                        className="rounded-full border border-slate-600/40 px-3 py-1 text-xs text-slate-400 hover:border-cyan-400/40 hover:text-cyan-200"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* Right: Session tools */}
        <aside className="lg:col-span-3">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-4 backdrop-blur-xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5" /> Session tools
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("learn");
                    resetQuiz();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    mode === "learn"
                      ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                      : "border-slate-600/40 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  Learn with tutor
                </button>
                <button
                  type="button"
                  onClick={startQuiz}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    mode === "quiz"
                      ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                      : "border-slate-600/40 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Chapter quiz (5)
                </button>
                <button
                  type="button"
                  onClick={startBoardMock}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    mode === "board"
                      ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
                      : "border-slate-600/40 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <Clock className="h-4 w-4 shrink-0" />
                  {instance.boardMockLabel}
                </button>
                <button
                  type="button"
                  onClick={askTeacher}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    mode === "teacher"
                      ? "border-orange-300/40 bg-orange-400/10 text-orange-100"
                      : "border-slate-600/40 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  Ask Teacher
                </button>
              </div>
            </div>

            <StudyTogetherPanel
              onPeerMessage={handlePeerMessage}
              onStudentMessage={handleStudentQuickReply}
              onIncomingInvite={setIncomingInvite}
              onDndChange={setDndOn}
            />

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-4 text-xs">
              <p className="font-medium text-emerald-200">{instance.displayName}</p>
              <p className="mt-1 leading-relaxed text-slate-400">
                Mock exams, practice tests, and teacher review require an active subscription.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={SAAS_SUBSCRIBE_URL} className="btn-primary px-3 py-1.5 text-xs">
                  Subscribe
                </a>
                <a href={SAAS_ACCOUNT_URL} className="btn-secondary px-3 py-1.5 text-xs">
                  My account
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isStudent = message.role === "student";
  const isTeacher = message.role === "teacher";
  const isPeer = message.role === "peer";

  return (
    <div className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isStudent
            ? "bg-cyan-500/20 text-cyan-50 ring-1 ring-cyan-400/30"
            : isPeer
              ? "bg-violet-500/15 text-violet-50 ring-1 ring-violet-400/25"
            : isTeacher
              ? "bg-amber-500/15 text-amber-50 ring-1 ring-amber-400/25"
              : "bg-slate-800/80 text-slate-200 ring-1 ring-slate-600/40"
        }`}
      >
        {isPeer && message.authorName && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-violet-300/90">
            {message.authorName}
          </span>
        )}
        {isTeacher && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
            Teacher
          </span>
        )}
        {!isStudent && !isTeacher && !isPeer && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Tutor
          </span>
        )}
        <span className="whitespace-pre-wrap">{message.text.replace(/\*\*(.*?)\*\*/g, "$1")}</span>
      </div>
    </div>
  );
}

function mockTutorReply(input: string, chapter: string, skuId: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("example")) {
    return `Here's a worked example from "${chapter}": follow the official method — identify the skill, apply the rule, then check your answer against the passage or problem.`;
  }
  if (lower.includes("explain") || lower.includes("key")) {
    return `Core idea for "${chapter}": focus on the skills your exam board marks every year, then drill with the 5-question set on the right.`;
  }
  if (lower.includes("trap") || lower.includes("exam")) {
    return `Common traps: rushing past the passage, ignoring transition words, and skipping line-reference questions. For section mocks, pace yourself per passage block.`;
  }
  const kb = skuId === "sat-act" ? "sat_act_kb" : "cbse10_kb";
  return `Good question on "${chapter}". In the live system I'll pull this from your SKU's Qdrant collection (${kb}) via RAG. Try **Chapter quiz (5)** to check recall.`;
}
