import { notFound } from "next/navigation";
import { moduleSection } from "@/lib/sections";
import { ModuleEditor } from "../module-editor";

export const metadata = { title: "New module" };

export default async function NewModulePage({ params }: { params: Promise<{ section: string }> }) {
  const { section: key } = await params;
  const section = moduleSection("learn", key);
  if (!section) notFound();
  return <ModuleEditor sectionKey={section.key} />;
}
