"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  Filter,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import {
  facetOptions,
  getKnowledgeTaxonomy,
  type KnowledgeFilters,
  type KnowledgeHit,
  type TaxonomyResponse,
  searchKnowledge,
} from "@/lib/education-api";

const FILTER_GROUPS: { key: keyof KnowledgeFilters; label: string }[] = [
  { key: "syllabus_board", label: "Syllabus / Board" },
  { key: "competitive_track", label: "Competitive track" },
  { key: "subject", label: "Subject" },
  { key: "exam_body", label: "Exam body" },
];

function MetaChip({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-slate-600/50 bg-slate-800/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200/90">
      {label}
    </span>
  );
}

function hitMeta(hit: KnowledgeHit): string[] {
  return [
    hit.exam_body,
    hit.competitive_track,
    hit.subject,
    hit.syllabus_board,
    hit.exam_year ? String(hit.exam_year) : null,
  ].filter(Boolean) as string[];
}

export function KnowledgeExplorer() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyResponse | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<KnowledgeFilters>({});
  const [results, setResults] = useState<KnowledgeHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getKnowledgeTaxonomy()
      .then(setTaxonomy)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load taxonomy"))
      .finally(() => setBootLoading(false));
  }, []);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== false).length,
    [filters]
  );

  function setFilter(key: keyof KnowledgeFilters, value: string) {
    setFilters((prev) => {
      const next = { ...prev };
      if (!value) delete next[key];
      else next[key] = value as never;
      return next;
    });
  }

  function clearFilters() {
    setFilters({});
  }

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchKnowledge(query.trim(), filters);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Education Portal · Knowledge base
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-100">Browse & search</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Filter by syllabus (CBSE, ICSE), grade, board exams, competitive tracks (Medical,
            Engineering, Civil Services…), and subject — then run natural-language search across
            ingested past papers and guides.
          </p>
        </div>
        <Link href="/education/studio" className="btn-secondary inline-flex items-center gap-2 text-sm">
          Open Education Studio
          <ArrowRight size={14} />
        </Link>
      </div>

      {taxonomy?.dataset_notes?.current_corpus && (
        <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
          <strong className="text-amber-200">Corpus today:</strong> {taxonomy.dataset_notes.current_corpus}{" "}
          CBSE/ICSE filters are ready — add those PDFs to the knowledge folder to populate them.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Filters */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Filter size={14} /> Categories
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-cyan-300">{activeFilterCount}</span>
                )}
              </p>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-300">
                  Clear
                </button>
              )}
            </div>

            {bootLoading ? (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Loading taxonomy…
              </p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {FILTER_GROUPS.map(({ key, label }) => {
                  const options = facetOptions(taxonomy, key);
                  if (!options.length) return null;
                  return (
                    <label key={key} className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
                      <select
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                        value={(filters[key] as string) ?? ""}
                        onChange={(e) => setFilter(key, e.target.value)}
                      >
                        <option value="">Any</option>
                        {options.map(({ value, count }) => (
                          <option key={value} value={value}>
                            {value}
                            {count ? ` (${count})` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Search + results */}
        <div className="lg:col-span-8">
          <form
            onSubmit={runSearch}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 sm:p-6"
          >
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Search size={14} /> Natural language search
              </span>
              <textarea
                className="w-full rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
                rows={3}
                placeholder="e.g. thermodynamics questions in UPSC Chemistry 2024, or RBI Grade B reasoning patterns…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button type="submit" disabled={loading || !query.trim()} className="btn-primary mt-4 inline-flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Search knowledge base
            </button>
            {error && (
              <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </form>

          <div className="mt-6">
            {!searched && (
              <div className="rounded-xl border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-500">
                <BookMarked className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                Pick filters, describe what you need in plain English, and search.
              </div>
            )}

            {searched && !loading && results.length === 0 && (
              <p className="text-sm text-slate-500">No matches — try broader filters or different wording.</p>
            )}

            <ul className="space-y-4">
              {results.map((hit, i) => (
                <li
                  key={`${hit.source}-${hit.chunk ?? i}`}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-cyan-200">{hit.source}</p>
                    <span className="text-xs text-slate-500">score {(hit.score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {hitMeta(hit).map((m) => (
                      <MetaChip key={m} label={m} />
                    ))}
                  </div>
                  <p className="line-clamp-5 text-sm leading-relaxed text-slate-300">{hit.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
