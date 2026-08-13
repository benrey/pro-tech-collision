import Reveal from "../Reveal";
import QuoteForm from "../QuoteForm";

export default function Estimate() {
  return (
    <section className="esection estimate-section" id="contact">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">
            <span></span> Free estimate
          </p>
        </Reveal>
        <div className="estimate-layout">
          <div className="estimate-copy">
            <Reveal delay={70}>
              <h2>
                Tell us what
                <br />
                <em>happened.</em>
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p style={{ marginTop: 28 }}>
                Send the basics and we&apos;ll follow up with next steps — or
                skip the form entirely and give the shop a call. Estimates are
                free either way.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <QuoteForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
