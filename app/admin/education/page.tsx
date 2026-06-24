import { EducationAdminShell } from "@/components/education/EducationAdminShell";

export const metadata = {
  title: "Education Admin · Brahmando",
  description: "Restricted SKU manifest studio for platform administrators.",
  robots: { index: false, follow: false },
};

export default function EducationAdminPage() {
  return <EducationAdminShell />;
}
