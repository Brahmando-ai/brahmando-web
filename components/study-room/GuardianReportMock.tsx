"use client";

import { useState } from "react";
import { Download, Mail, Printer, UserRound, Users } from "lucide-react";
import { MOCK_WEEKLY_REPORT, formatDate } from "@/lib/study-room/mockProgressData";
import { ChapterStatusBadge, MasteryBar } from "@/components/study-room/ChapterStatusBadge";
import { FocusTrendChart } from "@/components/study-room/FocusTrendChart";
import { StudyRoomNavShell } from "@/components/study-room/StudyRoomNavShell";

type ViewerRole = "guardian" | "teacher";

export function GuardianReportMock() {
  const [role, setRole] = useState<ViewerRole>("guardian");
  const r = MOCK_WEEKLY_REPORT;
  const reportChapters = r.chapters.filter(
    (c) => c.status === "at_risk" || c.status === "needs_practice" || c.status === "strong"
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <StudyRoomNavShell />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Mock weekly report</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-50">Progress Report</h1>
          <p className="mt-2 text-sm text-slate-400">
            {formatDate(r.periodFrom)} – {formatDate(r.periodTo)} · {r.studentName}
          </p>
        </div>

        <div className="flex rounded-xl border border-slate-600/40 bg-slate-900/60 p-1">
          <button
            type="button"
            onClick={() => setRole("guardian")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              role === "guardian"
                ? "bg-cyan-400/15 text-cyan-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" />
            Guardian view
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              role === "teacher"
                ? "bg-amber-400/15 text-amber-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserRound className="h-4 w-4" />
            Teacher view
          </button>
        </div>
      </div>

      {/* Report document */}
      <article className="rounded-3xl border border-slate-300/25 bg-slate-900/70 shadow-2xl backdrop-blur-xl">
        {/* Letterhead */}
        <header className="border-b border-slate-700/50 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/90">
                Brahmando Study Room
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-50">
                Weekly progress — {r.studentName}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {r.board} Class {r.grade} · {r.sku.replace("-", " ")}
              </p>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>Report ID: {r.reportId}</p>
              <p>
                Period: {formatDate(r.periodFrom)} – {formatDate(r.periodTo)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary py-2 text-xs" disabled>
              <Mail className="h-3.5 w-3.5" />
              Email sent (mock)
            </button>
            <button type="button" className="btn-secondary py-2 text-xs" disabled>
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
            <button type="button" className="btn-secondary py-2 text-xs" disabled>
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </header>

        <div className="space-y-8 px-6 py-8 sm:px-8">
          {/* Summary */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Summary
            </h3>
            <div className="rounded-2xl border border-slate-700/40 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-300">
              <p>
                Overall Science mock:{" "}
                <strong className="text-slate-100">{r.overallMockPct}%</strong>
                {r.overallMockTrend === "up" && (
                  <span className="text-emerald-400"> (↑ from 55% last week)</span>
                )}
              </p>
              <p className="mt-2">
                <span className="text-emerald-300">Going well:</span>{" "}
                {r.strongChapters.join(", ")}
              </p>
              <p className="mt-2">
                <span className="text-amber-300">Needs support:</span> {r.weakChapters.join(", ")}
              </p>
            </div>
          </section>

          {/* Chapter table */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Chapter breakdown
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-700/40">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-slate-950/50">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3 font-medium">Chapter</th>
                    <th className="px-4 py-3 font-medium">Last studied</th>
                    <th className="px-4 py-3 font-medium">Mastery</th>
                    <th className="px-4 py-3 font-medium">Focus</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportChapters.slice(0, role === "guardian" ? 6 : 8).map((ch) => (
                    <tr key={ch.id} className="border-t border-slate-800/60">
                      <td className="px-4 py-3 text-slate-200">{ch.title}</td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(ch.lastStudied)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-slate-300">{ch.masteryPct}%</span>
                          <div className="w-16">
                            <MasteryBar pct={ch.masteryPct} size="sm" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{ch.focusAvg}</td>
                      <td className="px-4 py-3">
                        <ChapterStatusBadge status={ch.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Focus */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Concentration over time
            </h3>
            <FocusTrendChart
              weeks={r.focusHistory}
              currentAvg={r.focusWeeklyAvg}
              trend={r.focusTrend}
            />
          </section>

          {/* Teacher-only mock highlights */}
          {role === "teacher" && r.mockHighlights && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400/90">
                Mock detail (teacher only)
              </h3>
              <ul className="space-y-2 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                {r.mockHighlights.map((h) => (
                  <li key={h.question} className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">{h.question}</span>
                    <span className="text-slate-500"> · {h.chapter}</span>
                    <span className="block text-xs text-slate-500">{h.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Recommended actions */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Recommended actions
            </h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
              {r.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
          </section>

          {/* Recipients */}
          <footer className="border-t border-slate-700/50 pt-6 text-xs text-slate-500">
            <p>
              Sent to:{" "}
              {r.guardians.map((g) => `${g.name} <${g.email}>`).join("; ")}
              {role === "teacher" &&
                ` · ${r.teachers.map((t) => `${t.name} (${t.subject})`).join("; ")}`}
            </p>
            <p className="mt-2 italic">
              Mock report — production will email HTML/PDF every Sunday 6 PM and after full mocks.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
