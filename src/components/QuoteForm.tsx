"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill hidden fields, humans don't. Silently accept so the
    // bot believes it succeeded.
    if (data.get("company")) {
      setStatus("success");
      form.reset();
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setError(
        `Online requests aren't set up yet. Please call us at ${site.phone.display}.`,
      );
      return;
    }

    setStatus("submitting");

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("quote_requests").insert({
        name: String(data.get("name") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim() || null,
        vehicle: String(data.get("vehicle") ?? "").trim() || null,
        message: String(data.get("message") ?? "").trim() || null,
      });

      if (insertError) throw insertError;

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        `Something went wrong sending your request. Please call us at ${site.phone.display}.`,
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center">
        <h3 className="text-lg font-bold text-foreground">Request received</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Thanks — we&apos;ll get back to you shortly. If it&apos;s urgent, give
          us a call at{" "}
          <a href={site.phone.href} className="font-semibold text-primary underline-offset-4 hover:underline">
            {site.phone.display}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
      <h3 className="text-xl font-bold text-foreground">Request a free estimate</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Tell us what happened and we&apos;ll follow up. No obligation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Name <span className="text-danger">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Phone <span className="text-danger">*</span>
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} placeholder="(432) 555-0100" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="vehicle" className="mb-1.5 block text-sm font-medium text-foreground">
            Vehicle
          </label>
          <input id="vehicle" name="vehicle" className={inputClass} placeholder="Year, make, and model" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
            What happened?
          </label>
          <textarea id="message" name="message" rows={4} className={inputClass} placeholder="Briefly describe the damage" />
        </div>
      </div>

      {/* Honeypot — hidden from users, catches naive bots */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Request"}
      </button>

      <p className="mt-3 text-center text-xs text-text-tertiary">
        Prefer to talk?{" "}
        <a href={site.phone.href} className="font-semibold text-primary underline-offset-4 hover:underline">
          Call {site.phone.display}
        </a>
      </p>
    </form>
  );
}
