import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";

const stats = [
  { value: "9",  label: "AI agents" },
  { value: "5",  label: "MCP servers" },
  { value: "5",  label: "Agentic workflows" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-28 pt-22 sm:pt-28">
      {/* Sacred geometry grid */}
      <div aria-hidden className="mesh-bg pointer-events-none absolute inset-0 opacity-30" />

      {/* Central divine aureole — light breaking through from above */}
      <div
        aria-hidden
        className="divine-glow pointer-events-none absolute inset-x-0 -top-28 mx-auto h-[560px] w-[900px] rounded-[50%] blur-[110px]"
      />

      {/* Ambient side orbs */}
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -left-44 top-36 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--glow-1)" }}
      />
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -right-24 top-28 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--glow-2)", animationDelay: "2.5s" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="animate-rise mx-auto max-w-4xl text-center">

          {/* Eyebrow badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ border: "1px solid var(--border)", background: "var(--accent-dim)" }}
          >
            <Sparkles size={12} style={{ color: "var(--accent)" }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              A Brahmexa Group Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl lg:text-[5.5rem] lg:leading-[1.04]">
            Intelligence for
            <br />
            <span className="text-gradient">every gap.</span>
          </h1>

          {/* Sub-heading */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Where human capability ends, Brahmando begins. A curated intelligence
            repository — AI agents, MCP servers, agentic workflows, and frameworks
            engineered to fill every gap in what enterprise can do today.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/access#customer" className="btn-primary">
              Request Enterprise Access
              <ArrowRight size={15} />
            </Link>
            <Link href="/agents" className="btn-secondary">
              Explore the Catalog
            </Link>
          </div>
        </div>

        {/* Metric strip */}
        <div
          className="animate-rise mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl"
          style={{ background: "var(--border)" }}
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="px-4 py-6 text-center backdrop-blur-xl"
              style={{ background: "var(--panel)" }}
            >
              <p
                className="text-3xl font-bold tabular-nums"
                style={{ color: "var(--accent)" }}
              >
                {value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 section-rule" />
        <PartnerLogosBar variant="hero" showTopRule={false} className="mt-8" />
      </div>
    </section>
  );
}
