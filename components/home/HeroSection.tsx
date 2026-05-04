import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-20">
      <div aria-hidden className="mesh-bg pointer-events-none absolute inset-0 opacity-25" />
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -right-12 top-24 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="animate-rise mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5">
            <Sparkles size={14} className="text-cyan-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
              A Brahmexa group brand
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
            ManjuLAB R&D, catalogued in Brahmando.
            <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-cyan-300 to-orange-300 bg-clip-text text-transparent">
              Access through ManjuLAB.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Brahmando is the repository where ManjuLAB hosts agents, MCP servers, and workflows for
            customers and for community partners — not a public self-serve marketplace.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/access#customer" className="btn-primary text-base">
              Request Customer Access
              <ArrowRight size={16} />
            </Link>
            <Link href="/access#community" className="btn-secondary text-base">
              Community Access Program
            </Link>
          </div>
        </div>

        <div className="animate-rise mt-12 grid gap-4 rounded-3xl border border-slate-300/20 bg-slate-900/45 p-5 backdrop-blur-xl sm:grid-cols-3">
          {[
            ["120+", "R&D assets"],
            ["4", "Catalog categories"],
            ["2", "Access tiers: customer + community"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-slate-300/15 bg-slate-900/50 p-4 text-left">
              <p className="text-2xl font-bold text-cyan-200">{value}</p>
              <p className="mt-1 text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </div>

        <PartnerLogosBar variant="hero" className="mt-10" />
      </div>
    </section>
  );
}
