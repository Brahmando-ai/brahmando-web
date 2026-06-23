export type ReviewNoteCategory =
  | "accuracy"
  | "clarity"
  | "pedagogy"
  | "visual"
  | "audio"
  | "other";

export type ReviewNoteStatus = "open" | "accepted" | "rejected" | "deferred";

export type ReviewNote = {
  id: string;
  chapterId: string;
  sectionId?: string;
  reviewer: string;
  category: ReviewNoteCategory;
  observation: string;
  status: ReviewNoteStatus;
  createdAt: string;
  updatedAt: string;
};

export type TeacherNarration = {
  teleprompter: string;
  style?: string;
  simplifiedSummary?: string;
  speakMaterial?: boolean;
};

export type SectionMedia = {
  type: "image";
  url: string;
  caption?: string;
};

export type SectionDiagram = {
  type: string;
  title?: string;
  caption?: string;
  layout?: string;
  synthetic?: boolean;
  nodes?: { id: string; label: string }[];
};

export type PracticeQuestion = {
  id: string;
  type: string;
  marks: number;
  topic?: string;
  source?: string;
  difficulty?: string;
  stem: string;
};

export type ChapterSection = {
  id: string;
  title: string;
  body: string;
  visualSvg?: string;
  teacherNarration?: TeacherNarration;
  diagram?: SectionDiagram;
  media?: SectionMedia[];
  practiceQuestions?: PracticeQuestion[];
};

export type TeacherAudioSegment = {
  sectionId: string;
  teleprompter: string;
};

export type TeacherAudio = {
  speakMaterial: boolean;
  defaultVoice?: string;
  segments?: TeacherAudioSegment[];
};

export type ChapterReviewContent = {
  schemaVersion?: number;
  registryId?: string;
  analyticsId?: string;
  board?: string;
  grade?: number;
  sku?: string;
  syllabusOrder?: number;
  difficulty?: "easy" | "medium" | "hard";
  recommendedDifficulty?: "easy" | "medium" | "hard";
  topics?: string[];
  formulas?: string[];
  chapterId: string;
  title: string;
  subject: "science" | "math";
  audioScript: string;
  teacherAudio?: TeacherAudio;
  sections: ChapterSection[];
  crawlMeta?: {
    articleCount: number;
    videoCount: number;
    sourceUrls: string[];
    builtAt: string;
  };
};
