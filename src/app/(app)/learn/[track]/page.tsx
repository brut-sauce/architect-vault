import { ComingSoon } from "@/components/coming-soon";

const TITLES: Record<string, string> = { hld: "System Design", lld: "LLD & Patterns" };

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  return <ComingSoon title={TITLES[track] ?? track} />;
}
