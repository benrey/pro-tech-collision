import Link from "next/link";
import { site } from "@/lib/site";
import { BadgeIcon, PhoneIcon, ShieldIcon, StarIcon } from "../Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      {/* Subtle background wash — no external image needed */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--primary) 0, transparent 45%), radial-gradient(circle at 80% 0%, var(--accent) 0, transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Serving {site.address.city} &amp; the Permian Basin
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your car back to{" "}
            <span className="text-accent">factory condition.</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Collision repair, paint, and frame work done right the first time. We
            handle the insurance paperwork so you can get back on the road.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <PhoneIcon className="h-5 w-5" />
              Call {site.phone.display}
            </a>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Get a Free Estimate
            </Link>
          </div>

          {/* Trust strip */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <ShieldIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold text-foreground">{site.warranty.headline}</dt>
                <dd className="text-xs text-text-tertiary">On workmanship</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <BadgeIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold text-foreground">Certified Techs</dt>
                <dd className="text-xs text-text-tertiary">Trained &amp; qualified</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <StarIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold text-foreground">All Insurers</dt>
                <dd className="text-xs text-text-tertiary">Claims handled</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
