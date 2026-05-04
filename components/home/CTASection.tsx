import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-r from-cyan-400/20 via-slate-900/50 to-orange-400/20 p-10 text-center backdrop-blur-xl sm:p-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl">
            Engage ManjuLAB to access the Brahmando repository
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
            Enterprise customers license ManjuLAB delivery and receive access to Brahmando assets.
            Under-resourced organisations may qualify for the community access program at no cost.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/access#customer" className="btn-primary">
              Talk to ManjuLAB <ArrowRight size={16} />
            </Link>
            <Link href="/access#community" className="btn-secondary">
              Community Access Program
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
