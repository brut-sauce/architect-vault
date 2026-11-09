"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) {
      setState("error");
      setMessage("Supabase is not configured yet. Add the env vars first.");
      return;
    }
    setState("sending");
    const supabase = createClient();
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });
    if (error) {
      setState("error");
      setMessage(error.message);
    } else {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <p className="mt-6 rounded-lg bg-emerald-500/10 px-3 py-3 text-[14px] text-emerald-700 dark:text-emerald-400">
        Check <b>{email}</b> for your sign-in link. You can close this tab.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block text-[13px] font-semibold" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-bg px-3 text-[14px] outline-none focus:border-brand"
        placeholder="you@example.com"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-11 w-full rounded-lg bg-brand text-[14px] font-semibold text-white disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
      {state === "error" && <p className="text-[13px] text-red-600">{message}</p>}
    </form>
  );
}
