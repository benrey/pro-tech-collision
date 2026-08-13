import { site } from "@/lib/site";
import Reveal from "../Reveal";

export default function ClosingCta() {
  return (
    <section className="closing-cta">
      <div className="shell closing-layout">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span></span> Let&apos;s get started
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="section-heading-gap">
              Your vehicle is
              <br />
              in <em>good hands.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={120} className="closing-action">
          <p>
            Need to talk through a repair? Give the shop a call and we&apos;ll
            take it from there.
          </p>
          <a className="circle-link" href={site.phone.href} aria-label={`Call ${site.name}`}>
            <span>
              Call
              <br />
              now
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
