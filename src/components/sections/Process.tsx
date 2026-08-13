import { processSteps } from "@/lib/site";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-b border-border-subtle py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">How It Works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Four steps, no surprises
          </h2>
        </header>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item) => (
            <li key={item.step} className="relative">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-base font-bold text-accent-contrast">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
