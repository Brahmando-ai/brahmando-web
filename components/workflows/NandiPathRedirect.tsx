"use client";

import { useEffect } from "react";

export function NandiPathRedirect({ pathId }: { pathId: string }) {
  useEffect(() => {
    const mapped =
      pathId === "errored-to-pass-via-in-progress" ? "errored-to-pass" : pathId;
    window.location.replace(`/workflows/nandi/#scenario-${mapped}`);
  }, [pathId]);

  return <p className="py-16 text-center text-sm text-slate-400">Redirecting to ticket board…</p>;
}
