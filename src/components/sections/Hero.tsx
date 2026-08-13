import Image from "next/image";
import { site } from "@/lib/site";
import Reveal from "../Reveal";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/images/workshop-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="hero-shade"></div>
      </div>
      <div className="hero-content shell">
        <Reveal>
          <p className="eyebrow hero-eyebrow">
            <span></span> Collision repair · {site.address.city}, Texas
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h1>
            Built to look like
            <br />
            <em>nothing happened.</em>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="hero-copy">
            Precision bodywork, considered refinishing, and a team that makes a
            hard moment feel a little easier.
          </p>
        </Reveal>
        <Reveal delay={210}>
          <div className="hero-buttons">
            <a className="ebutton ebutton-bright" href={site.phone.href}>
              Call for an estimate <span aria-hidden="true">↗</span>
            </a>
            <a className="ebutton ebutton-ghost" href="#services">
              Explore our work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={300} className="hero-side-note">
        <span className="cap-label cap-label-light">Pro Tech Collision</span>
        <p>
          Quality repairs.
          <br />
          Superior service.
        </p>
      </Reveal>
      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll to explore</span>
        <i></i>
      </div>
    </section>
  );
}
