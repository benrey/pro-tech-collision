import { services, site } from "@/lib/site";
import Reveal from "../Reveal";
import { serviceIcons } from "../Icons";

export default function Services() {
  return (
    <section className="esection services-section" id="services">
      <div className="shell">
        <div className="split-heading">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span></span> What we do
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="section-heading-gap">
                Care in every
                <br />
                <em>curve &amp; panel.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={130}>
            <p className="section-intro">
              Whether it is a small scrape or a hard hit, our shop focuses on
              getting your vehicle back to its best—without adding more stress
              to your week.
            </p>
          </Reveal>
        </div>

        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Reveal
                key={service.slug}
                delay={(index % 3) * 70}
                as="div"
                className={`service-card ${index === 0 ? "service-card-featured" : ""}`}
              >
                <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="service-icon" aria-hidden="true">
                  <Icon className="h-12 w-12" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.blurb}</p>
                <a href={site.phone.href} aria-label={`Call about ${service.title.toLowerCase()}`}>
                  Talk with the shop <span aria-hidden="true">↗</span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
