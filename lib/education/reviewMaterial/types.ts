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

export type ChapterSection = {
  id: string;
  title: string;
  body: string;
  visualSvg?: string;
};

export type ChapterReviewContent = {
  chapterId: string;
  title: string;
  subject: "science" | "math";
  audioScript: string;
  sections: ChapterSection[];
};
