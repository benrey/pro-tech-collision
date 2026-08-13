import { site } from "@/lib/site";
import QuoteForm from "../QuoteForm";
import Reveal from "../Reveal";
import { ClockIcon, MapPinIcon, PhoneIcon } from "../Icons";

/** Formats "08:00" as "8:00 AM" for display. */
function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function Contact() {
  const { address, phone, email, hours } = site;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  // Embedded map searching by business name + address, which snaps to the
  // actual Google Business listing pin instead of raw coordinates. Keyless
  // embed endpoint — no Maps API key required.
  const mapQuery = encodeURIComponent(`${site.name} ${fullAddress}`);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <header className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Get In Touch</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Visit or call the shop
            </h2>
          </header>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Details + map */}
          <Reveal>
            <ul className="space-y-6">
              <li className="flex items-start gap-3.5">
                <PhoneIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-text-tertiary">Phone</p>
                  <a
                    href={phone.href}
                    className="text-lg font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {phone.display}
                  </a>
                  {email && (
                    <p className="mt-0.5 text-sm text-text-secondary">
                      <a href={email.href} className="underline-offset-4 hover:underline">
                        {email.display}
                      </a>
                    </p>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <MapPinIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-text-tertiary">Address</p>
                  <p className="text-base font-medium text-foreground">{fullAddress}</p>
                  <a
                    href={site.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Get directions →
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <ClockIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-text-tertiary">Hours</p>
                  <dl className="mt-1 space-y-1">
                    {hours.regular.map((slot) => (
                      <div key={slot.label} className="flex gap-3 text-sm">
                        <dt className="w-24 font-medium text-foreground">{slot.label}</dt>
                        <dd className="text-text-secondary">
                          {formatTime(slot.opens)} – {formatTime(slot.closes)}
                        </dd>
                      </div>
                    ))}
                    {hours.closed.map((slot) => (
                      <div key={slot.label} className="flex gap-3 text-sm">
                        <dt className="w-24 font-medium text-foreground">{slot.label}</dt>
                        <dd className="text-text-secondary">Closed</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle">
              <iframe
                src={mapSrc}
                title={`Map showing the location of ${site.name}`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, display: "block" }}
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <QuoteForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
