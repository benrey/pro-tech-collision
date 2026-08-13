import { site } from "@/lib/site";
import Reveal from "../Reveal";

/** Formats "09:00" as "9am" for the compact hours display. */
function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${period}` : `${hour}${period}`;
}

export default function Visit() {
  const { address, phone, hours } = site;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const mapQuery = encodeURIComponent(`${site.name} ${fullAddress}`);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  return (
    <section className="visit-section" id="visit">
      <div className="visit-map">
        <iframe
          src={mapSrc}
          title={`Map showing the location of ${site.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <Reveal className="visit-card">
        <p className="eyebrow eyebrow-light">
          <span></span> Come see us
        </p>
        <h2 className="section-heading-gap">
          Right here
          <br />
          in <em>Midland.</em>
        </h2>
        <address>
          {address.street}
          <br />
          {address.city}, {address.state} {address.zip}
        </address>
        <div className="visit-details">
          <a href={phone.href}>
            <small>Call the shop</small>
            {phone.display}
          </a>
          <p>
            <small>Hours</small>
            {hours.regular.map((slot) => (
              <span key={slot.label}>
                {slot.label} · {formatTime(slot.opens)}–{formatTime(slot.closes)}
                <br />
              </span>
            ))}
            {hours.closed.map((slot) => (
              <span key={slot.label}>{slot.label} · Closed</span>
            ))}
          </p>
        </div>
        <a
          className="ebutton ebutton-bright"
          href={site.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions <span aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </section>
  );
}
