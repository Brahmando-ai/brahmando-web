import type { ChapterReviewContent } from "./types";
import type { ReviewChapter } from "./chapters";

/** Matches Education crawler chapter_builder.py section list. */
export const CHAPTER_SECTION_TITLES = [
  "Concept Overview",
  "Key Definitions",
  "Core Concepts",
  "Formulas / Theorems",
  "Solved Examples",
  "Common Mistakes",
  "Diagram Section",
  "Practice Questions",
  "Real World Applications",
  "Video Learning Resources",
  "Video Transcript Summary",
  "Teacher Explanation Module",
  "Revision Summary",
] as const;

function sectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Empty shell when crawler has not published JSON for this chapter yet. */
export function chapterStructure(chapter: ReviewChapter): ChapterReviewContent {
  return {
    chapterId: chapter.id,
    title: chapter.title,
    subject: chapter.subject,
    audioScript: "",
    sections: CHAPTER_SECTION_TITLES.map((title, index) => ({
      id: sectionId(title),
      title: `${index + 1}. ${title}`,
      body: "",
    })),
  };
}

export function chapterContentUrl(chapter: ReviewChapter): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/review-material/${chapter.subject}/${chapter.slug}.json`;
}

export async function fetchChapterContent(chapter: ReviewChapter): Promise<ChapterReviewContent> {
  try {
    const res = await fetch(chapterContentUrl(chapter));
    if (!res.ok) return chapterStructure(chapter);
    const data = (await res.json()) as ChapterReviewContent;
    if (!data.sections?.length) return chapterStructure(chapter);
    return data;
  } catch {
    return chapterStructure(chapter);
  }
}
