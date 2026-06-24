"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, BookOpen, FileText } from "lucide-react";
import { normalizeSkuId, studyRoomHref } from "@/lib/study-room/skuInstances";

export function StudyRoomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sku = normalizeSkuId(searchParams.get("sku"));

  const tabs = [
    { href: studyRoomHref(sku, "/study-room"), label: "Study Room", icon: BookOpen, exact: true },
    { href: studyRoomHref(sku, "/study-room/progress"), label: "My Progress", icon: BarChart3, exact: false },
    { href: studyRoomHref(sku, "/study-room/reports"), label: "Reports", icon: FileText, exact: false },
  ];

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-700/40 pb-4">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const pathOnly = href.split("?")[0];
        const isActive = exact ? pathname === pathOnly : pathname.startsWith(pathOnly);

        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                : "border-slate-600/40 text-slate-400 hover:border-slate-500/50 hover:text-slate-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
