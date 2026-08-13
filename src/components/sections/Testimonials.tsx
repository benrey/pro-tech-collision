import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";
import { StarIcon } from "../Icons";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-accent" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rating} />
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const supabase = await createClient();
  let items: Testimonial[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(9);
    items = data ?? [];
  }

  return (
    <section id="reviews" className="scroll-mt-24 border-b border-border-subtle py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Reviews</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What our customers say
            </h2>
          </div>
          <a
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read reviews on Google →
          </a>
        </header>

        {items.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col rounded-2xl border border-border-subtle bg-surface-raised p-6"
              >
                {item.rating != null && <Stars rating={item.rating} />}
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="mt-4 border-t border-border-subtle pt-3">
                  <p className="text-sm font-semibold text-foreground">{item.author}</p>
                  {item.source && (
                    <p className="text-xs text-text-tertiary">
                      via {item.source}
                      {item.reviewed_on
                        ? ` · ${new Date(item.reviewed_on).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                  )}
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
            <p className="text-base font-semibold text-foreground">No testimonials added yet</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">
              Add real customer reviews from the owner dashboard. Copy them from
              your Google listing with the customer&apos;s name as shown, and
              they&apos;ll appear here.
            </p>
            <a
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Open the Google listing →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
