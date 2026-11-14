import type { Metadata } from "next";
import { asset } from "./assets";
import { processSteps, services, site } from "./site";

/**
 * One place for everything search engines and link previews read: the page
 * metadata, the share image, and the structured data. Every fact comes from
 * site.ts — nothing here may claim what the shop has not confirmed.
 */

/** The share card shown when the site is linked in a text, post, or chat. */
export const OG_IMAGE = {
  url: asset("/og.jpg"),
  width: 1200,
  height: 630,
  alt: `${site.name}: collision repair in ${site.address.city}, Texas`,
};

export const description =
  `Complete collision repair in ${site.address.city}, ${site.address.state}. ` +
  `Restored to pre collision/accident condition. Down draft heated paint ` +
  `booth to insure a professional paint job. High quality paint materials ` +
  `used. All work guaranteed. Most insurance claims accepted.`;

type PageMeta = {
  /** Without the brand; the layout template appends " | Pro Tech Collision". */
  title: string;
  description: string;
  /** Root-relative path, for example "/" or "/admin". */
  path: string;
  /** Use the title exactly as given, without the brand suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

/** Builds title, description, canonical, Open Graph and Twitter tags together. */
export function pageMetadata(page: PageMeta): Metadata {
  const url = `${site.url}${page.path === "/" ? "" : page.path}`;
  const fullTitle = page.absoluteTitle ? page.title : `${page.title} | ${site.shortName}`;
  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: url },
    robots: page.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description: page.description,
      siteName: site.name,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}

// ── Structured data ──────────────────────────────────────────────────────

const businessId = `${site.url}/#business`;

/**
 * schema.org AutoBodyShop — what lets Google show hours, location and
 * services directly in local results.
 *
 * Accuracy matters: structured data that contradicts the Google Business
 * Profile can hurt local ranking, so the placeholder values in site.ts must
 * be corrected before launch.
 */
export function businessLd() {
  const { address, phone, geo, hours } = site;
  return {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "@id": businessId,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/icons/icon-512.png`,
    telephone: phone.display,
    ...(site.email ? { email: site.email.display } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    hasMap: site.googleMapsUrl,
    openingHoursSpecification: hours.regular.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
      opens: slot.opens,
      closes: slot.closes,
    })),
    areaServed: site.serviceArea.map((area) => ({ "@type": "City", name: area })),
    knowsLanguage: ["en", "es"],
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.blurb,
      },
    })),
    priceRange: "$$",
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    alternateName: [site.shortName, `${site.shortName} ${site.address.city}`],
    description,
    inLanguage: "en",
    publisher: { "@id": businessId },
  };
}

/** Plain-text summary served at /llms.txt, built from the same facts as the page. */
export function llmsText() {
  const { address, phone, hours } = site;
  return [
    `# ${site.name}`,
    "",
    `> ${description}`,
    "",
    "## Facts",
    "",
    `- Business: auto body and collision repair shop.`,
    `- Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}.`,
    `- Phone: ${phone.display}.`,
    // Hours come from a third-party directory until the owner confirms them.
    ...(hours.verified
      ? hours.regular.map((slot) => `- Hours: ${slot.label}, ${slot.opens} to ${slot.closes}.`)
      : []),
    `- Area served: ${site.serviceArea.join(", ")}.`,
    `- Languages: English and Spanish (se habla español).`,
    `- Map: ${site.googleMapsUrl}`,
    "",
    "## What the shop says about its work",
    "",
    ...site.claims.items.map((claim) => `- ${claim}`),
    "",
    "## Services",
    "",
    ...services.map((service) => `- ${service.title}: ${service.blurb}`),
    "",
    "## How a repair goes",
    "",
    ...processSteps.map((step) => `${step.step}. ${step.title}: ${step.detail}`),
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): services, paint booth, reviews, map and estimate request`,
    `- [Privacy policy](${site.url}/privacy): what the website collects and how it is used`,
    `- [Terms of service](${site.url}/terms): terms for using the website`,
    "",
  ].join("\n");
}
