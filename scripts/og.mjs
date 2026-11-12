// scripts/og.mjs
// Renders the social share image (public/og.jpg), the app icons and favicon.ico from the
// brand mark (src/app/icon.svg).
// These are committed files, not built on every deploy; rerun when the brand, the headline
// or the hero photo changes:
//   npm install --no-save @playwright/test && npx playwright install chromium
//   npm run og
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(path)).toString("base64")}`;
const photo = await dataUrl("public/images/workshop-hero.png", "image/png");
const icon = await readFile("src/app/icon.svg", "utf8");

// The headline is the client's own claim, word for word (see site.claims in src/lib/site.ts).
const card = `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Manrope:wght@600;800&family=Space+Grotesk:wght@700&family=DM+Mono:wght@500&display=block">
</head><body style="margin:0">
<div style="position:relative;overflow:hidden;width:1200px;height:630px;box-sizing:border-box;padding:56px 64px;background:#20252a;color:#fff;font-family:Manrope,Helvetica,Arial,sans-serif">
  <img src="${photo}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,7,8,.94) 0%,rgba(6,7,8,.78) 42%,rgba(6,7,8,.12) 78%),linear-gradient(0deg,rgba(6,7,8,.5),transparent 45%)"></div>
  <div style="position:relative;display:inline-flex;align-items:center;gap:14px;padding:12px 22px 12px 14px;background:#a51e3b">
    <svg viewBox="0 0 26 96" width="16" height="52" fill="#fff"><path d="M8.5 2 C 8 33, 9.5 66, 12.5 94 L 17 93 C 14 64, 13 32, 13.5 3 Z"/></svg>
    <div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:27px;font-weight:700;letter-spacing:-1.3px;line-height:.85">PRO&nbsp;TECH</div>
      <div style="margin-top:7px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:4.4px">COLLISION</div>
    </div>
  </div>
  <div style="position:absolute;left:64px;bottom:150px;font-family:Syne,sans-serif;font-size:84px;font-weight:700;letter-spacing:-6px;line-height:.94">Restored to pre<br><span style="color:#e4e8e8">collision condition</span></div>
  <div style="position:absolute;left:64px;right:64px;bottom:56px;display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid rgba(255,255,255,.3);font-size:21px;font-weight:800;letter-spacing:.2px">
    <span>Complete collision repair · Midland, Texas</span>
    <span>(432) 699-5000</span>
  </div>
</div></body></html>`;

const browser = await chromium.launch();

const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(card);
await page.waitForLoadState("networkidle");
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 86 });
console.log("Wrote public/og.jpg");

for (const [path, size] of [
  ["src/app/apple-icon.png", 180],
  ["public/icons/icon-192.png", 192],
  ["public/icons/icon-512.png", 512],
]) {
  const tile = await browser.newPage({ viewport: { width: size, height: size } });
  await tile.setContent(`<body style="margin:0">${icon.replace("<svg ", `<svg width="${size}" height="${size}" style="display:block" `)}</body>`);
  await tile.screenshot({ path });
  console.log(`Wrote ${path}`);
}

// favicon.ico: a single 48px PNG in an ICO wrapper, for anything that asks for /favicon.ico
// directly instead of reading the icon links.
const small = await browser.newPage({ viewport: { width: 48, height: 48 } });
// Drawn through a canvas because a canvas always exports RGBA, which ICO decoders (and the
// Next build) require; a plain screenshot of an opaque tile comes out as RGB.
const png = Buffer.from(
  await small.evaluate(async (svg) => {
    const image = new Image();
    image.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 48;
    canvas.getContext("2d").drawImage(image, 0, 0, 48, 48);
    return canvas.toDataURL("image/png").split(",")[1];
  }, icon),
  "base64",
);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18); // offset of the PNG data
await writeFile("src/app/favicon.ico", Buffer.concat([header, png]));
console.log("Wrote src/app/favicon.ico");

await browser.close();
