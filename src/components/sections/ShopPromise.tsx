import { site } from "@/lib/site";
import Reveal from "../Reveal";

/**
 * The shop's own promises, verbatim from the owner. Nothing here implies a
 * license, certification, or accreditation — see the note in site.ts.
 */
export default function ShopPromise() {
  return (
    <section className="esection promise-section" id="promise">
      <div className="shell">
        <div className="process-top">
          <Reveal>
            <p className="eyebrow">
              <span></span> What you can count on
            </p>
          </Reveal>
          <Reveal delay={60}>
            <p className="cap-label">Plain promises · No fine print</p>
          </Reveal>
        </div>
        <div className="process-layout">
          <Reveal>
            <h2>
              Every repair,
              <br />
              <em>backed by us.</em>
            </h2>
          </Reveal>
          <ol className="process-list">
            {site.claims.items.map((claim, index) => (
              <Reveal as="li" key={claim.name} delay={70 + index * 60}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{claim.name}</h3>
                  <p>{claim.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
