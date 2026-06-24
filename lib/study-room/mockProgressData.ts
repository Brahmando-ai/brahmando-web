/** Mock student progress data — Priya, CBSE 10 Core (Science + Math) */

export type ChapterStatus = "strong" | "needs_practice" | "at_risk" | "stale";
export type Trend = "up" | "down" | "flat";

export type ChapterMastery = {
  id: string;
  title: string;
  subject: "science" | "math";
  masteryPct: number;
  quizScorePct: number;
  mockScorePct: number;
  focusAvg: number;
  attempts: number;
  lastStudied: string;
  status: ChapterStatus;
  trend: Trend;
};

export type StudyEvent = {
  id: string;
  date: string;
  type: "chapter_open" | "quiz_complete" | "mock_complete";
  chapter?: string;
  subject?: string;
  detail: string;
  score?: string;
  focus?: number;
};

export type FocusWeek = {
  label: string;
  avg: number;
  sessions: number;
  note?: string;
};

export type WeeklyReport = {
  reportId: string;
  periodFrom: string;
  periodTo: string;
  studentName: string;
  grade: string;
  board: string;
  sku: string;
  overallMockPct: number;
  overallMockTrend: Trend;
  strongChapters: string[];
  weakChapters: string[];
  focusWeeklyAvg: number;
  focusTrend: Trend;
  focusHistory: FocusWeek[];
  chapters: ChapterMastery[];
  actions: string[];
  mockHighlights?: { question: string; chapter: string; note: string }[];
  guardians: { name: string; email: string }[];
  teachers: { name: string; email: string; subject: string }[];
};

export const MOCK_STUDENT = {
  id: "stu_priya_001",
  name: "Priya K.",
  grade: "10",
  board: "CBSE",
  sku: "cbse10-core",
};

export const MOCK_CHAPTER_MASTERY: ChapterMastery[] = [
  {
    id: "light",
    title: "Light – Reflection and Refraction",
    subject: "science",
    masteryPct: 35,
    quizScorePct: 50,
    mockScorePct: 25,
    focusAvg: 62,
    attempts: 3,
    lastStudied: "2026-06-18",
    status: "at_risk",
    trend: "down",
  },
  {
    id: "acids-bases",
    title: "Acids, Bases and Salts",
    subject: "science",
    masteryPct: 48,
    quizScorePct: 52,
    mockScorePct: 45,
    focusAvg: 51,
    attempts: 2,
    lastStudied: "2026-06-10",
    status: "needs_practice",
    trend: "flat",
  },
  {
    id: "life",
    title: "Life Processes",
    subject: "science",
    masteryPct: 78,
    quizScorePct: 80,
    mockScorePct: 75,
    focusAvg: 68,
    attempts: 4,
    lastStudied: "2026-06-20",
    status: "strong",
    trend: "up",
  },
  {
    id: "metals",
    title: "Metals and Non-metals",
    subject: "science",
    masteryPct: 92,
    quizScorePct: 90,
    mockScorePct: 100,
    focusAvg: 74,
    attempts: 3,
    lastStudied: "2026-06-15",
    status: "strong",
    trend: "up",
  },
  {
    id: "chem-reactions",
    title: "Chemical Reactions and Equations",
    subject: "science",
    masteryPct: 55,
    quizScorePct: 60,
    mockScorePct: 50,
    focusAvg: 59,
    attempts: 2,
    lastStudied: "2026-06-08",
    status: "needs_practice",
    trend: "flat",
  },
  {
    id: "real-numbers",
    title: "Real Numbers",
    subject: "math",
    masteryPct: 100,
    quizScorePct: 100,
    mockScorePct: 100,
    focusAvg: 76,
    attempts: 5,
    lastStudied: "2026-06-14",
    status: "strong",
    trend: "flat",
  },
  {
    id: "polynomials",
    title: "Polynomials",
    subject: "math",
    masteryPct: 55,
    quizScorePct: 58,
    mockScorePct: 52,
    focusAvg: 63,
    attempts: 3,
    lastStudied: "2026-06-17",
    status: "needs_practice",
    trend: "down",
  },
  {
    id: "quadratic",
    title: "Quadratic Equations",
    subject: "math",
    masteryPct: 28,
    quizScorePct: 40,
    mockScorePct: 20,
    focusAvg: 48,
    attempts: 1,
    lastStudied: "2026-05-28",
    status: "stale",
    trend: "down",
  },
];

export const MOCK_EVENTS: StudyEvent[] = [
  {
    id: "e1",
    date: "2026-06-22",
    type: "mock_complete",
    subject: "Science",
    detail: "Science board-style mock",
    score: "62%",
    focus: 66,
  },
  {
    id: "e2",
    date: "2026-06-20",
    type: "chapter_open",
    chapter: "Life Processes",
    subject: "Science",
    detail: "Study session · 32 min",
    focus: 68,
  },
  {
    id: "e3",
    date: "2026-06-18",
    type: "quiz_complete",
    chapter: "Light",
    subject: "Science",
    detail: "Chapter quiz (5)",
    score: "2/5 (40%)",
    focus: 54,
  },
  {
    id: "e4",
    date: "2026-06-18",
    type: "chapter_open",
    chapter: "Light",
    subject: "Science",
    detail: "Study session · 18 min",
    focus: 54,
  },
  {
    id: "e5",
    date: "2026-06-17",
    type: "quiz_complete",
    chapter: "Polynomials",
    subject: "Mathematics",
    detail: "Chapter quiz (5)",
    score: "3/5 (60%)",
    focus: 61,
  },
  {
    id: "e6",
    date: "2026-06-12",
    type: "quiz_complete",
    chapter: "Light",
    subject: "Science",
    detail: "Chapter quiz (5)",
    score: "3/5 (60%)",
    focus: 71,
  },
  {
    id: "e7",
    date: "2026-06-12",
    type: "chapter_open",
    chapter: "Light",
    subject: "Science",
    detail: "Study session · 25 min",
    focus: 71,
  },
];

export const MOCK_FOCUS_WEEKS: FocusWeek[] = [
  { label: "2–8 Jun", avg: 52, sessions: 3, note: "Short sessions" },
  { label: "9–15 Jun", avg: 58, sessions: 4, note: "More tab switching" },
  { label: "16–22 Jun", avg: 65, sessions: 5, note: "Improving" },
];

export const MOCK_WEEKLY_REPORT: WeeklyReport = {
  reportId: "rpt_2026w25_priya",
  periodFrom: "2026-06-16",
  periodTo: "2026-06-22",
  studentName: MOCK_STUDENT.name,
  grade: MOCK_STUDENT.grade,
  board: MOCK_STUDENT.board,
  sku: MOCK_STUDENT.sku,
  overallMockPct: 62,
  overallMockTrend: "up",
  strongChapters: ["Metals and Non-metals", "Life Processes", "Real Numbers"],
  weakChapters: ["Light – Reflection and Refraction", "Acids, Bases and Salts"],
  focusWeeklyAvg: 65,
  focusTrend: "up",
  focusHistory: MOCK_FOCUS_WEEKS,
  chapters: MOCK_CHAPTER_MASTERY,
  actions: [
    "Light: Schedule 30 min revision + 5-question drill on reflection & refraction.",
    "Acids & Bases: Revise before next Science mock (last studied 10 Jun).",
    "Polynomials: Continue practice — discriminant & zeroes still weak.",
    "Focus: Trend improving (58 → 65); encourage 25-min focused blocks.",
  ],
  mockHighlights: [
    {
      question: "Q14 — Mirror formula (concave)",
      chapter: "Light",
      note: "Sign convention error",
    },
    {
      question: "Q18 — Refraction diagram",
      chapter: "Light",
      note: "Ray direction incorrect",
    },
    {
      question: "Q7 — Life Processes",
      chapter: "Life Processes",
      note: "Correct — good recall",
    },
  ],
  guardians: [{ name: "Rajesh K.", email: "raj.kumar@example.com" }],
  teachers: [{ name: "Mrs Sharma", email: "sharma@school.edu", subject: "Science" }],
};

export function getAtRiskChapters(): ChapterMastery[] {
  return MOCK_CHAPTER_MASTERY.filter((c) => c.status === "at_risk");
}

export function getMasteryByChapterId(id: string): ChapterMastery | undefined {
  return MOCK_CHAPTER_MASTERY.find((c) => c.id === id);
}

export function statusLabel(status: ChapterStatus): string {
  switch (status) {
    case "strong":
      return "Strong";
    case "needs_practice":
      return "Needs practice";
    case "at_risk":
      return "At risk";
    case "stale":
      return "Not revised";
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
