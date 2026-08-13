import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";
import Reveal from "../Reveal";

/**
 * Fallback quotes shown until the owner adds reviews via /admin. These are
 * short excerpts of public customer feedback from the shop's public listings,
 * attributed as such — not fabricated testimonials.
 */
const fallbackReviews = [
  { quote: "Repaired nicely… very impressed.", tag: "Body repair" },
  { quote: "Great customer service.", tag: "Customer care" },
  { quote: "My car looked brand new.", tag: "Collision repair" },
];

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
      .limit(3);
    items = data ?? [];
  }

  const hasReal = items.length > 0;

  return (
    <section className="esection reviews-section" id="reviews">
      <div className="shell">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span></span> Customer notes
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="section-heading-gap">
              Kind words from
              <br />
              <em>the road.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <a
              className="source-link"
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read reviews on Google <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>

        <div className="review-grid">
          {hasReal
            ? items.map((item, index) => (
                <Reveal
                  as="figure"
                  key={item.id}
                  delay={80 + index * 60}
                  className={`review-card ${index === 1 ? "review-card-dark" : ""}`}
                >
                  <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                  <figcaption>
                    <span className="review-mark">✦</span>
                    <span>
                      {item.author}
                      <small>{item.source ?? "Review"}</small>
                    </span>
                  </figcaption>
                </Reveal>
              ))
            : fallbackReviews.map((review, index) => (
                <Reveal
                  as="figure"
                  key={review.tag}
                  delay={80 + index * 60}
                  className={`review-card ${index === 1 ? "review-card-dark" : ""}`}
                >
                  <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
                  <figcaption>
                    <span className="review-mark">✦</span>
                    <span>
                      Public customer feedback
                      <small>{review.tag}</small>
                    </span>
                  </figcaption>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
