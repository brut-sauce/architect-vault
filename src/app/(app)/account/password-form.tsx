"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const input =
  "h-11 w-full rounded-lg border border-border bg-bg px-3 text-[14px] outline-none focus:border-brand";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 10) {
      setState("error");
      setMessage("Use at least 10 characters.");
      return;
    }
    if (password !== confirm) {
      setState("error");
      setMessage("The two passwords do not match.");
      return;
    }
    setState("busy");
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setState("error");
      setMessage(error.message);
    } else {
      setState("done");
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <label className="block space-y-1.5">
        <span className="text-[13px] font-semibold">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
          required
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[13px] font-semibold">Confirm password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={input}
          required
        />
      </label>
      <button
        type="submit"
        disabled={state === "busy"}
        className="h-11 rounded-lg bg-brand px-6 text-[14px] font-semibold text-white disabled:opacity-60"
      >
        {state === "busy" ? "Saving…" : "Save password"}
      </button>
      {state === "done" && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          Password saved. Next time, sign in with the Password tab.
        </p>
      )}
      {state === "error" && <p className="text-[13px] text-red-600">{message}</p>}
    </form>
  );
}
