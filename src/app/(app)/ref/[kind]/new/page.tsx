import { notFound } from "next/navigation";
import { REF_KINDS, isRefKind } from "@/lib/reference";
import { RefEditor } from "../ref-editor";

export const metadata = { title: "New entry" };

export default async function NewRefPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isRefKind(kind) || !REF_KINDS[kind].enabled) notFound();
  return <RefEditor kind={kind} />;
}
