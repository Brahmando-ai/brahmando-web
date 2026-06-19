"use client";

import Link from "next/link";
import { useState } from "react";
import { N8nWorkflowViewer } from "@/components/workflows/N8nWorkflowViewer";
import {
  allRhythmWorkflows,
  rhythmTemplateUrl,
  type RhythmSubWorkflow,
  type RhythmVertical,
} from "@/lib/rhythm-verticals";

type Props = {
  vertical: RhythmVertical;
  initialWorkflowId?: string;
};

export function RhythmVerticalExplorer({ vertical, initialWorkflowId }: Props) {
  const workflows = allRhythmWorkflows(vertical);
  const [activeId, setActiveId] = useState(initialWorkflowId ?? vertical.master.id);

  const active: RhythmSubWorkflow =
    workflows.find((w) => w.id === activeId) ?? vertical.master;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">
              {active.isMaster ? "Master workflow" : "Sub-workflow"}
            </p>
            <h2 className="text-xl font-semibold text-slate-100">{active.title}</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">{active.description}</p>
            {active.events.length > 0 && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-slate-500">
                Events: {active.events.join(" · ")}
              </p>
            )}
          </div>
          {active.isMaster && (
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-100">
              Order-to-cash orchestrator
            </span>
          )}
        </div>

        <N8nWorkflowViewer
          jsonUrl={rhythmTemplateUrl(vertical, active)}
          workflowName={active.workflowName}
          height={active.isMaster ? 480 : 400}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          {active.isMaster ? "Business process sub-workflows" : "All workflows in this vertical"}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf) => {
            const selected = wf.id === activeId;
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => setActiveId(wf.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border-violet-400/50 bg-violet-500/10"
                    : "border-slate-700/50 bg-slate-900/30 hover:border-violet-300/30"
                }`}
              >
                <p className="text-xs font-medium text-violet-200/90">
                  {wf.isMaster ? "Master" : "Sub"}
                </p>
                <p className="mt-1 font-medium text-slate-100">{wf.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{wf.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        {workflows.map((wf) => (
          <Link
            key={wf.id}
            href={`/workflows/rhythm/${vertical.id}/${wf.id}`}
            className="text-xs text-cyan-200/90 hover:text-cyan-100"
          >
            Deep link: {wf.title} →
          </Link>
        ))}
      </section>
    </div>
  );
}
