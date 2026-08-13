"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const next = searchParams.get("next") ?? "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <h2 className="text-lg font-bold text-foreground">Supabase isn&apos;t configured</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Copy <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">.env.example</code> to{" "}
          <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">.env.local</code> and add your
          Supabase project URL and anon key, then restart the dev server. See{" "}
          <code className="rounded bg-surface-raised px-1.5 py-0.5 text-xs">README.md</code> for the full setup.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-surface p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="owner@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-contrast">
            PT
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">Pro Tech Collision</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Owner sign in</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Manage photos and reviews for your site.</p>
      </div>

      <Suspense fallback={<div className="h-64 rounded-2xl border border-border-subtle bg-surface" />}>
        <LoginForm />
      </Suspense>

      <Link
        href="/"
        className="mt-6 text-center text-sm text-text-tertiary underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Back to the website
      </Link>
    </main>
  );
}
