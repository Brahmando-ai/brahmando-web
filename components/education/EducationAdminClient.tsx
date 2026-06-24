"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  EDUCATION_API_BASE,
  STATIC_MANIFEST_INDEX,
  educationAdminHeaders,
  skuGenerateUrl,
  staticManifestYamlUrl,
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

const ADMIN_KEY_STORAGE = "brahmando_admin_key";

export function EducationAdminClient() {
  const [tab, setTab] = useState<"studio" | "review">("studio");
  const [adminKey, setAdminKey] = useState("");
  const [skus, setSkus] = useState<SkuSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [yaml, setYaml] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (saved) setAdminKey(saved);
  }, []);

  const loadSkus = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(STATIC_MANIFEST_INDEX);
      if (!res.ok) throw new Error("Manifest index not found — run npm run prebuild");
      const data = await res.json();
      const list: SkuSummary[] = data.skus || [];
      setSkus(list);
      setSelected((cur) => cur ?? list[0]?.id ?? null);
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadManifest = useCallback(async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(staticManifestYamlUrl(id));
      if (!res.ok) throw new Error(`Manifest ${id} not found`);
      setYaml(await res.text());
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSkus();
  }, [loadSkus]);

  useEffect(() => {
    if (selected) loadManifest(selected);
  }, [selected, loadManifest]);

  useEffect(() => {
    if (adminKey) sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
  }, [adminKey]);

  async function runGenerate() {
    if (!selected) return;
    if (!adminKey) {
      setMessage("Enter your EDUCATION_ADMIN_KEY to run generate on the API server.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(skuGenerateUrl(selected), {
        method: "POST",
        headers: educationAdminHeaders(adminKey),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || `HTTP ${res.status}`);
      const lines = (data.log || []).join("\n");
      const cov = data.coverage?.summary;
      setMessage(
        `Generated ${selected} via ${EDUCATION_API_BASE}\n\n${lines}\n\n` +
          (cov ? `Coverage: ${cov.totalSkills} skills tracked\n` : "") +
          (data.written?.length ? `\nWritten:\n${data.written.join("\n")}` : "")
      );
    } catch (e) {
      setMessage(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Platform admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-100">Education SKU Studio</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Manifests ship with this site (static). Generate runs on{" "}
          <code className="text-cyan-300/90">{EDUCATION_API_BASE}</code> with your admin key — same key as{" "}
          <a
            href={`${EDUCATION_API_BASE}/widget/admin-practice.html`}
            className="text-cyan-300 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Practice Studio Admin
          </a>
          .
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-700/60 bg-slate-900/50 p-4">
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
          EDUCATION_ADMIN_KEY
        </label>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Same secret as GitHub → Settings → Secrets → EDUCATION_ADMIN_KEY"
          className="mt-2 w-full max-w-lg rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200"
        />
        <p className="mt-2 text-xs text-slate-500">
          Stored in this browser tab only (sessionStorage). Required for Generate — not sent to GitHub Pages.
        </p>
      </div>

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
                    onClick={() => setSelected(s.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selected === s.id ? "bg-emerald-500/15 text-emerald-100" : "text-slate-300 hover:bg-slate-800"}`}
                  >
                    <span className="font-medium">{s.displayName}</span>
                    <span className="ml-2 text-xs text-slate-500">{s.status}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={loadSkus} className="mt-3 w-full text-xs text-cyan-400 hover:underline">
              Refresh list
            </button>
          </aside>

          <section className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-medium text-slate-200">{selected || "Select a SKU"}</h2>
              <button
                type="button"
                disabled={!selected || loading || !adminKey}
                onClick={runGenerate}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
              >
                Generate on API
              </button>
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Edit source in repo <code className="text-cyan-300/80">config/sku/{selected}.yaml</code> — rebuild site
              to refresh view.
            </p>
            <textarea
              readOnly
              value={yaml}
              rows={28}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-300"
              spellCheck={false}
            />
          </section>
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
            Crawl → Review Queue → Approved → Qdrant. Nothing enters the student corpus without approval.
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
      {loading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
    </div>
  );
}
