import { processSteps } from "@/lib/site";
import Reveal from "../Reveal";

export default function Process() {
  return (
    <section className="esection process-section" id="process">
      <div className="shell">
        <div className="process-top">
          <Reveal>
            <p className="eyebrow">
              <span></span> The repair rhythm
            </p>
          </Reveal>
          <Reveal delay={60}>
            <p className="cap-label">Clear steps · Less guesswork</p>
          </Reveal>
        </div>
        <div className="process-layout">
          <Reveal>
            <h2>
              From first look
              <br />
              to <em>final shine.</em>
            </h2>
          </Reveal>
          <ol className="process-list">
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.step} delay={70 + index * 60}>
                <span>{String(step.step).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
