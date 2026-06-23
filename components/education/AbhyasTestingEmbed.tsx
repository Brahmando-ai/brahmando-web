"use client";

import { useState } from "react";
import { abhyasTestingEmbedUrl } from "@/lib/education/abhyasUrls";

type Props = {
  subject?: string;
  count?: number;
  mode?: "practice" | "mock_exam";
  minHeight?: string;
  className?: string;
};

export function AbhyasTestingEmbed({
  subject,
  count,
  mode,
  minHeight = "880px",
  className = "",
}: Props) {
  const src = abhyasTestingEmbedUrl({ subject, count, mode });
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`} style={{ minHeight }}>
      {!loaded && (
        <div className="flex items-center justify-center rounded-2xl border border-slate-300/15 bg-slate-900/50 py-24 text-sm text-slate-300">
          Loading Abhyas practice…
        </div>
      )}
      <iframe
        src={src}
        title="Abhyas CBSE Class 10 — practice and mock exam"
        className={`w-full rounded-2xl border border-slate-300/15 bg-white ${loaded ? "block" : "hidden"}`}
        style={{ minHeight, height: "92vh", maxHeight: "1200px" }}
        allow="clipboard-write"
        onLoad={() => setLoaded(true)}
      />
      {loaded && (
        <p className="mt-3 text-center text-xs text-slate-500">
          If the panel looks empty,{" "}
          <a href={src} className="text-cyan-300 hover:underline" target="_blank" rel="noopener noreferrer">
            open Abhyas in a new tab
          </a>
          .
        </p>
      )}
    </div>
  );
}
