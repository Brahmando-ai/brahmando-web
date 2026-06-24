"use client";

import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { validateAdminKey } from "@/lib/education/educationApi";

type Props = {
  onAuthenticated: (adminKey: string) => void;
};

export function EducationAdminGate({ onAuthenticated }: Props) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError("Enter your admin token.");
      return;
    }
    setChecking(true);
    setError("");
    try {
      const ok = await validateAdminKey(trimmed);
      if (!ok) {
        setError("Invalid token. Check EDUCATION_ADMIN_KEY in GitHub Secrets.");
        return;
      }
      onAuthenticated(trimmed);
    } catch {
      setError("Could not reach the education API. Try again in a moment.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Restricted</p>
            <h1 className="text-lg font-semibold text-slate-100">Education Platform Admin</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          This area is not public. Enter your platform admin token to continue. The token is verified against{" "}
          <code className="text-cyan-300/90">api.brahmando.com</code> and stored only in this browser tab.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="admin-token" className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Admin token
            </label>
            <input
              id="admin-token"
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="EDUCATION_ADMIN_KEY"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm text-slate-200"
            />
          </div>
          {error && (
            <p className="flex items-start gap-2 text-sm text-red-400">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={checking}
            className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {checking ? "Verifying…" : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">Not indexed · not linked from public pages</p>
      </div>
    </div>
  );
}
