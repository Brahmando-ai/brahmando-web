"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EDUCATION_API_BASE,
  type BuildSnapshot,
  educationAdminHeaders,
  skuBuildStatusUrl,
  skuBuildUrl,
  skuManifestUrl,
  skuManifestsUrl,
} from "@/lib/education/educationApi";

type SkuSummary = { id: string; displayName: string; status: string };

type ReviewItem = {
  id: string;
  title: string;
  sourceChain: string[];
  authority: number;
  finalScore: number;
  status: string;
};

const POLL_MS = 800;

const STEP_ICON: Record<string, string> = {
  pending: "○",
  running: "◉",
  done: "✓",
  error: "✕",
  skipped: "—",
};

type Props = {
  adminKey: string;
};

export function EducationAdminClient({ adminKey }: Props) {
  const [tab, setTab] = useState<"studio" | "review">("studio");
  const [adminKey, setAdminKey] = useState("");
  const [skus, setSkus] = useState<SkuSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [yaml, setYaml] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [build, setBuild] = useState<BuildSnapshot | null>(null);
  const [building, setBuilding] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [reviewItems] = useState<ReviewItem[]>([
    {
      id: "ko-demo-001",
      title: "Life Processes — NCERT overview",
      sourceChain: ["NCERT", "CBSE Official"],
      authority: 100,
      finalScore: 95,
      status: "pending",
    },
    {
      id: "ko-demo-002",
      title: "SAT Inference — Khan Academy strategy",
      sourceChain: ["Khan Academy", "YouTube-Transcript"],
      authority: 95,
      finalScore: 88,
      status: "pending",
    },
  ]);

  const loadSkus = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(skuManifestsUrl(), { headers: educationAdminHeaders(adminKey) });
      if (res.status === 403) throw new Error("Session expired — sign in again.");
      if (!res.ok) throw new Error(`Could not load manifests (HTTP ${res.status})`);
      const data = await res.json();
      const list: SkuSummary[] = data.skus || [];
      setSkus(list);
      setSelected((cur) => cur ?? list[0]?.id ?? null);
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const loadManifest = useCallback(async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(skuManifestUrl(id), { headers: educationAdminHeaders(adminKey) });
      if (res.status === 403) throw new Error("Session expired — sign in again.");
      if (!res.ok) throw new Error(`Manifest ${id} not found (HTTP ${res.status})`);
      const data = await res.json();
      setYaml(data.yaml || "");
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void loadSkus();
  }, [loadSkus]);

  useEffect(() => {
    if (selected) void loadManifest(selected);
  }, [selected, loadManifest]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollBuild = useCallback(
    async (buildId: string) => {
      try {
        const res = await fetch(skuBuildStatusUrl(buildId), {
          headers: educationAdminHeaders(adminKey),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `HTTP ${res.status}`);
        }
        const snap: BuildSnapshot = await res.json();
        setBuild(snap);
        if (snap.status === "done" || snap.status === "error") {
          stopPolling();
          setBuilding(false);
          if (snap.status === "done") {
            setMessage(`Build finished for ${snap.skuId}. ${snap.result?.written?.length ?? 0} files written on API server.`);
          } else {
            setMessage(snap.error || "Build failed");
          }
        }
      } catch (e) {
        stopPolling();
        setBuilding(false);
        setMessage(String(e));
      }
    },
    [adminKey, stopPolling]
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (logRef.current && build?.events?.length) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [build?.events?.length]);

  async function startBuild() {
    if (!selected) return;
    setBuilding(true);
    setMessage("");
    setBuild(null);
    stopPolling();
    try {
      const res = await fetch(skuBuildUrl(selected), {
        method: "POST",
        headers: educationAdminHeaders(adminKey),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || `HTTP ${res.status}`);
      setBuild(data);
      pollRef.current = setInterval(() => void pollBuild(data.id), POLL_MS);
      void pollBuild(data.id);
    } catch (e) {
      setBuilding(false);
      setMessage(String(e));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Platform admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-100">Education SKU Studio</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Build manifest-driven exam products (SAT/ACT, CBSE10, …) on the education API. No exam-specific HTML —
          the manifest drives curriculum, crawler seeds, and portal config.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-5">
        <h2 className="text-sm font-semibold text-cyan-100">How this page works</h2>
        <ol className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <li className="rounded-lg bg-slate-900/50 p-3">
            <span className="font-medium text-emerald-300">1. View manifest</span>
            <p className="mt-1 text-xs text-slate-400">
              Left: pick a SKU. Center: YAML loaded from the API using your verified token (source of truth:{" "}
              <code className="text-cyan-300/80">config/sku/*.yaml</code> in the Brahmando repo).
            </p>
          </li>
          <li className="rounded-lg bg-slate-900/50 p-3">
            <span className="font-medium text-emerald-300">2. Start build</span>
            <p className="mt-1 text-xs text-slate-400">
              Runs on <code className="text-cyan-300/80">{EDUCATION_API_BASE}</code> with your admin key.
              Exports curriculum, taxonomy, crawler seeds, coverage — for SAT/ACT also crawls official PDFs.
            </p>
          </li>
          <li className="rounded-lg bg-slate-900/50 p-3">
            <span className="font-medium text-emerald-300">3. Watch progress</span>
            <p className="mt-1 text-xs text-slate-400">
              Step checklist + live log below update every ~{POLL_MS}ms while the microservice builds.
              Review Queue tab is for human approval before content enters Qdrant.
            </p>
          </li>
        </ol>
      </section>

      <div className="mb-6 flex gap-2 border-b border-slate-700/50 pb-2">
        <button
          type="button"
          onClick={() => setTab("studio")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "studio" ? "bg-cyan-500/20 text-cyan-100" : "text-slate-400 hover:text-slate-200"}`}
        >
          SKU Studio
        </button>
        <button
          type="button"
          onClick={() => setTab("review")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "review" ? "bg-cyan-500/20 text-cyan-100" : "text-slate-400 hover:text-slate-200"}`}
        >
          Review Queue
        </button>
      </div>

      {tab === "studio" && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">SKUs</p>
            <ul className="space-y-1">
              {skus.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(s.id);
                      setBuild(null);
                      setMessage("");
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selected === s.id ? "bg-emerald-500/15 text-emerald-100" : "text-slate-300 hover:bg-slate-800"}`}
                  >
                    <span className="font-medium">{s.displayName}</span>
                    <span className="ml-2 text-xs text-slate-500">{s.status}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => void loadSkus()} className="mt-3 w-full text-xs text-cyan-400 hover:underline">
              Refresh list
            </button>
          </aside>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium text-slate-200">{selected || "Select a SKU"}</h2>
                <button
                  type="button"
                  disabled={!selected || building}
                  onClick={() => void startBuild()}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
                >
                  {building ? "Building…" : "Start build on API"}
                </button>
              </div>
              <p className="mb-3 text-xs text-slate-500">
                Manifest YAML from API (read-only). Edit in Brahmando repo, redeploy education-portal to refresh.
              </p>
              <textarea
                readOnly
                value={yaml}
                rows={14}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-300"
                spellCheck={false}
              />
            </section>

            {(building || build) && (
              <section className="rounded-xl border border-emerald-500/25 bg-slate-900/60 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-emerald-100">Live build progress</h3>
                  {build && (
                    <span className="text-xs text-slate-400">
                      {build.status} · {build.percent}%
                    </span>
                  )}
                </div>
                {build && (
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${build.percent}%` }}
                    />
                  </div>
                )}
                {build?.steps && (
                  <ul className="mb-4 space-y-2">
                    {build.steps.map((step) => (
                      <li
                        key={step.id}
                        className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm ${
                          step.status === "running" ? "bg-emerald-500/10 text-emerald-100" : "text-slate-300"
                        }`}
                      >
                        <span className="w-4 shrink-0 font-mono text-xs">{STEP_ICON[step.status] ?? "○"}</span>
                        <span className="flex-1">
                          <span className="font-medium">{step.label}</span>
                          {step.detail && (
                            <span className="ml-2 text-xs text-slate-500">{step.detail}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  ref={logRef}
                  className="max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-400"
                >
                  {(build?.events || []).map((ev, i) => (
                    <div key={`${ev.ts}-${i}`} className={ev.level === "error" ? "text-red-400" : ev.level === "success" ? "text-emerald-400" : ""}>
                      <span className="text-slate-600">{ev.ts.slice(11, 19)}</span> {ev.message}
                    </div>
                  ))}
                  {building && (!build?.events?.length) && (
                    <div className="text-slate-500">Waiting for first event…</div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {tab === "review" && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-medium text-slate-200">KnowledgeObject review queue</h2>
            <Link href="/education/review-material" className="text-sm text-cyan-300 hover:underline">
              Open full review board →
            </Link>
          </div>
          <p className="mb-4 text-sm text-slate-400">
            Demo rows only. Pipeline: Crawl → Review Queue → Approved → Qdrant. Nothing enters the student corpus
            without human approval.
          </p>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Provenance</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-800/80">
                  <td className="py-3 pr-4 text-slate-200">{item.title}</td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{item.sourceChain.join(" → ")}</td>
                  <td className="py-3 pr-4 text-slate-300">{item.finalScore}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-200">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {message && (
        <pre className="mt-6 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-4 text-xs text-slate-300 whitespace-pre-wrap">
          {message}
        </pre>
      )}
      {loading && !building && <p className="mt-4 text-sm text-slate-500">Loading manifest…</p>}
    </div>
  );
}
