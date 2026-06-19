import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsBrahmando } from "@/components/home/WhatIsBrahmando";
import { AboutSection } from "@/components/home/AboutSection";
import { CSRSection } from "@/components/home/CSRSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <WhatIsBrahmando />
      <hr className="section-rule mx-auto max-w-5xl" />
      <CSRSection />
      <hr className="section-rule mx-auto max-w-5xl" />
      <AboutSection />
      <CTASection />
    </>
  );
}
