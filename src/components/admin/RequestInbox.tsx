"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRecords } from "@/lib/useRecords";
import type { QuoteRequest } from "@/lib/types";

export default function RequestInbox() {
  const fetcher = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as QuoteRequest[];
  }, []);

  const { items, loading, error, refresh, setItems, setError } = useRecords(
    fetcher,
    "Could not load requests.",
  );

  async function toggleHandled(item: QuoteRequest) {
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("quote_requests")
        .update({ handled: !item.handled })
        .eq("id", item.id);
      if (updateError) throw updateError;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, handled: !i.handled } : i)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update that request.");
    }
  }

  const pending = items.filter((i) => !i.handled).length;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">
          Quote requests{" "}
          {pending > 0 && (
            <span className="ml-1 rounded-full bg-accent px-2.5 py-0.5 text-sm font-semibold text-accent-contrast">
              {pending} new
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={refresh}
          className="rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-foreground">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-text-secondary">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-text-secondary">
          No quote requests yet. They&apos;ll show up here when customers submit
          the form on your site.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border bg-surface p-4 ${
                item.handled ? "border-border-subtle opacity-70" : "border-accent/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-text-secondary">
                    <a href={`tel:${item.phone}`} className="font-medium text-primary underline-offset-4 hover:underline">
                      {item.phone}
                    </a>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="underline-offset-4 hover:underline">
                        {item.email}
                      </a>
                    )}
                  </p>
                  {item.vehicle && <p className="mt-1 text-sm text-text-secondary">{item.vehicle}</p>}
                  {item.message && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.message}</p>
                  )}
                  <p className="mt-2 text-xs text-text-tertiary">
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleHandled(item)}
                  className="rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
                >
                  {item.handled ? "Mark unread" : "Mark handled"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
