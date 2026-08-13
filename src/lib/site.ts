/**
 * Central business configuration for Pro Tech Collision Inc.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  FIELDS MARKED `NEEDS_VERIFICATION` ARE PLACEHOLDERS.
 *
 *  Only the business name and map coordinates were confirmed (resolved from
 *  the Google Maps share link). Everything else — phone, street address,
 *  hours, certifications, insurers — was NOT verifiable and is invented
 *  placeholder text. Publishing wrong contact info actively costs the shop
 *  customers, so replace these before going live.
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
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00", label: "Mon – Fri" },
    ],
    closed: [{ days: ["Saturday", "Sunday"], label: "Sat – Sun" }],
  },

  // ⚠️ NEEDS_VERIFICATION — these are the common industry credentials, but we
  // have NOT confirmed which ones this shop actually holds. Remove any it
  // doesn't have: claiming an uncertified credential is a real legal problem.
  certifications: {
    verified: false,
    items: [
      { name: "I-CAR Gold Class", detail: "Industry training standard for collision repair" },
      { name: "ASE Certified Technicians", detail: "National Institute for Automotive Service Excellence" },
      { name: "Manufacturer Certified", detail: "Trained on OEM-approved repair procedures" },
    ],
  },

  // ⚠️ NEEDS_VERIFICATION — placeholder list. Confirm which insurers the shop
  // actually works with before publishing.
  insurance: {
    verified: false,
    note: "We work with all major insurance carriers and can help manage your claim.",
    carriers: ["State Farm", "Allstate", "GEICO", "Progressive", "USAA", "Farmers"],
  },

  // ⚠️ NEEDS_VERIFICATION — confirm the actual warranty offered.
  warranty: {
    verified: false,
    headline: "Lifetime Warranty",
    detail: "Written warranty on workmanship for as long as you own your vehicle.",
  },

  // ⚠️ NEEDS_VERIFICATION — confirm how long the shop has operated.
  yearsInBusiness: {
    verified: false,
    value: 20,
  },

  // Service area for local SEO. Midland/Odessa is the Permian Basin metro.
  serviceArea: ["Midland", "Odessa", "Big Spring", "Stanton", "Andrews", "Permian Basin"],

  // Set once deployed — used for canonical URLs and OpenGraph.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://protechcollision.com",
} as const;

/** Services offered. Generic collision-repair set — adjust to match the shop. */
export const services = [
  {
    slug: "collision-repair",
    title: "Collision Repair",
    blurb:
      "Full-service repair for everything from minor fender benders to major structural damage, restored to factory specification.",
    icon: "collision",
  },
  {
    slug: "paint-refinishing",
    title: "Paint & Refinishing",
    blurb:
      "Computerized paint matching for a seamless, factory-quality finish that blends invisibly with your existing paint.",
    icon: "paint",
  },
  {
    slug: "frame-straightening",
    title: "Frame & Unibody",
    blurb:
      "Computer-measured frame straightening that returns your vehicle's structure to manufacturer tolerances.",
    icon: "frame",
  },
  {
    slug: "dent-repair",
    title: "Dent Repair",
    blurb:
      "Paintless dent removal for hail damage, door dings, and minor creases — preserving your original factory paint.",
    icon: "dent",
  },
  {
    slug: "hail-damage",
    title: "Hail Damage",
    blurb:
      "West Texas storms are hard on vehicles. We handle hail claims start to finish and work directly with your insurer.",
    icon: "hail",
  },
  {
    slug: "glass-replacement",
    title: "Auto Glass",
    blurb:
      "Windshield and window replacement, including recalibration of cameras and sensors on ADAS-equipped vehicles.",
    icon: "glass",
  },
] as const;

/** The repair process, shown to set customer expectations. */
export const processSteps = [
  { step: 1, title: "Free Estimate", detail: "Bring the vehicle by or send photos. We assess the damage and give you a written estimate at no cost." },
  { step: 2, title: "Insurance Handling", detail: "We coordinate directly with your insurance adjuster so you don't have to chase paperwork." },
  { step: 3, title: "Expert Repair", detail: "Certified technicians restore your vehicle using manufacturer-approved procedures and materials." },
  { step: 4, title: "Quality Check", detail: "Every repair is inspected before delivery. We don't hand back keys until it's right." },
] as const;

export type Service = (typeof services)[number];
