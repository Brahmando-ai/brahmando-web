import type { ChapterStatus } from "@/lib/study-room/mockProgressData";
import { statusLabel } from "@/lib/study-room/mockProgressData";

export function ChapterStatusBadge({ status }: { status: ChapterStatus }) {
  const styles: Record<ChapterStatus, string> = {
    strong: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    needs_practice: "border-amber-400/35 bg-amber-400/10 text-amber-200",
    at_risk: "border-red-400/35 bg-red-400/10 text-red-200",
    stale: "border-slate-500/40 bg-slate-700/40 text-slate-400",
  };

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

export function MasteryBar({ pct, size = "md" }: { pct: number; size?: "sm" | "md" }) {
  const color =
    pct >= 70 ? "bg-emerald-400" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  const h = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className={`w-full overflow-hidden rounded-full bg-slate-700/60 ${h}`}>
      <div
        className={`${h} rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

export function TrendIndicator({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <span className="text-emerald-400">↑</span>;
  if (trend === "down") return <span className="text-red-400">↓</span>;
  return <span className="text-slate-500">→</span>;
}
