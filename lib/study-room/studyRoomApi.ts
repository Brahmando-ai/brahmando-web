import type { QuizQuestion, StudyChapter, StudySubject, StudySkuId } from "@/lib/study-room/types";
import { getSkuInstance } from "@/lib/study-room/skuInstances";
import {
  CBSE10_CHAPTERS,
  CBSE10_DEFAULT_QUIZ,
  CBSE10_QUIZ_BANK,
  CBSE10_SUBJECTS,
} from "@/lib/study-room/cbse10MockData";

const SUBJECT_ICONS: Record<string, string> = {
  "sat-reading-writing": "📖",
  "sat-math": "🔢",
  "act-english": "✍️",
  "act-math": "📐",
  "act-reading": "📚",
  "act-science": "🔬",
};

type SatActCurriculum = {
  subjects?: Record<
    string,
    {
      label: string;
      track?: string;
      section?: string;
      chapters?: { id: string; title: string }[];
    }
  >;
};

export type StudyRoomData = {
  subjects: StudySubject[];
  chaptersBySubject: Record<string, StudyChapter[]>;
};

export async function loadStudyRoomData(skuId: StudySkuId): Promise<StudyRoomData> {
  if (skuId === "cbse10-core") {
    return { subjects: CBSE10_SUBJECTS, chaptersBySubject: CBSE10_CHAPTERS };
  }

  const instance = getSkuInstance(skuId);
  const res = await fetch(instance.curriculumPath);
  if (!res.ok) {
    throw new Error(`Curriculum fetch failed (${res.status})`);
  }
  const data = (await res.json()) as SatActCurriculum;
  const subjects: StudySubject[] = [];
  const chaptersBySubject: Record<string, StudyChapter[]> = {};

  for (const [id, subject] of Object.entries(data.subjects ?? {})) {
    subjects.push({
      id,
      label: subject.label,
      icon: SUBJECT_ICONS[id] ?? "📘",
      track: subject.track,
      section: subject.section,
    });
    chaptersBySubject[id] = (subject.chapters ?? []).map((ch, idx) => ({
      id: ch.id,
      title: ch.title,
      progress: Math.max(12, 88 - idx * 4),
      status: idx === 0 ? "needs_practice" : undefined,
    }));
  }

  return { subjects, chaptersBySubject };
}

export async function loadChapterQuiz(
  skuId: StudySkuId,
  subject: StudySubject,
  chapterId: string
): Promise<QuizQuestion[]> {
  if (skuId === "cbse10-core") {
    return CBSE10_QUIZ_BANK[chapterId] ?? CBSE10_DEFAULT_QUIZ;
  }

  const instance = getSkuInstance(skuId);
  if (!instance.questionsPath) return CBSE10_DEFAULT_QUIZ;

  const params = new URLSearchParams({
    verified_only: "true",
    limit: "5",
  });
  if (subject.track) params.set("track", subject.track);
  if (subject.section) params.set("section", subject.section);
  if (chapterId) params.set("chapter", chapterId);

  let res = await fetch(`${instance.questionsPath}?${params}`);
  let payload = await res.json();
  let items = mapApiQuestions(payload?.questions ?? []);

  if (items.length === 0 && subject.section) {
    params.delete("chapter");
    res = await fetch(`${instance.questionsPath}?${params}`);
    payload = await res.json();
    items = mapApiQuestions(payload?.questions ?? []);
  }

  return items.length > 0 ? items : CBSE10_DEFAULT_QUIZ;
}

function mapApiQuestions(raw: unknown[]): QuizQuestion[] {
  return raw
    .map((q, i) => {
      const row = q as {
        id?: string;
        prompt?: string;
        question?: string;
        options?: string[];
        correctIndex?: number | null;
      };
      const options = row.options ?? [];
      if (options.length < 2) return null;
      return {
        id: row.id ?? `api-${i}`,
        prompt: row.prompt ?? row.question ?? "",
        options,
        correctIndex: typeof row.correctIndex === "number" ? row.correctIndex : 0,
      };
    })
    .filter((q): q is QuizQuestion => Boolean(q?.prompt));
}
