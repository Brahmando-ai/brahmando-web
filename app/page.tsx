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
      <WhatIsBrahmando />
      <AboutSection />
      <MCPSection />
      <AgentsSection />
      <WorkflowsSection />
      <CTASection />
    </>
  );
}
