import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope, Space_Grotesk, Syne } from "next/font/google";
import { asset } from "@/lib/assets";
import { description, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans-var",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-var",
  display: "swap",
});

// Logo lockup fonts, per the Precision Panel brand direction
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-grotesk-var",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-logo-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata({
    title: `${site.name} — Auto Body & Collision Repair in ${site.address.city}, ${site.address.state}`,
    absoluteTitle: true,
    description,
    path: "/",
  }),
  title: {
    default: `${site.name} — Auto Body & Collision Repair in ${site.address.city}, ${site.address.state}`,
    template: `%s | ${site.shortName}`,
  },
  applicationName: site.name,
  keywords: [
    "auto body shop",
    "collision repair",
    `body shop ${site.address.city} TX`,
    "hail damage repair",
    "paintless dent repair",
    "frame straightening",
    "auto paint",
    ...site.serviceArea.map((area) => `collision repair ${area}`),
  ],
};

export const viewport: Viewport = {
  // The hero is dark ink in both themes, so the browser chrome matches it.
  themeColor: "#20252a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Applies the saved theme before first paint so there's no flash of the
          wrong palette. Must run synchronously, ahead of hydration.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('protech-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        {/* Empty in local builds. The deploy workflow fills it in: see scripts/analytics.mjs. */}
        <script defer src={asset("/analytics.js")} />
      </head>
      <body
        className={`${manrope.variable} ${syne.variable} ${spaceGrotesk.variable} ${dmMono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-contrast"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
