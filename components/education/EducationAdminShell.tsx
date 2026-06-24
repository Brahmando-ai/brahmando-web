"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { EducationAdminClient } from "@/components/education/EducationAdminClient";
import { EducationAdminGate } from "@/components/education/EducationAdminGate";
import { validateAdminKey } from "@/lib/education/educationApi";

const ADMIN_KEY_STORAGE = "brahmando_admin_key";
const ADMIN_VERIFIED_STORAGE = "brahmando_admin_verified";

export function EducationAdminShell() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    sessionStorage.removeItem(ADMIN_VERIFIED_STORAGE);
    setAdminKey(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      const saved = sessionStorage.getItem(ADMIN_KEY_STORAGE);
      const verified = sessionStorage.getItem(ADMIN_VERIFIED_STORAGE) === "1";
      if (!saved || !verified) {
        if (!cancelled) setBooting(false);
        return;
      }
      try {
        const ok = await validateAdminKey(saved);
        if (!cancelled) {
          if (ok) setAdminKey(saved);
          else signOut();
          setBooting(false);
        }
      } catch {
        if (!cancelled) {
          signOut();
          setBooting(false);
        }
      }
    }
    void restore();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  function handleAuthenticated(key: string) {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    sessionStorage.setItem(ADMIN_VERIFIED_STORAGE, "1");
    setAdminKey(key);
  }

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-500">
        Checking session…
      </div>
    );
  }

  if (!adminKey) {
    return <EducationAdminGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="mesh-bg relative z-10 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-300/10 bg-slate-950/50 px-4 py-3 sm:px-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Education Portal
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
      <EducationAdminClient adminKey={adminKey} />
    </div>
  );
}
