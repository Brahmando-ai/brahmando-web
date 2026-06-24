"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type BuildSnapshot,
  type IntakeDraft,
  confirmIntakeDraft,
  educationAdminHeaders,
  parseIntakeDraft,
  skuBuildStatusUrl,
} from "@/lib/education/educationApi";

const POLL_MS = 800;

const STEP_ICON: Record<string, string> = {
  pending: "○",
  running: "◉",
  done: "✓",
  error: "✕",
  skipped: "—",
};

type WizardPhase = "define" | "verify" | "build" | "done";

type Props = {
  adminKey: string;
  onCreated?: (skuId: string) => void;
};

export function MicroserviceCreateWizard({ adminKey, onCreated }: Props) {
  const [phase, setPhase] = useState<WizardPhase>("define");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<IntakeDraft | null>(null);
  const [build, setBuild] = useState<BuildSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const workflowUi = [
    { id: "define", label: "1. Define", active: phase === "define" },
    { id: "verify", label: "2. Verify", active: phase === "verify" },
    { id: "build", label: "3. Build", active: phase === "build" || phase === "done" },
  ];

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
          setLoading(false);
          if (snap.status === "done") {
            setPhase("done");
            setMessage(`Microservice ${snap.skuId} built successfully.`);
            onCreated?.(snap.skuId);
          } else {
            setMessage(snap.error || "Build failed");
          }
        }
      } catch (e) {
        stopPolling();
        setLoading(false);
        setMessage(String(e));
      }
    },
    [adminKey, onCreated, stopPolling]
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  useEffect(() => {
    if (logRef.current && build?.events?.length) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [build?.events?.length]);

  async function handleParse() {
    if (!name.trim() || prompt.trim().length < 10) {
      setMessage("Enter a name and a brief of at least 10 characters.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const d = await parseIntakeDraft(adminKey, name.trim(), prompt.trim());
      setDraft(d);
      setPhase("verify");
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmBuild() {
    if (!draft?.draftId) return;
    if (!draft.valid && draft.errors.length) {
      setMessage(draft.errors.join(" "));
      return;
    }
    setLoading(true);
    setMessage("");
    setBuild(null);
    stopPolling();
    setPhase("build");
    try {
      const snap = await confirmIntakeDraft(adminKey, draft.draftId);
      setBuild(snap);
      pollRef.current = setInterval(() => void pollBuild(snap.id), POLL_MS);
      void pollBuild(snap.id);
    } catch (e) {
      setLoading(false);
      setPhase("verify");
      setMessage(String(e));
    }
  }

  function reset() {
    stopPolling();
    setPhase("define");
    setDraft(null);
    setBuild(null);
    setMessage("");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/50 p-3">
        {workflowUi.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                step.active
                  ? "bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-500/40"
                  : phase === "done" || (i === 0 && phase !== "define")
                    ? "bg-emerald-500/10 text-emerald-200"
                    : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
            {i < workflowUi.length - 1 && <span className="text-slate-600">→</span>}
          </div>
        ))}
      </nav>

      {phase === "define" && (
        <section className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
          <h2 className="text-lg font-medium text-slate-100">New education microservice</h2>
          <p className="mt-2 text-sm text-slate-400">
            Describe the exam product in plain language. The platform will generate a SKU manifest, scaffold a module,
            and run the build pipeline — no new HTML required.
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="ms-name" className="block text-xs font-medium uppercase text-slate-500">
                Microservice name
              </label>
              <input
                id="ms-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GRE GMAT Prep Suite"
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <label htmlFor="ms-prompt" className="block text-xs font-medium uppercase text-slate-500">
                Product brief
              </label>
              <textarea
                id="ms-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                placeholder={`Example:\nGRE and GMAT prep for US students.\nDomains: Verbal Reasoning, Quantitative, Analytical Writing.\nOfficial sources: ets.org, mba.com\nFeatures: mock tests, study room, forum.`}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed text-slate-200"
              />
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleParse()}
              className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {loading ? "Parsing…" : "Parse & verify manifest"}
            </button>
          </div>
        </section>
      )}

      {phase === "verify" && draft && (
        <section className="space-y-5">
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-5">
            <h2 className="font-medium text-amber-100">Verify before build</h2>
            <p className="mt-1 text-sm text-slate-400">
              Review the generated manifest. Fix the brief and re-parse if anything looks wrong.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard label="SKU id" value={draft.skuId} />
            <SummaryCard label="Display name" value={draft.summary.displayName} />
            <SummaryCard label="Edge path" value={draft.summary.edgePath} />
            <SummaryCard label="Locale / currency" value={`${draft.summary.locale} · ${draft.summary.currency}`} />
            <SummaryCard label="Providers" value={draft.summary.providers.join(", ") || "—"} />
            <SummaryCard label="Knowledge collection" value={draft.summary.knowledgeCollection} />
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Domains ({draft.summary.domainCount})</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {draft.summary.domains.map((d) => (
                <li key={d} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {d}
                </li>
              ))}
            </ul>
            {draft.summary.features.length > 0 && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Features enabled</p>
                <p className="mt-1 text-sm text-slate-300">{draft.summary.features.join(", ")}</p>
              </>
            )}
          </div>

          {(draft.warnings.length > 0 || draft.errors.length > 0) && (
            <div className="space-y-2 text-sm">
              {draft.errors.map((e) => (
                <p key={e} className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-red-300">
                  {e}
                </p>
              ))}
              {draft.warnings.map((w) => (
                <p key={w} className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-amber-200">
                  {w}
                </p>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-700/50 bg-slate-900/40">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">
              Manifest YAML preview
            </summary>
            <pre className="max-h-64 overflow-auto border-t border-slate-700 p-4 font-mono text-xs text-slate-400">
              {draft.yaml}
            </pre>
          </details>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setPhase("define");
                setDraft(null);
              }}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              ← Edit brief
            </button>
            <button
              type="button"
              disabled={loading || draft.errors.length > 0}
              onClick={() => void handleConfirmBuild()}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
            >
              {loading ? "Starting build…" : "Confirm & start build"}
            </button>
          </div>
        </section>
      )}

      {(phase === "build" || phase === "done") && (
        <section className="rounded-xl border border-emerald-500/25 bg-slate-900/60 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-medium text-emerald-100">
              {phase === "done" ? "Build complete" : "Building microservice"}
            </h2>
            {build && (
              <span className="text-xs text-slate-400">
                {build.skuId} · {build.status} · {build.percent}%
              </span>
            )}
          </div>

          {draft?.workflow && (
            <ol className="mb-5 grid gap-2 sm:grid-cols-5">
              {draft.workflow.map((w) => {
                const buildDone = phase === "done";
                const active =
                  w.id === "build" || w.id === "scaffold"
                    ? phase === "build" && !buildDone
                    : buildDone && (w.id === "complete" || w.id === "define" || w.id === "verify");
                return (
                  <li
                    key={w.id}
                    className={`rounded-lg px-2 py-2 text-xs ${
                      active ? "bg-emerald-500/15 text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    <span className="font-medium">{w.label}</span>
                    <p className="mt-0.5 text-[10px] opacity-80">{w.description}</p>
                  </li>
                );
              })}
            </ol>
          )}

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
                    {step.detail && <span className="ml-2 text-xs text-slate-500">{step.detail}</span>}
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
              <div
                key={`${ev.ts}-${i}`}
                className={ev.level === "error" ? "text-red-400" : ev.level === "success" ? "text-emerald-400" : ""}
              >
                <span className="text-slate-600">{ev.ts.slice(11, 19)}</span> {ev.message}
              </div>
            ))}
            {loading && !build?.events?.length && <div className="text-slate-500">Waiting for build events…</div>}
          </div>

          {phase === "done" && (
            <button type="button" onClick={reset} className="mt-4 text-sm text-cyan-400 hover:underline">
              Create another microservice
            </button>
          )}
        </section>
      )}

      {message && (
        <p className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">{message}</p>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-200 break-all">{value}</p>
    </div>
  );
}
