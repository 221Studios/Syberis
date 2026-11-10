/**
 * Fails when a shipped JS chunk still installs Baseline polyfills.
 *
 * PageSpeed "Legacy JavaScript" flags Next's polyfill-module, which assigns
 * Array.prototype.at/flat/flatMap, Object.fromEntries/hasOwn and
 * String.prototype.trimStart/trimEnd. Modern targets already have them.
 *
 * Usage:
 *   node scripts/check-legacy-polyfills.mjs [url]
 *   node scripts/check-legacy-polyfills.mjs --dir .next/static
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const MARKERS = [
  "String.prototype.trimStart=",
  "String.prototype.trimEnd=",
  "Array.prototype.flat=",
  "Array.prototype.flatMap=",
  "Object.fromEntries=",
  "Array.prototype.at=",
  "Object.hasOwn=",
];

const arg = process.argv[2] ?? "https://syberis.pl/";

async function filesFromDir(dir) {
  const out = [];
  const entries = await readdir(dir, { recursive: true });
  for (const entry of entries) {
    if (String(entry).endsWith(".js")) out.push(path.join(dir, String(entry)));
  }
  return out;
}

async function sourcesFromUrl(pageUrl) {
  const html = await (await fetch(pageUrl, { headers: { accept: "text/html" } })).text();
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*("([^"]+)"|'([^']+)')/gi)].map(
    (match) => match[2] ?? match[3],
  );
  const origin = new URL(pageUrl).origin;
  const sources = [];
  for (const src of srcs) {
    const url = new URL(src, origin).href;
    const js = await (await fetch(url)).text();
    sources.push({ name: url, text: js });
  }
  return sources;
}

const sources = arg === "--dir"
  ? await Promise.all(
      (await filesFromDir(process.argv[3] ?? ".next/static")).map(async (file) => ({
        name: file,
        text: await readFile(file, "utf8"),
      })),
    )
  : await sourcesFromUrl(arg);

const hits = [];
for (const source of sources) {
  const found = MARKERS.filter((marker) => source.text.includes(marker));
  if (found.length > 0) hits.push({ name: source.name, found, bytes: source.text.length });
}

console.log(`sources: ${sources.length}`);
console.log(`chunks-with-polyfills: ${hits.length}`);
for (const hit of hits) {
  console.log(`- ${hit.name} (${hit.bytes} bytes)`);
  for (const marker of hit.found) console.log(`  ${marker}`);
}

if (hits.length > 0) process.exitCode = 1;
