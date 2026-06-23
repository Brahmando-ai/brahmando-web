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
    <div className={`relative ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-300/15 bg-slate-100 text-sm text-slate-600"
          style={{ minHeight }}
        >
          Loading Abhyas practice…
        </div>
      )}
      <iframe
        src={src}
        title="Abhyas CBSE Class 10 — practice and mock exam"
        className="w-full rounded-2xl border border-slate-300/15 bg-white"
        style={{ minHeight, height: "92vh", maxHeight: "1200px" }}
        allow="clipboard-write"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
