import Link from "next/link";
import { site, services } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const { address, phone } = site;

  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-contrast">
                PT
              </span>
              <span className="text-base font-bold tracking-tight text-foreground">{site.name}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
              Collision repair, paint, and frame work for {address.city} and the
              surrounding Permian Basin.
            </p>
            <a
              href={phone.href}
              className="mt-4 inline-block text-lg font-bold text-foreground underline-offset-4 hover:underline"
            >
              {phone.display}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Services</h2>
            <ul className="mt-3 space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href="/#services"
                    className="text-sm text-text-secondary underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Service Area</h2>
            <ul className="mt-3 space-y-2">
              {site.serviceArea.map((area) => (
                <li key={area} className="text-sm text-text-secondary">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-tertiary">
            © {year} {site.name}. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-sm text-text-tertiary underline-offset-4 hover:text-foreground hover:underline"
          >
            Owner login
          </Link>
        </div>
      </div>
    </footer>
  );
}
