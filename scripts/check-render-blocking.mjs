/**
 * Fails when the homepage still has render-blocking stylesheets.
 *
 * Lighthouse "Render-blocking requests" counts a <link rel="stylesheet">
 * whose media matches screen (missing media counts as "all") and that is
 * not disabled or alternate. A <style> tag is not a network request.
 *
 * Also fails when the inlined CSS no longer contains the hero rule, so a
 * page that simply dropped its styles does not count as fixed.
 *
 * Usage: node scripts/check-render-blocking.mjs [url]
 */
const url = process.argv[2] ?? "http://127.0.0.1:3000/";

const response = await fetch(url, {
  headers: { accept: "text/html" },
  redirect: "follow",
});
if (!response.ok) {
  console.error(`HTTP ${response.status} for ${url}`);
  process.exitCode = 2;
} else {
  const html = await response.text();
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html;
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const styleText = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("\n");

  function attr(tag, name) {
    const found = tag.match(
      new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
    );
    return found ? (found[2] ?? found[3] ?? "") : null;
  }

  const blocking = [];
  for (const tag of links) {
    const rel = (attr(tag, "rel") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!rel.includes("stylesheet")) continue;
    if (rel.includes("alternate")) continue;
    if (/\bdisabled\b/i.test(tag)) continue;
    const media = (attr(tag, "media") ?? "all").trim().toLowerCase();
    const matchesScreen =
      media === "" || media === "all" || /(^|[\s,])screen([\s,]|$)/.test(media);
    if (!matchesScreen) continue;
    blocking.push({
      href: attr(tag, "href"),
      media,
    });
  }

  const hasHero = styleText.includes(".hero");
  const hasFontFace = styleText.includes("@font-face");

  console.log(`url: ${url}`);
  console.log(`blocking-stylesheets: ${blocking.length}`);
  for (const item of blocking) {
    console.log(`- ${item.href} media=${item.media}`);
  }
  console.log(`inlined-style-bytes: ${styleText.length}`);
  console.log(`inlined-hero: ${hasHero}`);
  console.log(`inlined-font-face: ${hasFontFace}`);

  if (blocking.length > 0 || !hasHero || !hasFontFace) {
    process.exitCode = 1;
  }
}
