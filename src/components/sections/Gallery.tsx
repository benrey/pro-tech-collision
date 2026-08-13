import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";
import BeforeAfter from "../BeforeAfter";

/** Turns a storage path into a public URL for the gallery bucket. */
function publicUrl(base: string, path: string) {
  return `${base}/storage/v1/object/public/gallery/${path}`;
}

export default async function Gallery() {
  const supabase = await createClient();
  let items: GalleryItem[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);
    items = data ?? [];
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <section id="gallery" className="scroll-mt-24 border-b border-border-subtle bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Our Work</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Before &amp; after
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Drag the slider on any repair to see the damage we started with.
          </p>
        </header>

        {items.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <BeforeAfter
                key={item.id}
                title={item.title}
                vehicle={item.vehicle}
                description={item.description}
                beforeUrl={publicUrl(base, item.before_path)}
                afterUrl={publicUrl(base, item.after_path)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-surface-raised p-10 text-center">
            <p className="text-base font-semibold text-foreground">No photos yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              Repair photos appear here once they&apos;re uploaded from the owner
              dashboard. Sign in at <code className="rounded bg-surface px-1.5 py-0.5 text-xs">/admin</code> to
              add before &amp; after shots.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
