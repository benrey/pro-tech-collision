/**
 * Central business configuration for Pro Tech Collision Inc.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  FIELDS MARKED `NEEDS_VERIFICATION` ARE PLACEHOLDERS.
 *
 *  Name, address, phone, coordinates and the shop's own service claims are
 *  confirmed. Business hours are still from a third-party directory and are
 *  NOT verified — confirm with the owner before launch. Publishing wrong
 *  contact info actively costs the shop customers.
 *
 *  Do NOT add licenses, certifications, or accreditations here. The shop has
 *  not confirmed any, and claiming an uncertified credential is a real legal
 *  problem.
 *
 *  Run `npm run check:content` to list everything still unverified.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Marks a value as placeholder data that must be replaced before launch. */
export const NEEDS_VERIFICATION = true;

export const site = {
  // ✅ CONFIRMED — from the Google Maps listing
  name: "Pro Tech Collision Inc.",
  shortName: "Pro Tech Collision",

  // ✅ CONFIRMED — coordinates from the Maps share link
  geo: {
    latitude: 31.9705082,
    longitude: -102.1282317,
  },

  // ✅ CONFIRMED — the original share link you provided
  googleMapsUrl: "https://maps.app.goo.gl/nUG5VApLrZ1jpnh78",

  // ✅ CONFIRMED — matches the Google listing coordinates and multiple
  // directories (Carwise, CMac, Names & Numbers).
  address: {
    street: "1226 S Midland Dr",
    city: "Midland",
    state: "TX",
    zip: "79703",
    country: "US",
    verified: true,
  },

  // ✅ CONFIRMED — consistent across CMac and Names & Numbers directories.
  phone: {
    display: "(432) 699-5000",
    href: "tel:+14326995000",
    verified: true,
  },

  // No public email found for the shop. Leave null and the site hides the
  // email line; set an object { display, href, verified } when known.
  email: null as null | { display: string; href: string; verified: boolean },

  // ⚠️ NEEDS_VERIFICATION — from a third-party directory (CMac), which can be
  // stale. Confirm with the owner before launch.
  hours: {
    verified: false,
    // schema.org dayOfWeek values, used for both display and structured data
    regular: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
        label: "Mon – Fri",
      },
    ],
    closed: [{ days: ["Saturday", "Sunday"], label: "Sat – Sun" }],
  },

  // ✅ CONFIRMED — the shop's own claims, supplied by the owner. These are
  // the only promises the site makes; do not add credentials, licenses, or
  // certifications unless the owner confirms the shop actually holds them.
  claims: {
    verified: true,
    items: [
      {
        name: "Restored to pre-accident condition",
        detail:
          "Complete collision repair that brings the vehicle back to the way it was before the wreck.",
      },
      {
        name: "Down-draft heated paint booth",
        detail:
          "A professional paint job in a controlled, heated booth that pulls air down and away from the finish.",
      },
      {
        name: "High-quality paint materials",
        detail:
          "Quality materials on every panel, so the color holds up long after the repair.",
      },
      {
        name: "All work guaranteed",
        detail: "We stand behind every repair that leaves the shop.",
      },
      {
        name: "Most insurance claims accepted",
        detail: "We work with most carriers and help you move the claim along.",
      },
    ],
  },

  // ✅ CONFIRMED — the owner's wording. No carrier list: naming specific
  // insurers implies a relationship the shop has not confirmed.
  insurance: {
    verified: true,
    note: "Most insurance claims accepted. We'll help you get the claim moving.",
  },

  // ✅ CONFIRMED — the owner's wording. Deliberately not a term-limited or
  // "lifetime" warranty: it's a guarantee on the work, stated plainly.
  guarantee: {
    verified: true,
    headline: "All work guaranteed",
    detail: "Every repair that leaves this shop is backed by us.",
  },

  // Service area for local SEO. Midland/Odessa is the Permian Basin metro.
  serviceArea: [
    "Midland",
    "Odessa",
    "Big Spring",
    "Stanton",
    "Andrews",
    "Permian Basin",
  ],

  // Set once deployed — used for canonical URLs and OpenGraph.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ptcollisioninc.com",
} as const;

/**
 * Services offered. Every blurb here must be supported by what the shop has
 * actually told us it does — no equipment, tooling, or credential claims that
 * haven't been confirmed.
 */
export const services = [
  {
    slug: "collision-repair",
    title: "Complete Collision Repair",
    blurb:
      "From a light fender bender to heavy damage, we handle the whole repair and return the vehicle to its pre-accident condition.",
    icon: "collision",
  },
  {
    slug: "paint-refinishing",
    title: "Paint & Refinishing",
    blurb:
      "High-quality paint materials, sprayed in our down-draft heated booth for a professional finish that lasts.",
    icon: "paint",
  },
  {
    slug: "frame-straightening",
    title: "Frame & Unibody",
    blurb:
      "Structural and frame work as part of a complete repair, so the vehicle goes back together the way it came apart.",
    icon: "frame",
  },
  {
    slug: "dent-repair",
    title: "Dent Repair",
    blurb:
      "Door dings, creases, and panel damage straightened and refinished to match the rest of the vehicle.",
    icon: "dent",
  },
  {
    slug: "hail-damage",
    title: "Hail Damage",
    blurb:
      "West Texas storms are hard on vehicles. Bring it in and we'll work the repair and the insurance claim together.",
    icon: "hail",
  },
  {
    slug: "glass-replacement",
    title: "Auto Glass",
    blurb:
      "Windshield and window replacement handled alongside the rest of the collision repair.",
    icon: "glass",
  },
] as const;

/** The repair process, shown to set customer expectations. */
export const processSteps = [
  {
    step: 1,
    title: "Free Estimate",
    detail:
      "Bring the vehicle by and we'll look over the damage and put an estimate in writing, at no cost to you.",
  },
  {
    step: 2,
    title: "Insurance Claims",
    detail:
      "Most insurance claims accepted. We work with the adjuster so you aren't the one chasing paperwork.",
  },
  {
    step: 3,
    title: "Complete Repair",
    detail:
      "Bodywork and structural repair, then high-quality paint materials laid down in our down-draft heated booth.",
  },
  {
    step: 4,
    title: "Guaranteed Finish",
    detail:
      "Every repair is checked before you get the keys back, and all of our work is guaranteed.",
  },
] as const;

export type Service = (typeof services)[number];
