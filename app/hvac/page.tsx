import { HvacSupportPortal } from "@/components/hvac/HvacSupportPortal";

export default function HvacSupportPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-300/90">Brahmexa · HVAC</p>
          <h1 className="section-title mt-2">HVAC Support Portal</h1>
          <p className="section-subtitle max-w-3xl">
            Real queries against the HVAC knowledge base and Ollama on the Brahmando GPU cluster.
            Select equipment brand and model for specific units — generic questions work without them.
            When brand/model is not in our KB, OpenRouter may assist (HVAC-only).
            <strong className="text-slate-200"> L1</strong> remote steps for callers,{" "}
            <strong className="text-slate-200"> L2</strong> field technician guidance,{" "}
            <strong className="text-slate-200"> L3</strong> escalation with Nandi ticketing.
            Technicians can submit feedback after L2/L3 answers to improve the knowledge base.
          </p>
        </div>

        <HvacSupportPortal />

        <p className="mt-8 text-center text-xs text-slate-600">
          API: api.brahmando.com/hvac · Service port 8130 · Integrated with Nandi (8210)
        </p>
      </div>
    </div>
  );
}
