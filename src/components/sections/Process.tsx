import { processSteps } from "@/lib/site";
import Reveal from "../Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-b border-border-subtle py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <header className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">How It Works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Four steps, no surprises
            </h2>
          </header>
        </Reveal>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((item, index) => (
            <Reveal as="li" key={item.step} delay={index * 110} className="group relative">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-accent-contrast transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {item.step}
                </span>
                {/* Connector — hidden on the last step and on small screens */}
                {index < processSteps.length - 1 && (
                  <span
                    className="hidden h-px flex-1 bg-gradient-to-r from-border-strong to-transparent lg:block"
                    aria-hidden="true"
                  />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
