import Image from "next/image";
import { site } from "@/lib/site";
import Reveal from "../Reveal";
import { BadgeIcon, ShieldIcon } from "../Icons";

/** Rendered twice inside the marquee track for a seamless loop. */
function CarrierChips({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex gap-3" aria-hidden={hidden || undefined}>
      {site.insurance.carriers.map((carrier) => (
        <li
          key={carrier}
          className="whitespace-nowrap rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm font-medium text-text-secondary"
        >
          {carrier}
        </li>
      ))}
    </ul>
  );
}

export default function Credibility() {
  return (
    <section className="border-b border-border-subtle bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Certifications & warranty */}
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Why Trust Us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Certified work, backed in writing
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              Modern vehicles need manufacturer-specified procedures to stay safe
              after a collision. Our technicians are trained to meet those
              standards, and we stand behind every repair.
            </p>

            <ul className="mt-8 space-y-4">
              {site.certifications.items.map((cert) => (
                <li key={cert.name} className="group flex items-start gap-3">
                  <span className="icon-chip mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <BadgeIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{cert.name}</p>
                    <p className="text-sm text-text-secondary">{cert.detail}</p>
                  </div>
                </li>
              ))}
              <li className="group flex items-start gap-3">
                <span className="icon-chip mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <ShieldIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{site.warranty.headline}</p>
                  <p className="text-sm text-text-secondary">{site.warranty.detail}</p>
                </div>
              </li>
            </ul>

            {/* Precision dent work (CC0, StockSnap) */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle">
              <Image
                src="/images/dent-repair.jpg"
                alt="A technician performing precision paintless dent repair on a red panel"
                width={960}
                height={640}
                className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>

          {/* Insurance */}
          <Reveal delay={120}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground">Insurance claims, handled</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{site.insurance.note}</p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
                Carriers we work with
              </p>
              <div className="marquee mt-3 -mx-2 px-2">
                <div className="marquee-track">
                  <CarrierChips />
                  <CarrierChips hidden />
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-border-subtle bg-surface/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-foreground">
                  You choose the shop — not your insurer.
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  Texas law gives you the right to pick where your vehicle is
                  repaired. If you&apos;ve been referred elsewhere, you can still
                  bring it to us.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
