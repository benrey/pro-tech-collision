#!/usr/bin/env node
/**
 * Lists business details in src/lib/site.ts that are still placeholders.
 *
 * Wrong contact info on a live site sends customers to a dead number, so this
 * exits non-zero while any unverified field remains — wire it into your deploy
 * check if you want a hard gate.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "src/lib/site.ts"), "utf8");

const checks = [
  { label: "Street address", pattern: /street:\s*"REPLACE ME[^"]*"/ },
  { label: "ZIP code", pattern: /zip:\s*"REPLACE ME"/ },
  { label: "Phone number", pattern: /display:\s*"\(432\) 555-0100"/ },
  { label: "Email address", pattern: /REPLACE-ME@example\.com/ },
];

const unverifiedFlags = [...source.matchAll(/verified:\s*false/g)].length;
const found = checks.filter((check) => check.pattern.test(source));

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

if (found.length === 0 && unverifiedFlags === 0) {
  console.log(`${GREEN}✓ All business details have been verified.${RESET}`);
  process.exit(0);
}

console.log(`\n${BOLD}${YELLOW}⚠  Placeholder business data still present${RESET}\n`);

if (found.length > 0) {
  console.log("  Values that are literal placeholders:");
  for (const check of found) console.log(`    • ${check.label}`);
  console.log("");
}

if (unverifiedFlags > 0) {
  console.log(
    `  ${unverifiedFlags} field group(s) still marked ${BOLD}verified: false${RESET}`,
  );
  console.log("    (hours, certifications, insurance carriers, warranty, years in business)\n");
}

console.log(`  Edit ${BOLD}src/lib/site.ts${RESET}, then set each 'verified' flag to true.`);
console.log(`  Publishing wrong contact details costs the shop real customers.\n`);

process.exit(1);
