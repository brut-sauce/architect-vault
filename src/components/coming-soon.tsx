import { Construction } from "lucide-react";

export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-border bg-surface p-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-muted">
          <Construction className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Coming soon</p>
          <p className="text-[13.5px] text-muted">
            {note ?? "This section is planned. We will build it next, one section at a time."}
          </p>
        </div>
      </div>
    </section>
  );
}
