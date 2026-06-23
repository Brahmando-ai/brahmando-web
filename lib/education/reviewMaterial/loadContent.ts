import type { ChapterReviewContent } from "./types";
import type { ReviewChapter } from "./chapters";

export function chapterContentUrl(chapter: ReviewChapter): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/review-material/${chapter.subject}/${chapter.slug}.json`;
}

export function defaultChapterContent(chapter: ReviewChapter): ChapterReviewContent {
  return {
    chapterId: chapter.id,
    title: chapter.title,
    subject: chapter.subject,
    audioScript: `Review chapter: ${chapter.title}. Crawled content is being synthesized. Check concept overview, definitions, formulas, diagrams, and teacher explanation sections when the enricher pipeline publishes ${chapter.outputFile}.`,
    sections: [
      {
        id: "overview",
        title: "1. Concept Overview",
        body: `_Pending enriched content for **${chapter.title}**._\n\nSource target: \`${chapter.outputFile}\` on CBSE-10 crawler output.`,
      },
      {
        id: "diagram",
        title: "7. Diagram Section",
        body: "SVG / PlantUML diagram will appear here after chapter builder Step 4.",
        visualSvg:
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 120' width='100%' height='120'><rect x='20' y='20' width='280' height='80' rx='8' fill='#1e293b' stroke='#475569' stroke-dasharray='6 4'/><text x='160' y='68' text-anchor='middle' fill='#94a3b8' font-size='13'>Diagram placeholder</text></svg>",
      },
      {
        id: "teacher",
        title: "12. Teacher Explanation Module",
        body: "Teacher-style narration will be attached when synthesis completes. Use Play Audio after content is loaded.",
      },
    ],
  };
}

export async function fetchChapterContent(chapter: ReviewChapter): Promise<ChapterReviewContent> {
  try {
    const res = await fetch(chapterContentUrl(chapter));
    if (!res.ok) return defaultChapterContent(chapter);
    return (await res.json()) as ChapterReviewContent;
  } catch {
    return defaultChapterContent(chapter);
  }
}
