import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "../Reveal";
import { BadgeIcon, PaintIcon, PhoneIcon, ShieldIcon, StarIcon } from "../Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      {/* Layered background: blueprint grid + floating gradient blobs */}
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true">
        <span
          className="blob h-[420px] w-[420px]"
          style={{ top: "-120px", right: "-80px", background: "var(--accent)", opacity: 0.16 }}
        />
        <span
          className="blob h-[380px] w-[380px]"
          style={{ bottom: "-140px", left: "-100px", background: "var(--primary)", opacity: 0.18, animationDelay: "-8s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary backdrop-blur">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-success" />
              Serving {site.address.city} &amp; the Permian Basin
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your car back to{" "}
              <span className="text-gradient">factory condition.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary">
              Collision repair, paint, and frame work done right the first time. We
              handle the insurance paperwork so you can get back on the road.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={site.phone.href}
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-contrast hover:bg-accent-hover"
              >
                <PhoneIcon className="h-5 w-5" />
                Call {site.phone.display}
              </a>
              <Link
                href="/#contact"
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-surface/60 px-6 py-3.5 text-base font-semibold text-foreground backdrop-blur hover:bg-surface"
              >
                Get a Free Estimate
              </Link>
            </div>
          </Reveal>

          {/* Trust strip */}
          <Reveal delay={360}>
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
          </Reveal>
        </div>

        {/* Photo panel — spray booth refinishing (CC0, StockSnap) */}
        <Reveal delay={200} className="hidden lg:block">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border-subtle shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
              <Image
                src="/images/paint-booth.jpg"
                alt="A car masked and prepped for refinishing inside a professional spray booth"
                width={960}
                height={640}
                priority
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay so the floating chip stays legible */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="glass absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-contrast">
                  <PaintIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Factory-match refinishing</p>
                  <p className="text-xs text-text-secondary">Computerized paint matching</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
