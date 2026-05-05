import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
          style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
        >
          {/* Decorative glow behind the CTA */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-64 w-full rounded-full blur-3xl opacity-25"
            style={{ background: "var(--glow-1)" }}
          />

          <div className="relative">
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Close every capability gap
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
              Ready to close the gaps?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              Enterprise clients gain full access to the Brahmando catalog — including integration
              support and deployment services. Under-resourced organisations may qualify for our
              no-cost community access program.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/access#customer" className="btn-primary">
                Engage the Team
                <ArrowRight size={15} />
              </Link>
              <Link href="/access#community" className="btn-secondary">
                Community Access Program
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
