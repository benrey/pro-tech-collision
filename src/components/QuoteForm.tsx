"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill hidden fields, humans don't.
    if (data.get("company")) {
      setStatus("success");
      form.reset();
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setError(`Online requests aren't set up yet. Please call us at ${site.phone.display}.`);
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
      setError(`Something went wrong sending your request. Please call us at ${site.phone.display}.`);
    }
  }

  if (status === "success") {
    return (
      <div className="eform-success">
        <h3>Request received.</h3>
        <p>
          Thanks — we&apos;ll get back to you shortly. If it&apos;s urgent, call
          us at <a href={site.phone.href} style={{ fontWeight: 800 }}>{site.phone.display}</a>.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ebutton"
          style={{ marginTop: 24 }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="eform">
      <label>
        Name *
        <input name="name" required autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        Phone *
        <input name="phone" type="tel" required autoComplete="tel" placeholder="(432) 555-0000" />
      </label>
      <label className="field-wide">
        Email
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </label>
      <label className="field-wide">
        Vehicle
        <input name="vehicle" placeholder="Year, make, and model" />
      </label>
      <label className="field-wide">
        What happened?
        <textarea name="message" placeholder="Briefly describe the damage" />
      </label>

      {/* Honeypot — hidden from users, catches naive bots */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="eform-error">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="ebutton ebutton-bright">
        {status === "submitting" ? "Sending…" : "Send request"} <span aria-hidden="true">↗</span>
      </button>
      <p className="eform-note">
        Prefer to talk? Call{" "}
        <a href={site.phone.href} style={{ fontWeight: 800 }}>
          {site.phone.display}
        </a>
        . No obligation either way.
      </p>
    </form>
  );
}
