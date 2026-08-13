import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";
import BeforeAfter from "../BeforeAfter";
import Reveal from "../Reveal";

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
      .limit(4);
    items = data ?? [];
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const tileClass = ["gallery-tile-lg", "gallery-tile-offset"];

  return (
    <section className="gallery-section" id="gallery">
      <div className="shell gallery-head">
        <div>
          <Reveal>
            <p className="eyebrow eyebrow-light">
              <span></span> Shop journal
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="section-heading-gap">
              The proof is
              <br />
              <em>in the finish.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <Link className="ebutton ebutton-outline-light" href="/admin">
            Owner photo portal <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
      </div>

      <div className="gallery-strip">
        {items.length > 0 ? (
          items.slice(0, 2).map((item, index) => (
            <BeforeAfter
              key={item.id}
              className={tileClass[index]}
              title={item.title}
              index={String(index + 1).padStart(2, "0")}
              beforeUrl={publicUrl(base, item.before_path)}
              afterUrl={publicUrl(base, item.after_path)}
            />
          ))
        ) : (
          <>
            {/* Concept imagery until the owner uploads real repair photos */}
            <figure className="gallery-tile gallery-tile-lg">
              <Image
                src="/images/paint-booth-truck.png"
                alt="Concept image of a truck in a full-size paint booth"
                fill
                sizes="(max-width: 760px) 100vw, 45vw"
                className="object-cover"
              />
              <figcaption>
                <span>Refinishing</span>
                <b>CONCEPT</b>
              </figcaption>
            </figure>
            <figure className="gallery-tile gallery-tile-offset">
              <Image
                src="/images/workshop-hero.png"
                alt="Concept image of a refinished car in a collision repair workshop"
                fill
                sizes="(max-width: 760px) 100vw, 35vw"
                className="object-cover"
              />
              <figcaption>
                <span>Collision repair</span>
                <b>CONCEPT</b>
              </figcaption>
            </figure>
          </>
        )}

        <Reveal delay={150} className="gallery-cta">
          <div className="gallery-plus" aria-hidden="true">
            +
          </div>
          <p>
            Fresh shop photos
            <br />
            appear here.
          </p>
          <span>Real before &amp; after work · via the owner portal</span>
        </Reveal>
      </div>
    </section>
  );
}
