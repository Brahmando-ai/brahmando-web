import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { branding } from "@/lib/branding";

export function AboutSection() {
  return (
    <section className="py-24" id="about">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Prose column */}
          <div>
            <h2 className="section-title">Brahmexa, ManjuLAB &amp; Brahmando</h2>
            <p className="mt-5 leading-relaxed text-slate-400">
              <strong className="text-slate-200">{branding.groupBrand}</strong> is the umbrella
              group brand. A portfolio of operating companies builds and delivers AI products and
              services under that brand, each with a distinct mandate and customer focus.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              <strong className="text-slate-200">{branding.developer}</strong> is the
              customer-facing operating company within the group: it carries P&amp;L responsibility,
              engages enterprise clients, and authors the agents, MCP servers, and workflows that
              appear in the Brahmando repository. Access to the full catalog — including deployment
              guides and integration support — is available through ManjuLAB commercial agreements
              or the community access program.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              <strong className="text-slate-200">{branding.host}</strong> is the Brahmexa group
              surface that <em>hosts</em> ManjuLAB-developed assets. Brahmando and ManjuLAB are
              peers within the group — not a parent and subsidiary. The repository is a curated,
              access-gated catalog, not an open public marketplace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={branding.companySite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Visit ManjuLAB
              </a>
              <Link href="/#about" className="btn-secondary inline-flex">
                Brahmexa group
              </Link>
              <Link href="/access" className="btn-secondary inline-flex items-center gap-1">
                Request access
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Brand hierarchy card */}
          <div
            className="flex flex-col gap-4 rounded-2xl p-6"
            style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
          >
            {/* Brahmexa top card */}
            <div className="rounded-xl bg-gradient-to-r from-amber-500/90 to-amber-400/90 px-5 py-4 text-stone-900">
              <div className="mb-3 flex min-h-[36px] items-center">
                <Image
                  src={branding.logos.brahmexa.wordmark}
                  alt={`${branding.groupBrand} logo`}
                  width={160}
                  height={36}
                  className="h-7 w-auto max-w-[min(200px,55%)] object-contain object-left"
                />
              </div>
              <p className="font-bold">{branding.groupBrand}</p>
              <p className="text-sm opacity-80">Group brand · {branding.groupBrandTagline}</p>
            </div>

            {/* Member cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white px-4 py-4 text-slate-900">
                <div className="mb-3 flex min-h-[36px] items-center">
                  <Image
                    src={branding.logos.manjulab.wordmark}
                    alt={`${branding.developer} logo`}
                    width={150}
                    height={36}
                    className="h-7 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold text-sm">{branding.developer}</p>
                <p className="text-xs opacity-70 leading-snug">Operating co. · P&amp;L · manjulab.com</p>
              </div>
              <div className="rounded-xl px-4 py-4" style={{ background: "var(--accent-dim)", border: "1px solid var(--border)" }}>
                <div className="mb-3 flex min-h-[36px] items-center">
                  <Image
                    src={branding.logos.brahmando.wordmark}
                    alt={`${branding.host} logo`}
                    width={150}
                    height={36}
                    className="h-7 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold text-sm text-slate-200">{branding.host}</p>
                <p className="text-xs leading-snug text-slate-400">Repository · brahmando.com</p>
              </div>
              <div
                className="rounded-xl px-4 py-4"
                style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
              >
                <p className="font-bold text-sm text-slate-300">Other group companies</p>
                <p className="mt-1 text-xs leading-snug text-slate-500">Additional Brahmexa members — names on request</p>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-600">
              <span className="text-slate-400">{branding.developer}</span>
              <span className="mx-2 text-slate-600">→</span>
              <span className="text-slate-400">{branding.host}</span>
              <span className="mx-1 text-slate-600">·</span>
              <span style={{ color: "var(--accent)" }} className="opacity-70">both within {branding.groupBrand}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
