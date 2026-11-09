import { Vault } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Vault className="h-5 w-5" />
          </span>
          <span className="font-display text-[15px] font-bold">Architect Vault</span>
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold">Sign in</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Sign in with your password, or get a one-time link by email.
        </p>
        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-[13px] text-red-600">
            That sign-in link is invalid or has expired. Request a new one.
          </p>
        )}
        <LoginForm next={next ?? "/"} />
      </div>
    </main>
  );
}
