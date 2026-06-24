import type { QuizQuestion, StudyChapter, StudySubject } from "@/lib/study-room/types";
import { MOCK_CHAPTER_MASTERY } from "@/lib/study-room/mockProgressData";

export const CBSE10_SUBJECTS: StudySubject[] = [
  { id: "science", label: "Science", icon: "🧪" },
  { id: "math", label: "Mathematics", icon: "📐" },
];

function chaptersForSubject(subject: "science" | "math"): StudyChapter[] {
  return MOCK_CHAPTER_MASTERY.filter((c) => c.subject === subject).map((c) => ({
    id: c.id,
    title: c.title,
    progress: c.masteryPct,
    status: c.status,
  }));
}

export const CBSE10_CHAPTERS: Record<string, StudyChapter[]> = {
  science: chaptersForSubject("science"),
  math: chaptersForSubject("math"),
};

export const CBSE10_QUIZ_BANK: Record<string, QuizQuestion[]> = {
  light: [
    {
      id: "q1",
      prompt: "The angle of incidence equals the angle of reflection. This law applies to:",
      options: ["Only plane mirrors", "All reflecting surfaces", "Only curved mirrors", "Only glass slabs"],
      correctIndex: 1,
    },
    {
      id: "q2",
      prompt: "A concave mirror can produce a real, inverted image when the object is placed:",
      options: ["At the focus", "Between P and F", "Beyond C", "At C"],
      correctIndex: 2,
    },
    {
      id: "q3",
      prompt: "Refractive index n = speed of light in vacuum / speed of light in medium. For glass, n is typically:",
      options: ["Less than 1", "Equal to 1", "Greater than 1", "Zero"],
      correctIndex: 2,
    },
    {
      id: "q4",
      prompt: "The power of a lens is measured in:",
      options: ["Joules", "Dioptres", "Watts", "Metres"],
      correctIndex: 1,
    },
    {
      id: "q5",
      prompt: "When white light passes through a prism, it splits due to:",
      options: ["Reflection only", "Dispersion", "Total internal reflection", "Polarisation"],
      correctIndex: 1,
    },
  ],
  polynomials: [
    {
      id: "q1",
      prompt: "If p(x) = x² − 5x + 6, then p(2) equals:",
      options: ["0", "2", "4", "−2"],
      correctIndex: 0,
    },
    {
      id: "q2",
      prompt: "The zeroes of x² − 3x − 10 are:",
      options: ["5 and −2", "2 and −5", "10 and −1", "3 and −10"],
      correctIndex: 0,
    },
    {
      id: "q3",
      prompt: "Degree of a non-zero constant polynomial is:",
      options: ["0", "1", "Undefined", "2"],
      correctIndex: 0,
    },
    {
      id: "q4",
      prompt: "If α and β are zeroes of x² − 5x + 6, then α + β equals:",
      options: ["5", "6", "−5", "1"],
      correctIndex: 0,
    },
    {
      id: "q5",
      prompt: "A quadratic polynomial with zeroes 2 and 3 is:",
      options: ["x² − 5x + 6", "x² + 5x + 6", "x² − 6", "x² + 6"],
      correctIndex: 0,
    },
  ],
};

export const CBSE10_DEFAULT_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which study strategy helps retention best for this chapter?",
    options: ["Skim once", "Active recall + spaced review", "Copy notes only", "Skip examples"],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "Before a mock test, you should:",
    options: ["Ignore syllabus", "Review key formulas and definitions", "Avoid sleep", "Only read introduction"],
    correctIndex: 1,
  },
  {
    id: "q3",
    prompt: "NCERT examples are important because:",
    options: ["They never appear in exams", "They build exam-style problem patterns", "They replace textbooks", "They are optional"],
    correctIndex: 1,
  },
  {
    id: "q4",
    prompt: "If stuck on a MCQ, first:",
    options: ["Guess randomly", "Eliminate clearly wrong options", "Skip entire paper", "Close the app"],
    correctIndex: 1,
  },
  {
    id: "q5",
    prompt: "After a chapter quiz, you should:",
    options: ["Forget mistakes", "Review weak topics before board mock", "Stop studying", "Change subject immediately"],
    correctIndex: 1,
  },
];
