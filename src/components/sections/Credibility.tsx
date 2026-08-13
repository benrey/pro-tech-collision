import { site } from "@/lib/site";
import { BadgeIcon, ShieldIcon } from "../Icons";

export default function Credibility() {
  return (
    <section className="border-b border-border-subtle bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Certifications & warranty */}
          <div>
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
                <li key={cert.name} className="flex items-start gap-3">
                  <BadgeIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{cert.name}</p>
                    <p className="text-sm text-text-secondary">{cert.detail}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <ShieldIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{site.warranty.headline}</p>
                  <p className="text-sm text-text-secondary">{site.warranty.detail}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Insurance */}
          <div className="rounded-2xl border border-border-subtle bg-surface-raised p-6 sm:p-8">
            <h3 className="text-xl font-bold text-foreground">Insurance claims, handled</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{site.insurance.note}</p>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-text-tertiary">
              Carriers we work with
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.insurance.carriers.map((carrier) => (
                <li
                  key={carrier}
                  className="rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary"
                >
                  {carrier}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-xl border border-border-subtle bg-surface p-4">
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
        </div>
      </div>
    </section>
  );
}
