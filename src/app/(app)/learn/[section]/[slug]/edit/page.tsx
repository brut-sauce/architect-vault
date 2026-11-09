import { notFound } from "next/navigation";
import { getModule } from "@/lib/content";
import { moduleSection } from "@/lib/sections";
import { ModuleEditor } from "../../module-editor";

export const metadata = { title: "Edit module" };

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section: key, slug } = await params;
  const section = moduleSection("learn", key);
  if (!section) notFound();
  const m = await getModule(section.key, slug);
  if (!m) notFound();
  return <ModuleEditor sectionKey={section.key} item={m} />;
}
