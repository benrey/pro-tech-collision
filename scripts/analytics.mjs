// scripts/analytics.mjs
// Writes out/analytics.js, the visit-counting loader every page loads. Run by the deploy
// workflow after the build with either or both of:
//   ANALYTICS_TOKEN  Cloudflare Web Analytics site token (Terraform output web_analytics_token,
//                    repository variable WEB_ANALYTICS_TOKEN). Page views, no cookies.
//   GOOGLE_TAG_ID    Google Analytics stream (G-...) or Tag Manager container (GTM-...),
//                    repository variable GOOGLE_TAG_ID.
//   ANALYTICS_TOKEN=<token> GOOGLE_TAG_ID=G-XXXXXXX node scripts/analytics.mjs
// The loader only runs on the public hostname, so previews and local copies are not counted.
// The Google tag counts visits only: advertising signals stay denied, browsers sending Global
// Privacy Control or Do Not Track load nothing, and visitors in the EEA, UK and Switzerland get
// no analytics cookies.
import { writeFileSync } from "node:fs";

const token = (process.env.ANALYTICS_TOKEN ?? "").trim();
const tagId = (process.env.GOOGLE_TAG_ID ?? "").trim();
const host = process.env.ANALYTICS_HOST ?? "ptcollisioninc.com";
const target = process.env.ANALYTICS_OUT ?? "out/analytics.js";

if (token && !/^[0-9a-f]{32}$/.test(token)) {
  console.error("ANALYTICS_TOKEN is not a Cloudflare Web Analytics token");
  process.exit(1);
}
if (tagId && !/^(G|GTM)-[A-Z0-9]{6,14}$/.test(tagId)) {
  console.error("GOOGLE_TAG_ID is not a Google tag ID (G-... or GTM-...)");
  process.exit(1);
}
if (!token && !tagId) {
  console.error("set ANALYTICS_TOKEN, GOOGLE_TAG_ID or both");
  process.exit(1);
}

// Where the law asks for consent before analytics cookies: no cookies there.
const NO_COOKIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV",
  "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

const cloudflare = `
  // Cloudflare Web Analytics: page views and load times. No cookies.
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", ${JSON.stringify(JSON.stringify({ token }))});
  document.head.appendChild(s);
`;

const tagManager = tagId.startsWith("GTM-");
const google = `
  // Google Analytics: visits only, no advertising signals.
  if (!(navigator.globalPrivacyControl || navigator.doNotTrack === "1")) {
    window.dataLayer = window.dataLayer || [];
    var gtag = function () { window.dataLayer.push(arguments); };
    var noAds = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
    gtag("consent", "default", Object.assign({ analytics_storage: "granted" }, noAds));
    gtag("consent", "default", Object.assign({ analytics_storage: "denied", region: ${JSON.stringify(NO_COOKIES)} }, noAds));
    ${tagManager
      ? 'window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });'
      : `gtag("js", new Date());\n    gtag("config", ${JSON.stringify(tagId)});`}
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/${tagManager ? "gtm.js" : "gtag/js"}?id=${tagId}";
    document.head.appendChild(g);
  }
`;

const loader = `// Visit counting for ${host}. Written at deploy by scripts/analytics.mjs.
(function () {
  if (location.hostname !== ${JSON.stringify(host)}) return;${token ? cloudflare : ""}${tagId ? google : ""}})();
`;

writeFileSync(target, loader);
console.log(`wrote ${target} for ${host}:${token ? " cloudflare" : ""}${tagId ? ` google ${tagId}` : ""}`);
