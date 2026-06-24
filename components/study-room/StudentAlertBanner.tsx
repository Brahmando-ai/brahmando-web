"use client";

import { AlertTriangle, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type { ChapterMastery } from "@/lib/study-room/mockProgressData";
import { formatDate } from "@/lib/study-room/mockProgressData";

type Props = {
  chapters: ChapterMastery[];
  onPractice?: (chapterId: string) => void;
};

export function StudentAlertBanner({ chapters, onPractice }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const alerts = chapters.filter((c) => c.status === "at_risk" && !dismissed.has(c.id));

  if (alerts.length === 0) return null;

  return (
    <div className="mb-5 space-y-3">
      {alerts.map((ch) => (
        <div
          key={ch.id}
          className="relative rounded-2xl border border-amber-400/35 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-4 pr-10 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setDismissed((s) => new Set(s).add(ch.id))}
            className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20">
              <AlertTriangle className="h-5 w-5 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-amber-100">{ch.title} needs attention</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Last studied {formatDate(ch.lastStudied)} · Quiz avg {ch.quizScorePct}% · Mock{" "}
                {ch.mockScorePct}% · Mastery{" "}
                <span className="font-medium text-amber-200">{ch.masteryPct}%</span>
                {ch.trend === "down" && (
                  <span className="ml-1 text-red-300/90">↓ declining</span>
                )}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Suggested: 5-question drill on this chapter, then NCERT examples.
              </p>
              {onPractice && (
                <button
                  type="button"
                  onClick={() => onPractice(ch.id)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Practice now
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
