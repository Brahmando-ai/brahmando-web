export type StudySkuId = "cbse10-core" | "sat-act";

export type StudyChapter = {
  id: string;
  title: string;
  progress: number;
  status?: "strong" | "needs_practice" | "at_risk" | "stale";
};

export type StudySubject = {
  id: string;
  label: string;
  icon: string;
  track?: string;
  section?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type SkuInstance = {
  id: StudySkuId;
  displayName: string;
  tagline: string;
  subscribeLabel: string;
  boardMockLabel: string;
  peerLocale: "in" | "us";
  curriculumPath: string;
  questionsPath?: string;
  usesLiveQuiz: boolean;
};
