import { site, services } from "@/lib/site";

/**
 * schema.org AutoBodyShop markup — this is what lets Google show hours,
 * location, and services directly in local search results.
 *
 * Accuracy matters here: structured data that contradicts the Google Business
 * Profile can hurt local ranking, so the placeholder values in site.ts must be
 * corrected before this goes live.
 */
export default function StructuredData() {
  const { address, phone, geo, hours } = site;

  const openingHours = [
    ...hours.regular.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
      opens: slot.opens,
      closes: slot.closes,
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
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
    openingHoursSpecification: openingHours,
    areaServed: site.serviceArea.map((area) => ({
      "@type": "City",
      name: area,
    })),
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
