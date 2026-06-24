"use client";

import { useCallback, useEffect, useState } from "react";
import { getSkuInstance, normalizeSkuId } from "@/lib/study-room/skuInstances";
import { loadChapterQuiz, loadStudyRoomData } from "@/lib/study-room/studyRoomApi";
import type { QuizQuestion, StudyChapter, StudySubject } from "@/lib/study-room/types";

export function useStudyRoomSku(skuRaw: string | null | undefined) {
  const skuId = normalizeSkuId(skuRaw);
  const instance = getSkuInstance(skuId);
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [chaptersBySubject, setChaptersBySubject] = useState<Record<string, StudyChapter[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadStudyRoomData(skuId)
      .then((data) => {
        if (cancelled) return;
        setSubjects(data.subjects);
        setChaptersBySubject(data.chaptersBySubject);
      })
      .catch((exc) => {
        if (cancelled) return;
        setError(exc instanceof Error ? exc.message : "Failed to load curriculum");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skuId]);

  const fetchQuiz = useCallback(
    async (subjectId: string, chapterId: string): Promise<QuizQuestion[]> => {
      const subject = subjects.find((s) => s.id === subjectId);
      if (!subject) return [];
      return loadChapterQuiz(skuId, subject, chapterId);
    },
    [skuId, subjects]
  );

  return { skuId, instance, subjects, chaptersBySubject, loading, error, fetchQuiz };
}
