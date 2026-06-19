import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { platformStats, VISITOR_DESTINATIONS } from "@/lib/platform-catalog";

export default function PlatformPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <h1 className="section-title text-5xl">
          <span className="text-gradient">Brahmando Platform</span>
        </h1>
        <p className="section-subtitle mx-auto mt-4 text-center max-w-2xl">
          What you can use on brahmando.com today —{" "}
          <strong className="text-slate-100">{platformStats.agents} agents</strong>,{" "}
          <strong className="text-slate-100">{platformStats.mcpServers} MCP servers</strong>, and{" "}
          <strong className="text-slate-100">{platformStats.workflows} SMB workflows</strong> on the
          hosted stack, plus CSR community programs.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VISITOR_DESTINATIONS.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-xl px-4 text-center text-sm text-slate-500">
        Built by{" "}
        <a
          href="https://manjulab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-200/90 hover:text-cyan-100"
        >
          ManjuLAB
        </a>
        . Internal infra (Ollama, raw API health endpoints, etc.) is not listed here — this page is
        for visitors, not cluster operators.
      </p>
    </div>
  );
}

function DestinationCard({ dest }: { dest: (typeof VISITOR_DESTINATIONS)[number] }) {
  const className =
    "card group relative flex flex-col gap-3 transition-colors hover:border-cyan-300/30";

  const inner = (
    <>
      <span className="text-3xl leading-none select-none" aria-hidden="true">
        {dest.icon}
      </span>
      <h2 className="text-base font-semibold text-slate-100 group-hover:text-cyan-100 pr-6 transition-colors">
        {dest.title}
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed">{dest.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-cyan-200/90 group-hover:text-cyan-100">
        {dest.external ? "Open" : "Go"}
        <ExternalLink size={12} className={dest.external ? "" : "hidden"} />
      </span>
    </>
  );

  if (dest.external) {
    return (
      <a href={dest.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={dest.href} className={className}>
      {inner}
    </Link>
  );
}
