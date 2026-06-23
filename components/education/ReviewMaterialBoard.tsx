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
import type { ChapterReviewContent, ChapterSection, ChapterVideo, PracticeQuestion, RealWorldApplication, ReviewNote, ReviewNoteCategory, ReviewNoteStatus } from "@/lib/education/reviewMaterial/types";
import {
  isSpeechSupported,
  preloadSpeechVoices,
  resolveVoicePreset,
  speakTeacherScript,
  stopTeacherSpeech,
  TEACHER_VOICE_PRESETS,
  type TeacherVoicePresetId,
} from "@/lib/education/reviewMaterial/teacherVoice";
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
  if (!body.trim() || body.includes("being enriched")) {
    return (
      <div className="rounded-xl border border-dashed border-slate-600/50 bg-slate-950/30 px-4 py-8 text-center text-sm text-slate-500">
        Content for this section is being prepared. Check back after the next enrichment pass.
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

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function VideoResourcesBlock({ videos }: { videos: ChapterVideo[] }) {
  const embeddable = videos.filter((v) => v.kind === "youtube");
  const searches = videos.filter((v) => v.kind === "search");
  if (!embeddable.length && !searches.length) return null;
  return (
    <div className="mb-4 space-y-4">
      {embeddable.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {embeddable.slice(0, 4).map((video) => {
            const embed = youtubeEmbedUrl(video.url);
            if (!embed) return null;
            return (
              <div key={video.id} className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/50">
                <iframe
                  title={video.title}
                  src={embed}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <p className="border-t border-slate-700/40 px-3 py-2 text-xs text-slate-300">{video.title}</p>
              </div>
            );
          })}
        </div>
      )}
      {searches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {searches.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-100 hover:bg-rose-500/20"
            >
              Search: {video.title.slice(0, 48)}
              {video.title.length > 48 ? "…" : ""}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function RealWorldBlock({ applications }: { applications: RealWorldApplication[] }) {
  const syllabusApps = applications.filter((a) => a.source === "syllabus-generated");
  if (!syllabusApps.length) return null;
  return (
    <div className="mb-4 space-y-2">
      {syllabusApps.map((app) => (
        <div key={app.id} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-slate-200">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-200/80">{app.topic}</p>
          <p>{renderInline(app.example)}</p>
        </div>
      ))}
    </div>
  );
}

function PracticeQuestionsBlock({ questions }: { questions: PracticeQuestion[] }) {
  if (!questions.length) return null;
  return (
    <div className="mb-4 space-y-2">
      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-slate-200"
        >
          <div className="mb-1 flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-amber-200/80">
            <span>{q.type}</span>
            <span>{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
            {q.topic && <span>{q.topic}</span>}
          </div>
          <p>{renderInline(q.stem)}</p>
        </div>
      ))}
    </div>
  );
}

function SectionDiagramBlock({ section }: { section: ChapterSection }) {
  return (
    <div className="mb-4 space-y-4">
      {section.visualSvg && (
        <div
          className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/50 p-4"
          dangerouslySetInnerHTML={{ __html: section.visualSvg }}
        />
      )}
      {section.diagram?.caption && (
        <p className="text-xs text-slate-400">{section.diagram.caption}</p>
      )}
      {section.media && section.media.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {section.media.map((item, i) => (
            <figure
              key={`${item.url}-${i}`}
              className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.caption ?? "Chapter diagram"}
                className="max-h-64 w-full object-contain bg-white/5"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {item.caption && (
                <figcaption className="border-t border-slate-700/40 px-3 py-2 text-xs text-slate-400">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

function ChapterMetaStrip({ content }: { content: ChapterReviewContent }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-xs">
      {content.schemaVersion && (
        <span className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1 text-slate-300">
          Schema v{content.schemaVersion}
        </span>
      )}
      {content.analyticsId && (
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          analyticsId: {content.analyticsId}
        </span>
      )}
      {content.difficulty && (
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 capitalize text-violet-100">
          {content.difficulty}
        </span>
      )}
      {content.sku && (
        <span className="rounded-full border border-slate-600/40 px-3 py-1 text-slate-400">
          {content.board ?? "CBSE"} · Grade {content.grade ?? 10} · {content.sku}
        </span>
      )}
      {content.topics && content.topics.length > 0 && (
        <span className="rounded-full border border-slate-600/40 px-3 py-1 text-slate-400">
          {content.topics.length} syllabus topic(s)
        </span>
      )}
    </div>
  );
}

function TeacherAudioBar({
  speaking,
  canPlay,
  speechSupported,
  onPlay,
}: {
  speaking: boolean;
  canPlay: boolean;
  speechSupported: boolean;
  onPlay: () => void;
}) {
  if (!canPlay) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Teacher narration</p>
      <button
        type="button"
        className="btn-secondary !py-1 !text-xs"
        onClick={onPlay}
        onMouseDown={preloadSpeechVoices}
        disabled={!speechSupported}
        title={speechSupported ? undefined : "Speech not supported in this browser"}
      >
        {speaking ? <Pause className="mr-1 inline h-3 w-3" /> : <Play className="mr-1 inline h-3 w-3" />}
        {speaking ? "Stop" : "Play this section"}
      </button>
    </div>
  );
}

function ContentStatusBar({ content }: { content: ChapterReviewContent | null }) {
  const meta = content?.crawlMeta;
  if (!meta) {
    return (
      <div className="mb-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
        Chapter content is not available yet.
      </div>
    );
  }
  const pct = meta.completeness != null ? Math.round(meta.completeness * 100) : null;
  const ready = meta.contentPass === true;
  return (
    <div
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
        ready
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100/90"
          : "border-amber-400/25 bg-amber-500/10 text-amber-100/90"
      }`}
    >
      {ready
        ? "Chapter content is ready for educator review."
        : "Chapter content is still being enriched — some sections are incomplete."}
      {pct != null ? ` Completeness: ${pct}%.` : ""}
      {meta.builtAt ? ` Updated ${new Date(meta.builtAt).toLocaleString()}.` : ""}
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
  const [voicePresetId, setVoicePresetId] = useState<TeacherVoicePresetId>("teacher-female-in");
  const [voicesReady, setVoicesReady] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

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
    setSpeechSupported(isSpeechSupported());
    if (!isSpeechSupported()) return;
    preloadSpeechVoices();
    const load = () => {
      preloadSpeechVoices();
      setVoicesReady(window.speechSynthesis.getVoices().length > 0);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      stopTeacherSpeech();
    };
  }, []);

  useEffect(() => {
    const defaultVoice = content?.teacherAudio?.defaultVoice as TeacherVoicePresetId | undefined;
    if (defaultVoice && TEACHER_VOICE_PRESETS.some((p) => p.id === defaultVoice)) {
      setVoicePresetId(defaultVoice);
    }
  }, [content?.teacherAudio?.defaultVoice]);

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
    stopTeacherSpeech();
    setSpeaking(false);
  }

  function teleprompterForSection(section: ChapterSection | undefined): string {
    if (!section) return "";
    if (section.teacherNarration?.teleprompter) return section.teacherNarration.teleprompter;
    const segment = content?.teacherAudio?.segments?.find((s) => s.sectionId === section.id);
    if (segment?.teleprompter) return segment.teleprompter;
    return content?.audioScript ?? "";
  }

  useEffect(() => {
    stopAudio();
  }, [sectionId, chapterId]);

  function playTeleprompter(text?: string) {
    const script = (text ?? teleprompterForSection(activeSection)).trim();
    if (!script || !speechSupported) return;

    if (speaking) {
      stopAudio();
      return;
    }

    preloadSpeechVoices();
    const preset = resolveVoicePreset(voicePresetId);
    const started = speakTeacherScript(script, preset, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (!started) setSpeaking(false);
  }

  function playAudio() {
    playTeleprompter();
  }

  const canPlayTeacherAudio = Boolean(
    teleprompterForSection(activeSection) ||
      content?.teacherAudio?.segments?.some((s) => s.teleprompter)
  );

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
            CBSE Class 10 Science &amp; Mathematics — educator review board. Review chapter sections,
            teacher narration, and diagrams. Add observations and triage feedback below.
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
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="rounded-lg border border-slate-600/50 bg-slate-900/80 px-2 py-2 text-xs text-slate-200"
                  value={voicePresetId}
                  onChange={(e) => setVoicePresetId(e.target.value as TeacherVoicePresetId)}
                  title="Teacher voice accent"
                >
                  {TEACHER_VOICE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {!voicesReady && (
                  <span className="text-[10px] text-slate-500">Loading voices…</span>
                )}
                <button type="button" className="btn-secondary !px-2 !py-2" onClick={() => goChapter(-1)} disabled={chapterIndex <= 0}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" className="btn-secondary !px-2 !py-2" onClick={() => goChapter(1)} disabled={chapterIndex >= chapters.length - 1}>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="btn-primary !py-2"
                  onClick={playAudio}
                  onMouseDown={preloadSpeechVoices}
                  disabled={!canPlayTeacherAudio || !speechSupported}
                >
                  {speaking ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {speaking ? "Stop teacher audio" : "Play teacher audio"}
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-400">Loading chapter content…</p>
            ) : (
              <>
                <ContentStatusBar content={content} />
                {content && <ChapterMetaStrip content={content} />}
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
                    <TeacherAudioBar
                      speaking={speaking}
                      canPlay={canPlayTeacherAudio}
                      speechSupported={speechSupported}
                      onPlay={() => playTeleprompter()}
                    />
                    {(activeSection.visualSvg || activeSection.media?.length || activeSection.diagram) && (
                      <SectionDiagramBlock section={activeSection} />
                    )}
                    {activeSection.videos && activeSection.videos.length > 0 && (
                      <VideoResourcesBlock videos={activeSection.videos} />
                    )}
                    {activeSection.applications && activeSection.applications.length > 0 && (
                      <RealWorldBlock applications={activeSection.applications} />
                    )}
                    {activeSection.practiceQuestions && activeSection.practiceQuestions.length > 0 && (
                      <PracticeQuestionsBlock questions={activeSection.practiceQuestions} />
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
