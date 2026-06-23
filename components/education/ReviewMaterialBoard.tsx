"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Pause,
  Play,
  Upload,
} from "lucide-react";
import { REVIEW_CHAPTERS, type ReviewChapter } from "@/lib/education/reviewMaterial/chapters";
import { fetchChapterContent } from "@/lib/education/reviewMaterial/loadContent";
import type { ChapterReviewContent, ChapterSection, ReviewNote, ReviewNoteCategory, ReviewNoteStatus } from "@/lib/education/reviewMaterial/types";
import {
  addNote,
  exportNotesJson,
  getReviewerName,
  importNotesJson,
  listNotes,
  setReviewerName,
  updateNoteStatus,
} from "@/lib/education/reviewNotesStore";

type BoardTab = "review" | "observations";

const CATEGORIES: { value: ReviewNoteCategory; label: string }[] = [
  { value: "accuracy", label: "Accuracy" },
  { value: "clarity", label: "Clarity" },
  { value: "pedagogy", label: "Pedagogy" },
  { value: "visual", label: "Visual / diagram" },
  { value: "audio", label: "Audio / narration" },
  { value: "other", label: "Other" },
];

const STATUSES: { value: ReviewNoteStatus; label: string; className: string }[] = [
  { value: "open", label: "Open", className: "bg-amber-500/20 text-amber-100 border-amber-400/40" },
  { value: "accepted", label: "Accepted", className: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40" },
  { value: "rejected", label: "Rejected", className: "bg-rose-500/20 text-rose-100 border-rose-400/40" },
  { value: "deferred", label: "Deferred", className: "bg-slate-500/20 text-slate-200 border-slate-400/40" },
];

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function SectionBody({ body }: { body: string }) {
  if (!body.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-slate-600/50 bg-slate-950/30 px-4 py-8 text-center text-sm text-slate-500">
        No crawled content in this section yet. Run the Education crawler{" "}
        <code className="text-xs text-slate-400">build</code> step after <code className="text-xs text-slate-400">collect</code>.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-200">
      {body.split("\n").map((line, i) => (
        <p key={i}>{renderInline(line)}</p>
      ))}
    </div>
  );
}

function CrawlStatusBar({ content }: { content: ChapterReviewContent | null }) {
  const meta = content?.crawlMeta;
  if (!meta) {
    return (
      <div className="mb-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        No review JSON for this chapter yet. The internet crawler collects sources on the GPU server; run{" "}
        <code className="text-xs">build</code> to publish <code className="text-xs">review-material/*.json</code> here.
      </div>
    );
  }
  return (
    <div className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/90">
      Crawler data loaded — {meta.articleCount} article(s), {meta.videoCount} video link(s)
      {meta.builtAt ? ` · built ${new Date(meta.builtAt).toLocaleString()}` : ""}.
    </div>
  );
}

export function ReviewMaterialBoard() {
  const [tab, setTab] = useState<BoardTab>("review");
  const [subjectFilter, setSubjectFilter] = useState<"all" | "science" | "math">("all");
  const [chapterId, setChapterId] = useState(REVIEW_CHAPTERS[0]?.id ?? "");
  const [sectionId, setSectionId] = useState("");
  const [content, setContent] = useState<ChapterReviewContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewer, setReviewer] = useState("");
  const [category, setCategory] = useState<ReviewNoteCategory>("clarity");
  const [observation, setObservation] = useState("");
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [allNotes, setAllNotes] = useState<ReviewNote[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const chapters = useMemo(
    () => REVIEW_CHAPTERS.filter((c) => subjectFilter === "all" || c.subject === subjectFilter),
    [subjectFilter]
  );

  const chapter = useMemo(() => REVIEW_CHAPTERS.find((c) => c.id === chapterId), [chapterId]);

  const refreshNotes = useCallback(() => {
    setNotes(listNotes(chapterId));
    setAllNotes(listNotes());
  }, [chapterId]);

  useEffect(() => {
    setReviewer(getReviewerName());
    refreshNotes();
  }, [refreshNotes]);

  useEffect(() => {
    if (!chapter) return;
    setLoading(true);
    fetchChapterContent(chapter).then((data) => {
      setContent(data);
      setSectionId(data.sections[0]?.id ?? "");
      setLoading(false);
    });
  }, [chapter]);

  const activeSection: ChapterSection | undefined = content?.sections.find((s) => s.id === sectionId);

  const chapterIndex = chapters.findIndex((c) => c.id === chapterId);

  function goChapter(delta: number) {
    const next = chapters[chapterIndex + delta];
    if (next) setChapterId(next.id);
  }

  function saveReviewer() {
    setReviewerName(reviewer);
  }

  function submitNote() {
    if (!observation.trim() || !reviewer.trim()) return;
    setReviewerName(reviewer);
    addNote({
      chapterId,
      sectionId: sectionId || undefined,
      reviewer: reviewer.trim(),
      category,
      observation: observation.trim(),
    });
    setObservation("");
    refreshNotes();
  }

  function stopAudio() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function playAudio() {
    if (!content?.audioScript || typeof window === "undefined" || !window.speechSynthesis) return;
    stopAudio();
    const utterance = new SpeechSynthesisUtterance(content.audioScript);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      importNotesJson(String(reader.result));
      refreshNotes();
    };
    reader.readAsText(file);
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Content QA</p>
          <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">Review Material Board</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            CBSE Class 10 Science &amp; Mathematics — educator review board. Chapter content is populated by the{" "}
            <strong className="font-medium text-cyan-200/90">Education internet crawler</strong> (web pages, videos,
            blogs) via <code className="text-xs text-slate-500">collect</code> then{" "}
            <code className="text-xs text-slate-500">build</code>. Add observations and triage feedback below.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("review")}
            className={`rounded-full border px-4 py-2 text-sm ${tab === "review" ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100" : "border-slate-600/40 text-slate-400"}`}
          >
            <BookOpen className="mr-2 inline h-4 w-4" />
            Chapter review
          </button>
          <button
            type="button"
            onClick={() => setTab("observations")}
            className={`rounded-full border px-4 py-2 text-sm ${tab === "observations" ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100" : "border-slate-600/40 text-slate-400"}`}
          >
            <ClipboardList className="mr-2 inline h-4 w-4" />
            All observations ({allNotes.length})
          </button>
        </div>
      </div>

      {tab === "review" ? (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr_320px]">
          <aside className="card p-4">
            <div className="mb-3 flex gap-1">
              {(["all", "science", "math"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubjectFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs capitalize ${subjectFilter === s ? "bg-cyan-400/20 text-cyan-100" : "text-slate-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <ul className="max-h-[60vh] space-y-1 overflow-y-auto text-sm">
              {chapters.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setChapterId(c.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${chapterId === c.id ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:bg-slate-800/60"}`}
                  >
                    <span className="block text-[10px] uppercase text-slate-500">{c.subject}</span>
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="card min-h-[60vh] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/40 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-50">{content?.title ?? chapter?.title}</h2>
                <p className="text-xs text-slate-500">{chapter?.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-secondary !px-2 !py-2" onClick={() => goChapter(-1)} disabled={chapterIndex <= 0}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" className="btn-secondary !px-2 !py-2" onClick={() => goChapter(1)} disabled={chapterIndex >= chapters.length - 1}>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button type="button" className="btn-primary !py-2" onClick={speaking ? stopAudio : playAudio} disabled={!content?.audioScript}>
                  {speaking ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {speaking ? "Stop audio" : "Play audio"}
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-400">Loading chapter content…</p>
            ) : (
              <>
                <CrawlStatusBar content={content} />
                <div className="mb-4 flex flex-wrap gap-2">
                  {content?.sections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSectionId(s.id)}
                      className={`rounded-full border px-3 py-1 text-xs ${sectionId === s.id ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-100" : "border-slate-600/40 text-slate-400"}`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
                {activeSection && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-cyan-100">{activeSection.title}</h3>
                    {activeSection.visualSvg && (
                      <div
                        className="mb-4 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/50 p-4"
                        dangerouslySetInnerHTML={{ __html: activeSection.visualSvg }}
                      />
                    )}
                    <SectionBody body={activeSection.body} />
                  </div>
                )}
              </>
            )}
          </main>

          <aside className="card flex flex-col p-4">
            <h3 className="mb-3 font-semibold text-slate-100">Reviewer notes</h3>
            <label className="mb-3 block text-xs text-slate-400">
              Your name
              <input
                className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                onBlur={saveReviewer}
                placeholder="Dr. Sharma, Content lead…"
              />
            </label>
            <label className="mb-3 block text-xs text-slate-400">
              Category
              <select
                className="mt-1 w-full rounded-lg border border-slate-600/50 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                value={category}
                onChange={(e) => setCategory(e.target.value as ReviewNoteCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-3 block flex-1 text-xs text-slate-400">
              Observation
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-slate-600/50 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Content quality feedback for this section…"
              />
            </label>
            <button type="button" className="btn-primary mb-4 w-full" onClick={submitNote}>
              Save observation
            </button>
            <div className="max-h-48 space-y-2 overflow-y-auto border-t border-slate-700/40 pt-3 text-xs">
              {notes.length === 0 ? (
                <p className="text-slate-500">No notes for this chapter yet.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-slate-700/40 bg-slate-900/50 p-2">
                    <div className="flex justify-between text-slate-400">
                      <span>{n.reviewer}</span>
                      <span className="capitalize">{n.category}</span>
                    </div>
                    <p className="mt-1 text-slate-200">{n.observation}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      ) : (
        <ObservationsPanel notes={allNotes} onStatusChange={(id, status) => { updateNoteStatus(id, status); refreshNotes(); }} onImport={handleImport} />
      )}
    </div>
  );
}

function ObservationsPanel({
  notes,
  onStatusChange,
  onImport,
}: {
  notes: ReviewNote[];
  onStatusChange: (id: string, status: ReviewNoteStatus) => void;
  onImport: (file: File) => void;
}) {
  const byChapter = useMemo(() => {
    const map = new Map<string, ReviewNote[]>();
    for (const n of notes) {
      const list = map.get(n.chapterId) ?? [];
      list.push(n);
      map.set(n.chapterId, list);
    }
    return map;
  }, [notes]);

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Collect observations from all reviewers. Set status to decide: accept fix, reject, or defer.
        </p>
        <div className="flex gap-2">
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(exportNotesJson())}`}
            download="cbse10-review-notes.json"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </a>
          <label className="btn-secondary inline-flex cursor-pointer items-center gap-2 text-sm">
            <Upload className="h-4 w-4" />
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
              }}
            />
          </label>
        </div>
      </div>
      {notes.length === 0 ? (
        <p className="text-slate-500">No observations yet. Review chapters and save notes.</p>
      ) : (
        <div className="space-y-6">
          {[...byChapter.entries()].map(([chapterId, chapterNotes]) => (
            <div key={chapterId}>
              <h3 className="mb-2 text-sm font-semibold text-cyan-100">{chapterId}</h3>
              <div className="space-y-2">
                {chapterNotes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-slate-300">
                        <strong className="text-slate-100">{n.reviewer}</strong> · {n.category}
                        {n.sectionId ? ` · ${n.sectionId}` : ""}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {STATUSES.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => onStatusChange(n.id, s.value)}
                            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${n.status === s.value ? s.className : "border-slate-600/30 text-slate-500"}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-200">{n.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
