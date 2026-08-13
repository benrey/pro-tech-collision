"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "../ThemeToggle";

type Tab = "gallery" | "testimonials" | "requests";

const tabs: { key: Tab; label: string }[] = [
  { key: "gallery", label: "Photos" },
  { key: "testimonials", label: "Reviews" },
  { key: "requests", label: "Quote Requests" },
];

export default function AdminShell({
  active,
  onChange,
  email,
  children,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
  email: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-border-subtle">
        <div className="mx-auto flex h-[var(--header-h)] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-contrast">
              PT
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-foreground">Dashboard</span>
              {email && <span className="mt-0.5 text-[11px] text-text-tertiary">{email}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="hidden rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface sm:inline-block"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-5xl px-4 sm:px-6" aria-label="Dashboard sections">
          <ul className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => onChange(tab.key)}
                  aria-current={active === tab.key ? "page" : undefined}
                  className={`-mb-px whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-medium transition-colors ${
                    active === tab.key
                      ? "border-accent text-foreground"
                      : "border-transparent text-text-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}

export type { Tab };
