import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsBrahmando } from "@/components/home/WhatIsBrahmando";
import { AboutSection } from "@/components/home/AboutSection";
import { MCPSection } from "@/components/home/MCPSection";
import { AgentsSection } from "@/components/home/AgentsSection";
import { WorkflowsSection } from "@/components/home/WorkflowsSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <WhatIsBrahmando />
      <hr className="section-rule mx-auto max-w-5xl" />
      <MCPSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <AgentsSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <WorkflowsSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <AboutSection />
      <CTASection />
    </>
  );
}
