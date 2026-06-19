import { EducationPortalChat } from "@/components/education/EducationPortalChat";

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <EducationPortalChat />
    </>
  );
}
