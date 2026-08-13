import { services } from "@/lib/site";
import { serviceIcons } from "../Icons";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-b border-border-subtle py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">What We Do</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Complete collision repair
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            From a scuffed bumper to major structural damage, we handle every
            stage of the repair in house.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon];
            return (
              <li
                key={service.slug}
                className="rounded-2xl border border-border-subtle bg-surface-raised p-6 transition-colors hover:border-border-strong"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.blurb}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
