import Image from "next/image";
import { asset } from "@/lib/assets";
import Reveal from "../Reveal";

export default function Booth() {
  return (
    <section className="booth-section" id="paint-booth">
      <Reveal className="booth-photo">
        <Image
          src={asset("/images/paint-booth-truck.png")}
          alt="A full-size automotive paint booth with a pickup truck inside"
          fill
          sizes="(max-width: 760px) 100vw, 55vw"
          className="object-cover"
        />
        <span className="photo-kicker">Precision in a controlled environment</span>
      </Reveal>
      <div className="booth-copy">
        <Reveal>
          <p className="eyebrow eyebrow-light">
            <span></span> Built for the finish
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="section-heading-gap">
            The full-size
            <br />
            <em>car oven.</em>
          </h2>
        </Reveal>
        <Reveal delay={130}>
          <p>
            A dedicated paint booth gives every vehicle the clean, controlled
            conditions a lasting finish deserves. It is a serious piece of
            equipment—and a better way to bring the final coat home.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="booth-notes">
            <span>
              <b>01</b> Controlled space
            </span>
            <span>
              <b>02</b> Full vehicle capacity
            </span>
          </div>
        </Reveal>
      </div>
      <div className="booth-orbit" aria-hidden="true">
        <span>FINISH&nbsp; / &nbsp;REFINE&nbsp; / &nbsp;REPEAT&nbsp; / &nbsp;</span>
      </div>
    </section>
  );
}
