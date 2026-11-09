import { notFound } from "next/navigation";
import { REF_KINDS, getRefItem, isRefKind } from "@/lib/reference";
import { RefEditor } from "../../ref-editor";

export const metadata = { title: "Edit entry" };

export default async function EditRefPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind, slug } = await params;
  if (!isRefKind(kind) || !REF_KINDS[kind].enabled) notFound();
  const item = await getRefItem(kind, slug);
  if (!item) notFound();
  return <RefEditor kind={kind} item={item} />;
}
