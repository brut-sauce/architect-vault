import { ComingSoon } from "@/components/coming-soon";

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
          System design, LLD and DSA in one place. The shell is live; dashboard sections arrive one
          at a time.
        </p>
      </header>
      <ComingSoon title="Dashboard" note="Hero, stats row and the rest of the dashboard come next." />
    </div>
  );
}
