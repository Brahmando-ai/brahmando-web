import { NandiPathRedirect } from "@/components/workflows/NandiPathRedirect";

export function generateStaticParams() {
  return [
    { pathId: "pass" },
    { pathId: "fail" },
    { pathId: "errored" },
    { pathId: "errored-to-fail" },
    { pathId: "errored-to-pass" },
    { pathId: "errored-to-pass-via-in-progress" },
  ];
}

type Props = { params: Promise<{ pathId: string }> };

export default async function NandiPathRedirectPage({ params }: Props) {
  const { pathId } = await params;
  return <NandiPathRedirect pathId={pathId} />;
}
