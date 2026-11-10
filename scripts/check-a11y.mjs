/**
 * Fails on the homepage accessibility issues from the PageSpeed report:
 * aria-label on paragraphs, an unnamed "Wszystkie mioty" link, skipped
 * heading levels, gold-on-blue contrast, and footer links under 24px.
 *
 * Usage: node scripts/check-a11y.mjs [url]
 */
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:3456/";

function fail(messages) {
  for (const message of messages) console.log(`a11y-fail: ${message}`);
  process.exitCode = 1;
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 1.75,
  isMobile: true,
  hasTouch: true,
});
await page.goto(url, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(4000);

const report = await page.evaluate(() => {
  const parse = (color) => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 4 && parts[3] === 0) return null;
    return parts.slice(0, 3);
  };
  const channel = (value) => {
    const scaled = value / 255;
    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  const lum = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (fg, bg) => {
    const hi = Math.max(lum(fg), lum(bg));
    const lo = Math.min(lum(fg), lum(bg));
    return (hi + 0.05) / (lo + 0.05);
  };
  const backgroundOf = (element) => {
    let node = element;
    while (node) {
      const parsed = parse(getComputedStyle(node).backgroundColor);
      if (parsed) return parsed;
      node = node.parentElement;
    }
    return [255, 255, 255];
  };
  const accessibleName = (element) => {
    const label = element.getAttribute("aria-label");
    if (label) return label.trim();
    const copy = element.cloneNode(true);
    copy.querySelectorAll("[aria-hidden='true']").forEach((node) => node.remove());
    return copy.textContent.trim();
  };

  const labeledParagraphs = [...document.querySelectorAll("p[aria-label]")].map((element) => ({
    className: element.className,
    label: element.getAttribute("aria-label"),
  }));

  const litters = [...document.querySelectorAll('a[href="/mioty"]')].map((element) => ({
    className: element.className,
    name: accessibleName(element),
  }));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .filter((element) => element.getAttribute("aria-hidden") !== "true" && !element.closest("[aria-hidden='true']"))
    .map((element) => ({
      level: Number(element.tagName.slice(1)),
      text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 48),
    }));
  const skips = [];
  let previous = 0;
  for (const heading of headings) {
    if (previous && heading.level > previous + 1) skips.push({ previous, ...heading });
    previous = heading.level;
  }

  const contrastOf = (selector) =>
    [...document.querySelectorAll(selector)].map((element) => {
      const color = parse(getComputedStyle(element).color);
      const background = backgroundOf(element);
      return {
        text: element.textContent.trim().slice(0, 32),
        ratio: color ? Math.round(ratio(color, background) * 100) / 100 : null,
      };
    });

  const compass = [...document.querySelectorAll("#cta-compass-svg text")].map((element) => {
    const fill = element.getAttribute("fill");
    const probe = document.createElement("span");
    probe.style.color = fill;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const color = parse(getComputedStyle(probe).color);
    probe.remove();
    const background = backgroundOf(element.parentElement);
    return {
      text: element.textContent,
      fill,
      ratio: color ? Math.round(ratio(color, background) * 100) / 100 : null,
    };
  });

  const targets = [...document.querySelectorAll(".footer-nav-link")].map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent.trim(),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
    };
  });

  return { labeledParagraphs, litters, headings, skips, contrastOf: {
    map: contrastOf(".cta-map-cta"),
    notes: contrastOf(".cta-location-row .mono"),
    services: contrastOf(".cta-service-card__top .mono"),
  }, compass, targets };
});

console.log(`url: ${url}`);
console.log(JSON.stringify(report, null, 2));

const messages = [];
if (report.labeledParagraphs.length > 0) {
  messages.push(`aria-label na p: ${report.labeledParagraphs.map((item) => item.label).join(", ")}`);
}
const unnamed = report.litters.filter((link) => link.name.length === 0);
if (unnamed.length > 0) messages.push("link /mioty bez nazwy");
if (report.skips.length > 0) {
  messages.push(`pominięte nagłówki: ${report.skips.map((item) => `h${item.previous}->h${item.level} ${item.text}`).join("; ")}`);
}
for (const group of [report.contrastOf.map, report.contrastOf.notes, report.contrastOf.services]) {
  for (const item of group) {
    if (item.ratio != null && item.ratio < 4.5) messages.push(`kontrast ${item.ratio} < 4.5: ${item.text}`);
  }
}
for (const item of report.compass) {
  if (item.ratio != null && item.ratio < 4.5) messages.push(`kompas ${item.text} kontrast ${item.ratio}`);
}
for (const item of report.targets) {
  if (item.w < 24 || item.h < 24) messages.push(`cel ${item.text} ${item.w}x${item.h}`);
}
if (messages.length > 0) fail(messages);

await browser.close();
