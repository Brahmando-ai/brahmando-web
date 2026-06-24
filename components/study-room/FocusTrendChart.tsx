import type { FocusWeek } from "@/lib/study-room/mockProgressData";

type Props = {
  weeks: FocusWeek[];
  currentAvg: number;
  trend: "up" | "down" | "flat";
};

export function FocusTrendChart({ weeks, currentAvg, trend }: Props) {
  const max = Math.max(...weeks.map((w) => w.avg), 100);

  return (
    <div className="rounded-2xl border border-slate-300/20 bg-slate-900/55 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Concentration (focus score)
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-50">
            {currentAvg}
            <span className="text-lg font-normal text-slate-500">/100</span>
          </p>
        </div>
        <p className="text-sm text-slate-400">
          Trend{" "}
          {trend === "up" ? (
            <span className="font-medium text-emerald-400">improving ↑</span>
          ) : trend === "down" ? (
            <span className="font-medium text-red-400">declining ↓</span>
          ) : (
            <span className="text-slate-500">stable →</span>
          )}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3">
        {weeks.map((w) => (
          <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-cyan-200/90">{w.avg}</span>
            <div
              className="w-full max-w-[72px] rounded-t-lg bg-gradient-to-t from-cyan-600/80 to-cyan-400/60 transition-all"
              style={{ height: `${(w.avg / max) * 96 + 24}px` }}
              title={`${w.label}: ${w.avg}/100 · ${w.sessions} sessions`}
            />
            <span className="text-center text-[10px] leading-tight text-slate-500">{w.label}</span>
            {w.note && (
              <span className="text-center text-[9px] text-slate-600">{w.note}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
