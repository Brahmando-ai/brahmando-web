import Link from "next/link";
import { ArrowRight } from "lucide-react";

type FlowStepsProps = {
  steps: string[];
  accent?: "violet" | "amber";
};

const accentMap = {
  violet: "bg-violet-400",
  amber: "bg-amber-400",
};

export function FlowSteps({ steps, accent = "violet" }: FlowStepsProps) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-3 text-sm text-slate-300">
          <span
            className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accentMap[accent]}`}
            aria-hidden
          />
          <span>
            <span className="font-medium text-slate-200">Step {i + 1}.</span> {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

type StatePathProps = {
  steps: { state: string; label: string; description: string }[];
};

export function NandiStatePath({ steps }: StatePathProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={`${step.state}-${i}`} className="relative pl-8">
          {i < steps.length - 1 && (
            <span
              className="absolute left-[11px] top-8 h-[calc(100%+4px)] w-px bg-amber-400/40"
              aria-hidden
            />
          )}
          <span
            className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/10 text-[10px] font-bold text-amber-200"
            aria-hidden
          >
            {i + 1}
          </span>
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3">
            <p className="font-mono text-xs text-amber-200/90">{step.state}</p>
            <p className="mt-1 font-medium text-slate-100">{step.label}</p>
            <p className="mt-1 text-sm text-slate-400">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkflowBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
      <ArrowRight size={14} className="rotate-180" />
      {label}
    </Link>
  );
}
