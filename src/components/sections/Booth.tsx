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
        <span className="photo-kicker">Down draft heated paint booth</span>
      </Reveal>
      <div className="booth-copy">
        <Reveal>
          <p className="eyebrow eyebrow-light">
            <span></span> Built for the finish
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="section-heading-gap">
            A down draft
            <br />
            <em>heated booth.</em>
          </h2>
        </Reveal>
        <Reveal delay={130}>
          <p>
            Down draft heated paint booth to insure a professional paint job.
            High quality paint materials used.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="booth-notes">
            <span>
              <b>01</b> Down draft heated booth
            </span>
            <span>
              <b>02</b> High quality paint materials
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
