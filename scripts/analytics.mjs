// scripts/analytics.mjs
// Writes out/analytics.js, the loader for Cloudflare Web Analytics. Run by the deploy
// workflow after the build, with the site token from Cloudflare (Terraform output
// web_analytics_token, stored as the repository variable WEB_ANALYTICS_TOKEN):
//   ANALYTICS_TOKEN=<token> node scripts/analytics.mjs
// The loader only runs on the public hostname, so previews and local copies are not counted.
import { writeFileSync } from "node:fs";

const token = process.env.ANALYTICS_TOKEN ?? "";
const host = process.env.ANALYTICS_HOST ?? "ptcollisioninc.com";
const target = "out/analytics.js";

if (!/^[0-9a-f]{32}$/.test(token)) {
  console.error("ANALYTICS_TOKEN is missing or is not a Cloudflare Web Analytics token");
  process.exit(1);
}

const loader = `// Cloudflare Web Analytics: page views and load times. No cookies.
(function () {
  if (location.hostname !== ${JSON.stringify(host)}) return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", ${JSON.stringify(JSON.stringify({ token }))});
  document.head.appendChild(s);
})();
`;

writeFileSync(target, loader);
console.log(`wrote ${target} for ${host}`);
