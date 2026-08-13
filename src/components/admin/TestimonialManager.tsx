"use client";

import { useCallback, useState } from "react";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { useRecords } from "@/lib/useRecords";
import type { Testimonial } from "@/lib/types";
import { StarIcon } from "../Icons";

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none";

export default function TestimonialManager() {
  const [busy, setBusy] = useState(false);
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);

  const fetcher = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  }, []);

  const { items, loading, error, reload, setItems, setError } = useRecords(
    fetcher,
    "Could not load reviews.",
  );

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!author.trim() || !quote.trim()) {
      setError("Please add both the customer's name and their review.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("testimonials").insert({
        author: author.trim(),
        quote: quote.trim(),
        rating,
        source: "Google",
        source_url: site.googleMapsUrl,
        published: true,
      });
      if (insertError) throw insertError;

      setAuthor("");
      setQuote("");
      setRating(5);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save that review.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: Testimonial) {
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("testimonials")
        .update({ published: !item.published })
        .eq("id", item.id);
      if (updateError) throw updateError;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: !i.published } : i)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update that review.");
    }
  }

  async function remove(item: Testimonial) {
    if (!confirm(`Delete the review from ${item.author}?`)) return;
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", item.id);
      if (deleteError) throw deleteError;
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete that review.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border-subtle bg-surface p-6">
        <h2 className="text-lg font-bold text-foreground">Add a customer review</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          Copy a real review from your{" "}
          <a
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Google listing
          </a>{" "}
          and paste it here, keeping the customer&apos;s name as they wrote it.
        </p>

        <form onSubmit={add} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="t-author" className="mb-1.5 block text-sm font-medium text-foreground">
                Customer name <span className="text-danger">*</span>
              </label>
              <input
                id="t-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={inputClass}
                placeholder="Maria G."
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-foreground">Rating</span>
              <div className="flex items-center gap-1 pt-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    aria-pressed={rating === n}
                    className="p-0.5 text-accent transition-transform hover:scale-110"
                  >
                    <StarIcon className="h-6 w-6" filled={n <= rating} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="t-quote" className="mb-1.5 block text-sm font-medium text-foreground">
              Review <span className="text-danger">*</span>
            </label>
            <textarea
              id="t-quote"
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className={inputClass}
              placeholder="Paste what the customer wrote."
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-foreground">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
          >
            {busy ? "Saving…" : "Add Review"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground">
          Your reviews {items.length > 0 && <span className="text-text-tertiary">({items.length})</span>}
        </h2>

        {loading ? (
          <p className="mt-4 text-sm text-text-secondary">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-text-secondary">
            No reviews yet. Add your first one above.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{item.author}</p>
                      {item.rating != null && (
                        <span className="flex text-accent" aria-label={`${item.rating} of 5 stars`}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <StarIcon key={n} filled={n <= item.rating!} />
                          ))}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <p className="mt-1.5 text-xs text-text-tertiary">
                      {item.published ? "Visible on site" : "Hidden"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublished(item)}
                      className="rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
                    >
                      {item.published ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="rounded-full px-3.5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
