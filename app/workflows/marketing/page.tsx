import Link from "next/link";
import { ArrowRight, MapPin, Megaphone, MessageCircle, Video, Mail } from "lucide-react";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";

const channels = [
  { icon: MessageCircle, name: "Facebook & local groups", detail: "Auto-suggest community groups from business address; owner confirms before posting." },
  { icon: Megaphone, name: "Instagram & LinkedIn", detail: "Channel-specific copy from one owner brief — promos, roadshows, hiring." },
  { icon: Mail, name: "Email", detail: "Newsletter and promo blasts to opted-in customer lists." },
  { icon: Video, name: "YouTube", detail: "Publish marketing videos with SEO titles and local keywords." },
  { icon: MapPin, name: "Local portals", detail: "Nextdoor, Google Business, chamber listings — surfaced by city and vertical." },
];

const flow = [
  "Onboard business URL + address + owner WhatsApp/Telegram",
  "Crawl site for brand voice, services, and offers",
  "Owner sends briefs (roadshow, sale, new product) via chat or form",
  "Agent plans weekly calendar and drafts multi-channel posts",
  "Owner approves on WhatsApp — auto-publish via Rhythm/n8n schedulers",
  "Engagement feedback improves the next cycle",
];

export default function MarketingWorkflowPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows" label="All workflows" />

        <div className="mt-6 mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">Reach · Agentic marketing orchestrator</p>
          <h1 className="section-title mt-2">Local digital marketing for SMBs</h1>
          <p className="section-subtitle max-w-3xl">
            Built for businesses that depend on local reach — Facebook, Instagram, neighborhood groups, and email —
            not enterprise ad stacks. Input: your website URL plus what&apos;s happening this week. Output: scheduled,
            owner-approved posts across channels.
          </p>
          <p className="mt-4 max-w-3xl text-sm text-slate-400">
            Pilot:{" "}
            <a href="https://primovite.com" target="_blank" rel="noopener noreferrer" className="text-cyan-200 hover:text-cyan-100">
              primovite.com
            </a>{" "}
            — order-to-cash on Rhythm (online store) plus Reach for local campaigns.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Channels</h2>
            <ul className="mt-4 space-y-4">
              {channels.map((c) => (
                <li key={c.name} className="flex gap-3">
                  <c.icon size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                  <div>
                    <p className="font-medium text-slate-100">{c.name}</p>
                    <p className="text-sm text-slate-400">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Agentic flow</h2>
            <ol className="mt-4 space-y-3">
              {flow.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-200">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="mt-8 card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">API (port 8220)</h2>
          <div className="mt-4 grid gap-2 font-mono text-xs text-slate-400 sm:grid-cols-2">
            <p>POST /businesses/onboard</p>
            <p>POST /businesses/&#123;id&#125;/brief</p>
            <p>GET /businesses/&#123;id&#125;/local-channels</p>
            <p>POST /campaigns/plan</p>
            <p>POST /drafts/generate</p>
            <p>POST /drafts/&#123;id&#125;/approve</p>
            <p>POST /media/youtube</p>
            <p>POST /publish/run</p>
          </div>
          <Link href="/workflows/rhythm/online-store" className="mt-6 inline-flex items-center gap-2 text-sm text-violet-200 hover:text-violet-100">
            Pair with Rhythm online-store order-to-cash
            <ArrowRight size={14} />
          </Link>
        </section>

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
