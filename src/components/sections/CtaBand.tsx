import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "../Reveal";
import { PhoneIcon } from "../Icons";

/**
 * Full-width photo band with the primary call to action, breaking up the
 * page rhythm before the contact section. Background photo is CC0 (StockSnap).
 */
export default function CtaBand() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      <Image
        src="/images/classic-garage.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      {/* Dark scrim keeps text readable in both themes */}
      <div className="absolute inset-0 bg-slate-950/70" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Been in an accident?{" "}
            <span className="text-gradient">We&apos;ll take it from here.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            Free estimates, insurance claims handled, and your vehicle back to
            factory condition.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={site.phone.href}
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-contrast hover:bg-accent-hover"
            >
              <PhoneIcon className="h-5 w-5" />
              Call {site.phone.display}
            </a>
            <Link
              href="/#contact"
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Request an Estimate
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
