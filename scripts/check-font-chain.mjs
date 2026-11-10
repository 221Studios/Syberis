/**
 * Fails when hero fonts are still discovered only after a CSS request.
 *
 * The critical chain was document → stylesheet → .ttf. A preload in the
 * document starts those fonts with the HTML, and woff2 is what we ship.
 *
 * Usage: node scripts/check-font-chain.mjs [url]
 */
const url = process.argv[2] ?? "http://127.0.0.1:3456/";

const REQUIRED = [
  "/fonts/palace/palace-regular.woff2",
  "/fonts/bellefair/bellefair-regular.woff2",
  "/fonts/dm-mono/dm-mono-regular.woff2",
  "/fonts/dm-mono/dm-mono-medium.woff2",
];

const response = await fetch(url, { headers: { accept: "text/html" } });
if (!response.ok) {
  console.error(`HTTP ${response.status} for ${url}`);
  process.exitCode = 2;
} else {
  const html = await response.text();
  const preloads = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /rel=["']preload["']/i.test(tag) && /as=["']font["']/i.test(tag))
    .map((tag) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? "");

  console.log(`url: ${url}`);
  console.log(`font-preloads: ${preloads.length}`);
  for (const href of preloads) console.log(`- ${href}`);

  const missing = REQUIRED.filter((href) => !preloads.some((preload) => preload.includes(href)));
  const ttfFace = /url\((["']?)[^)"']+\.ttf\1\)/i.test(html);
  if (missing.length > 0) {
    console.log(`missing-preloads: ${missing.join(", ")}`);
    process.exitCode = 1;
  }
  if (ttfFace) {
    console.log("inlined-ttf-face: true");
    process.exitCode = 1;
  }
}
