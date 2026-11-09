"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";

type Mode = "password" | "link";

const input =
  "h-11 w-full rounded-lg border border-border bg-bg px-3 text-[14px] outline-none focus:border-brand";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) {
      setState("error");
      setMessage("Supabase is not configured yet. Add the env vars first.");
      return;
    }
    setState("busy");
    const supabase = createClient();

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setState("error");
        setMessage(
          error.message === "Invalid login credentials"
            ? "Wrong email or password. No password yet? Use the email link once, then set one under Account."
            : error.message,
        );
        return;
      }
      router.replace(safeNext);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
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
      <div className="grid grid-cols-2 rounded-lg border border-border bg-surface-2 p-0.5 text-[13px]">
        {(
          [
            ["password", "Password"],
            ["link", "Email link"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setState("idle");
            }}
            className={cn(
              "rounded-md py-1.5",
              mode === m ? "bg-surface font-semibold shadow-sm" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block space-y-1.5">
        <span className="text-[13px] font-semibold">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
          placeholder="you@example.com"
        />
      </label>

      {mode === "password" && (
        <label className="block space-y-1.5">
          <span className="text-[13px] font-semibold">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
        </label>
      )}

      <button
        type="submit"
        disabled={state === "busy"}
        className="h-11 w-full rounded-lg bg-brand text-[14px] font-semibold text-white disabled:opacity-60"
      >
        {state === "busy"
          ? mode === "password"
            ? "Signing in…"
            : "Sending…"
          : mode === "password"
            ? "Sign in"
            : "Email me a sign-in link"}
      </button>
      {state === "error" && <p className="text-[13px] text-red-600">{message}</p>}
    </form>
  );
}
