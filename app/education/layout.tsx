"use client";

import { usePathname } from "next/navigation";
import { EducationPortalChat } from "@/components/education/EducationPortalChat";

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("/education/chat");
  const isAbhyasPage = pathname?.includes("/education/abhyas");

  return (
    <>
      {children}
      {!isChatPage && !isAbhyasPage && <EducationPortalChat />}
    </>
  );
}
