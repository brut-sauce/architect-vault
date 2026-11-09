import { ComingSoon } from "@/components/coming-soon";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ComingSoon title={`Module: ${slug}`} note="The notes reader arrives in its own section." />;
}
