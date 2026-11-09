import Link from "next/link";
import { ArrowRight, ScrollText } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-bold tracking-[0.16em] text-brand uppercase">
          Architect Vault
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
          <span className="text-gradient">Your learning hub</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-muted">
          System design, LLD and DSA in one place.
        </p>
      </header>

      <Link
        href="/ref/cheat"
        className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40 hover:shadow-sm sm:max-w-md"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ScrollText className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-display font-bold">Cheat Sheet</span>
          <span className="block text-[13.5px] text-muted">One-page summaries to revise from.</span>
        </span>
        <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-text" />
      </Link>
    </div>
  );
}
