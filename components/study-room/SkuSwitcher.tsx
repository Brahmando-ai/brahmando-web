"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StudySkuId } from "@/lib/study-room/types";
import { SKU_INSTANCES, studyRoomHref } from "@/lib/study-room/skuInstances";

const ORDER: StudySkuId[] = ["cbse10-core", "sat-act"];

export function SkuSwitcher({ activeSku }: { activeSku: StudySkuId }) {
  const pathname = usePathname();
  const path = pathname || "/study-room";

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {ORDER.map((sku) => {
        const inst = SKU_INSTANCES[sku];
        const href = studyRoomHref(sku, path.split("?")[0]);
        const active = sku === activeSku;
        return (
          <Link
            key={sku}
            href={href}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                : "border-slate-600/40 text-slate-400 hover:border-slate-500/50 hover:text-slate-200"
            }`}
          >
            {inst.displayName}
          </Link>
        );
      })}
    </div>
  );
}
