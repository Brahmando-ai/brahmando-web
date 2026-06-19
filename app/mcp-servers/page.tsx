import Link from "next/link";
import { LIVE_MCP_SERVERS, platformStats } from "@/lib/platform-catalog";

export default function MCPServersPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">MCP servers</h1>
          <p className="section-subtitle max-w-3xl">
            <strong className="text-slate-100">{platformStats.mcpServers} MCP servers</strong> live on the Brahmando
            GPU cluster — standard HTTP tool endpoints used by Mercury and Hermes. Demo finance/network MCP listings
            were removed from the public site.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {LIVE_MCP_SERVERS.map((server) => (
            <div key={server.id} className="card">
              <div className="mb-3 flex items-start justify-between">
                <code className="font-mono text-sm text-cyan-200">{server.id}</code>
                <span className="font-mono text-xs text-slate-500">:{server.port}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-100">{server.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{server.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-400">
          Routed by{" "}
          <Link href="/agents" className="text-cyan-200 hover:underline">
            {platformStats.agents} live agents
          </Link>
          . Service health:{" "}
          <Link href="/platform" className="text-cyan-200 hover:underline">
            Platform →
          </Link>
        </p>
      </div>
    </div>
  );
}
