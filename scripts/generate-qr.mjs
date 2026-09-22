#!/usr/bin/env node
/**
 * Generates the shop's QR codes into public/qr/.
 *
 * These point at a fixed domain and never change at runtime, so they are built
 * here rather than rendered in the browser — nothing ships to the client.
 *
 * SVG is the primary output: a QR code is pure geometry, so vector stays sharp
 * at any size. That matters because these get printed on business cards, door
 * decals, and tow-truck magnets, where a rasterized code can soften enough at
 * the edges to hurt the scan. A PNG is emitted alongside for the places that
 * won't take an SVG (most print portals, texts, Facebook posts).
 *
 * Error correction is fixed at H (~30% recoverable). Codes on a shop door or a
 * counter card pick up grime, glare, and scratches, and H is what keeps those
 * scanning. It costs physical size, which is why the quiet zone below is not
 * negotiable.
 *
 *   node scripts/generate-qr.mjs            # regenerate all codes
 *   node scripts/generate-qr.mjs --check    # verify codes match config (CI)
 */

import qrcode from "qrcode-generator";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "qr");

/**
 * The canonical site URL, read from src/lib/site.ts so this file can never
 * drift from the rest of the site. A QR code encoding the wrong domain is
 * worse than no QR code — it is printed on something physical, and you cannot
 * take it back once the cards are in a customer's hand.
 */
function readSiteUrl() {
  const source = readFileSync(join(root, "src/lib/site.ts"), "utf8");
  const match = source.match(/url:\s*process\.env\.NEXT_PUBLIC_SITE_URL\s*\?\?\s*"([^"]+)"/);
  if (!match) {
    throw new Error("Could not find the site URL in src/lib/site.ts");
  }
  return match[1];
}

/**
 * The shop phone, also read from site.ts. Encoded as a tel: URI so a scan
 * opens the dialer instead of making someone copy the number down.
 */
function readSitePhone() {
  const source = readFileSync(join(root, "src/lib/site.ts"), "utf8");
  const match = source.match(/href:\s*"(tel:[^"]+)"/);
  if (!match) {
    throw new Error("Could not find the phone href in src/lib/site.ts");
  }
  return match[1];
}

/** Brand tokens, mirrored from globals.css. */
const INK = "#20252a";
const PAPER = "#f5f1eb";

/**
 * Quiet zone in modules. The spec requires 4 and scanners genuinely need it —
 * a code butted up against artwork is the most common reason one won't read.
 */
const QUIET = 4;

/**
 * Builds the QR matrix for `text`.
 *
 * Type 0 lets the library pick the smallest version that fits, which keeps the
 * modules as large (and as scannable) as possible for the given payload.
 */
function encode(text) {
  const qr = qrcode(0, "H");
  qr.addData(text);
  qr.make();
  return qr;
}

/**
 * Renders the matrix as SVG.
 *
 * Every dark module is emitted as one rect in a single path-like group. The
 * viewBox is in module units, so the consumer scales it to whatever size they
 * need and the geometry stays exact — no fractional-pixel seams between
 * modules, which is what causes the faint grid lines you see in some
 * generators' output.
 */
function toSvg(qr, { dark = INK, light = PAPER, label }) {
  const count = qr.getModuleCount();
  const size = count + QUIET * 2;

  const rects = [];
  for (let row = 0; row < count; row++) {
    // Merge horizontal runs of dark modules into one rect. Purely a file-size
    // win, and it also avoids hairline gaps when a renderer antialiases.
    let runStart = null;
    for (let col = 0; col <= count; col++) {
      const dark = col < count && qr.isDark(row, col);
      if (dark && runStart === null) {
        runStart = col;
      } else if (!dark && runStart !== null) {
        const x = runStart + QUIET;
        const y = row + QUIET;
        rects.push(`<rect x="${x}" y="${y}" width="${col - runStart}" height="1"/>`);
        runStart = null;
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"`,
    ` width="${size * 8}" height="${size * 8}" shape-rendering="crispEdges"`,
    ` role="img" aria-label="${label}">`,
    `<rect width="${size}" height="${size}" fill="${light}"/>`,
    `<g fill="${dark}">${rects.join("")}</g>`,
    `</svg>`,
  ].join("");
}

/** Writes a minimal, valid PNG chunk (length, type, data, CRC32). */
function pngChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed) >>> 0);
  return Buffer.concat([length, typed, crc]);
}

/** CRC32, as the PNG spec requires for each chunk. */
let crcTable = null;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

/**
 * Renders the matrix as a PNG at `scale` device pixels per module.
 *
 * Written by hand rather than pulling in an image library: a QR code is a
 * 1-bit grid, so the encoder is about thirty lines and it saves the project a
 * dependency (and the transitive native build) it would otherwise carry just
 * to write squares.
 */
function toPng(qr, { scale = 16, dark = INK, light = PAPER }) {
  const count = qr.getModuleCount();
  const size = (count + QUIET * 2) * scale;

  const hex = (c) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ];
  const [dr, dg, db] = hex(dark);
  const [lr, lg, lb] = hex(light);

  // Raw scanlines: each row is a filter byte (0 = none) followed by RGB triples.
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let pos = 0;
  for (let y = 0; y < size; y++) {
    raw[pos++] = 0;
    const row = Math.floor(y / scale) - QUIET;
    for (let x = 0; x < size; x++) {
      const col = Math.floor(x / scale) - QUIET;
      const on =
        row >= 0 && row < count && col >= 0 && col < count && qr.isDark(row, col);
      raw[pos++] = on ? dr : lr;
      raw[pos++] = on ? dg : lg;
      raw[pos++] = on ? db : lb;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 2; // truecolor RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

const siteUrl = readSiteUrl();
const sitePhone = readSitePhone();

/**
 * What each code points at.
 *
 * No URL shortener and no tracking redirect: the destination is printed on
 * something physical that outlives any redirect service, so each code encodes
 * the real domain directly. If you later want scan counts, add a landing path
 * you control (e.g. /card) rather than a third-party link.
 */
const targets = [
  {
    file: "site",
    data: siteUrl,
    label: `QR code linking to ${siteUrl}`,
    note: "Main site — cards, window decal, invoices",
  },
  {
    file: "estimate",
    data: `${siteUrl}/#contact`,
    label: "QR code linking to the free estimate form",
    note: "Free estimate form — counter card, service writer",
  },
  {
    file: "phone",
    data: sitePhone,
    label: "QR code that dials the shop",
    note: "Taps to call — door glass, after-hours sign",
  },
];

const checkOnly = process.argv.includes("--check");
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

if (!checkOnly) mkdirSync(outDir, { recursive: true });

const stale = [];
for (const target of targets) {
  const qr = encode(target.data);
  const svg = toSvg(qr, { label: target.label });
  const png = toPng(qr, {});
  const svgPath = join(outDir, `${target.file}.svg`);
  const pngPath = join(outDir, `${target.file}.png`);

  if (checkOnly) {
    const current = existsSync(svgPath) ? readFileSync(svgPath, "utf8") : null;
    if (current !== svg) stale.push(target.file);
    continue;
  }

  writeFileSync(svgPath, svg);
  writeFileSync(pngPath, png);
  const version = (qr.getModuleCount() - 17) / 4;
  console.log(
    `${GREEN}✓${RESET} ${BOLD}qr/${target.file}${RESET} ${DIM}v${version}, ecc H · ${target.note}${RESET}\n  ${DIM}→ ${target.data}${RESET}`,
  );
}

if (checkOnly) {
  if (stale.length === 0) {
    console.log(`${GREEN}✓ QR codes are up to date.${RESET}`);
    process.exit(0);
  }
  console.log(
    `${YELLOW}⚠ Out of date: ${stale.join(", ")}${RESET}\n  Run ${BOLD}npm run qr${RESET} to regenerate.`,
  );
  process.exit(1);
}

console.log(`\n${DIM}Written to public/qr/ — scan-test each one before printing.${RESET}`);
