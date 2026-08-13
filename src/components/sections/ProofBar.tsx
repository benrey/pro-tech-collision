import Reveal from "../Reveal";

const proofItems = [
  { index: "01", text: ["Full-service collision", "repair & refinishing"] },
  { index: "02", text: ["Insurance claims", "welcome"] },
  { index: "03", text: ["Frame specialists", "& truck repair"] },
];

export default function ProofBar() {
  return (
    <section className="proof-bar">
      <div className="shell proof-grid">
        {proofItems.map((item, i) => (
          <Reveal key={item.index} delay={i * 70} className="proof-item">
            <strong>{item.index}</strong>
            <span>
              {item.text[0]}
              <br />
              {item.text[1]}
            </span>
          </Reveal>
        ))}
        <Reveal delay={210} className="proof-item proof-language">
          <strong>↗</strong>
          <span>
            Se habla
            <br />
            español
          </span>
        </Reveal>
      </div>
    </section>
  );
}
