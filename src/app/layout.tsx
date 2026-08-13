import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
});

const description =
  `Collision repair, paint, frame straightening, and hail damage repair in ` +
  `${site.address.city}, ${site.address.state}. Free estimates, all insurance ` +
  `claims handled, and a written warranty on workmanship.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Auto Body & Collision Repair in ${site.address.city}, ${site.address.state}`,
    template: `%s | ${site.shortName}`,
  },
  description,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Auto Body & Collision Repair`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Auto Body & Collision Repair`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
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
