import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  let email: string | null = null;
  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Account</h1>
        <p className="mt-1.5 text-[14.5px] text-muted">
          Signed in as <b className="text-text">{email ?? "unknown"}</b>
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-bold">Password</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Set a password to sign in without waiting for an email link. The link option keeps working.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
