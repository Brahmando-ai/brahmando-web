import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { branding } from "@/lib/branding";

export function AboutSection() {
  return (
    <section className="py-24" id="about">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="section-title">Brahmexa, ManjuLAB &amp; Brahmando</h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              <strong className="text-slate-100">{branding.groupBrand}</strong> is the umbrella group
              brand. A portfolio of operating companies builds and delivers AI products and services
              under that brand, each with its own mandate.
            </p>
            <p className="mt-4 leading-relaxed text-slate-300">
              <strong className="text-slate-100">{branding.developer}</strong> is one of those group
              companies: the customer-facing business with P&amp;L responsibility. ManjuLAB develops
              the agents, MCP servers, and workflows that appear in the Brahmando repository and
              offers them to enterprise customers or, through dedicated programs, at no cost to
              under-resourced communities.
            </p>
            <p className="mt-4 leading-relaxed text-slate-300">
              <strong className="text-slate-100">{branding.host}</strong> is another Brahmexa group
              surface: the repository that <em>hosts</em> ManjuLAB-developed assets. ManjuLAB and
              Brahmando are peers within the group; Brahmando is not a sub-brand of ManjuLAB. Access
              to deployment and full documentation is gated through ManjuLAB customer agreements or
              the community access program — not an open public marketplace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
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
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-300/20 bg-slate-900/45 p-6">
            <div className="rounded-2xl bg-gradient-to-r from-orange-400/90 to-orange-300/90 px-5 py-4 text-slate-900">
              <div className="mb-3 flex min-h-[40px] items-center">
                <Image
                  src={branding.logos.brahmexa.wordmark}
                  alt={`${branding.groupBrand} logo`}
                  width={160}
                  height={40}
                  className="h-8 w-auto max-w-[min(200px,55%)] object-contain object-left"
                />
              </div>
              <p className="font-bold">{branding.groupBrand}</p>
              <p className="text-sm opacity-90">Group brand · {branding.groupBrandTagline}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-100 px-4 py-4 text-slate-900">
                <div className="mb-3 flex min-h-[40px] items-center">
                  <Image
                    src={branding.logos.manjulab.wordmark}
                    alt={`${branding.developer} logo`}
                    width={160}
                    height={40}
                    className="h-8 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold">{branding.developer}</p>
                <p className="text-xs opacity-80 leading-snug">Operating co. · P&amp;L · manjulab.com</p>
              </div>
              <div className="rounded-2xl bg-cyan-400 px-4 py-4 text-slate-900">
                <div className="mb-3 flex min-h-[40px] items-center">
                  <Image
                    src={branding.logos.brahmando.wordmark}
                    alt={`${branding.host} logo`}
                    width={160}
                    height={40}
                    className="h-8 w-auto max-w-full object-contain object-left"
                  />
                </div>
                <p className="font-bold">{branding.host}</p>
                <p className="text-xs opacity-80 leading-snug">Repository · brahmando.com</p>
              </div>
              <div className="rounded-2xl border border-slate-500/40 bg-slate-800/80 px-4 py-4 text-slate-200">
                <p className="font-bold text-slate-100">Other group companies</p>
                <p className="text-xs text-slate-400 leading-snug">Additional Brahmexa members — names on request</p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              <span className="text-slate-400">{branding.developer}</span>
              {" "}
              <span className="text-cyan-500/80">develops &amp; contributes</span>
              {" "}
              <span className="text-slate-400">→ {branding.host}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
