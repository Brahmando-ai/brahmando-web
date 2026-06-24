"use client";

import type { ReactNode } from "react";
import { Calendar, Target, TrendingUp } from "lucide-react";
import {
  MOCK_CHAPTER_MASTERY,
  MOCK_EVENTS,
  MOCK_FOCUS_WEEKS,
  MOCK_STUDENT,
  formatDate,
} from "@/lib/study-room/mockProgressData";
import { ChapterStatusBadge, MasteryBar, TrendIndicator } from "@/components/study-room/ChapterStatusBadge";
import { FocusTrendChart } from "@/components/study-room/FocusTrendChart";
import { StudentAlertBanner } from "@/components/study-room/StudentAlertBanner";
import { StudyRoomNavShell } from "@/components/study-room/StudyRoomNavShell";

export function StudentProgressMock() {
  const science = MOCK_CHAPTER_MASTERY.filter((c) => c.subject === "science");
  const math = MOCK_CHAPTER_MASTERY.filter((c) => c.subject === "math");
  const atRisk = MOCK_CHAPTER_MASTERY.filter((c) => c.status === "at_risk");
  const strong = MOCK_CHAPTER_MASTERY.filter((c) => c.status === "strong");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <StudyRoomNavShell />

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Mock data · Priya K.</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-50">My Progress</h1>
        <p className="mt-2 text-sm text-slate-400">
          CBSE Class {MOCK_STUDENT.grade} · {MOCK_STUDENT.sku} · Chapter mastery, focus &amp; activity
        </p>
      </div>

      <StudentAlertBanner chapters={atRisk} />

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Target className="h-5 w-5 text-emerald-400" />}
          label="Strong chapters"
          value={String(strong.length)}
          sub={strong.map((c) => c.title.split(" ")[0]).join(", ")}
        />
        <SummaryCard
          icon={<TrendingUp className="h-5 w-5 text-amber-400" />}
          label="Needs support"
          value={String(atRisk.length + MOCK_CHAPTER_MASTERY.filter((c) => c.status === "needs_practice").length)}
          sub="Light, Acids, Polynomials…"
        />
        <SummaryCard
          icon={<Calendar className="h-5 w-5 text-cyan-400" />}
          label="Focus this week"
          value="65"
          sub="↑ from 58 last week"
        />
        <SummaryCard
          icon={<Calendar className="h-5 w-5 text-slate-400" />}
          label="Study sessions"
          value="5"
          sub="16–22 Jun"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ChapterTable title="Science" chapters={science} />
          <ChapterTable title="Mathematics" chapters={math} />
        </div>

        <div className="space-y-5">
          <FocusTrendChart weeks={MOCK_FOCUS_WEEKS} currentAvg={65} trend="up" />

          <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-4 backdrop-blur-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent activity
            </p>
            <ul className="space-y-3">
              {MOCK_EVENTS.slice(0, 6).map((ev) => (
                <li key={ev.id} className="border-l-2 border-cyan-500/30 pl-3">
                  <p className="text-xs text-slate-500">{formatDate(ev.date)}</p>
                  <p className="text-sm text-slate-200">{ev.detail}</p>
                  <p className="text-xs text-slate-400">
                    {ev.chapter && `${ev.chapter} · `}
                    {ev.score && `${ev.score} · `}
                    {ev.focus != null && `Focus ${ev.focus}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-4 backdrop-blur-xl">
      <div className="mb-2">{icon}</div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-50">{value}</p>
      <p className="mt-1 truncate text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function ChapterTable({
  title,
  chapters,
}: {
  title: string;
  chapters: typeof MOCK_CHAPTER_MASTERY;
}) {
  return (
    <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-4 backdrop-blur-xl sm:p-5">
      <h2 className="mb-4 font-semibold text-slate-100">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs uppercase tracking-wider text-slate-500">
              <th className="pb-3 pr-4 font-medium">Chapter</th>
              <th className="pb-3 pr-4 font-medium">Mastery</th>
              <th className="pb-3 pr-4 font-medium">Last studied</th>
              <th className="pb-3 pr-4 font-medium">Focus</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((ch) => (
              <tr key={ch.id} className="border-b border-slate-800/60 last:border-0">
                <td className="py-3 pr-4">
                  <span className="text-slate-200">{ch.title}</span>
                  <span className="ml-1 text-slate-500">
                    <TrendIndicator trend={ch.trend} />
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 font-medium text-slate-300">{ch.masteryPct}%</span>
                    <div className="w-20">
                      <MasteryBar pct={ch.masteryPct} size="sm" />
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-slate-400">{formatDate(ch.lastStudied)}</td>
                <td className="py-3 pr-4 text-slate-400">{ch.focusAvg}</td>
                <td className="py-3">
                  <ChapterStatusBadge status={ch.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
