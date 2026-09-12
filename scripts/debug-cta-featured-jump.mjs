/**
 * Feedback loop: hovering CTA ("Znajdź nas" / services) must not expand
 * document width (horizontal scrollbar) — that flashes FeaturedCards pin.
 *
 * Exit 0 = GREEN, Exit 1 = RED
 *   node scripts/debug-cta-featured-jump.mjs
 */
import { chromium } from "playwright";

const URL = process.env.BASE_URL || "http://127.0.0.1:3000/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove("is-intro");
  document.querySelector(".preloader")?.remove();
});
await page.waitForTimeout(900);

await page.evaluate(() => {
  const cta = document.querySelector(".cta");
  window.scrollTo(0, cta.getBoundingClientRect().top + window.scrollY - 40);
});
await page.waitForTimeout(700);

await page.evaluate(() => {
  window.__dbg = {
    maxScrollWidth: document.documentElement.scrollWidth,
    maxCardShift: 0,
    clientWidth: document.documentElement.clientWidth,
  };
});

const map = await page.locator(".cta-map-link").boundingBox();
const svc = await page.locator(".cta-services").boundingBox();

for (const box of [map, svc]) {
  if (!box) continue;
  for (let i = 0; i < 80; i++) {
    await page.mouse.move(
      box.x + ((i * 97) % Math.max(1, box.width)),
      box.y + ((i * 53) % Math.max(1, box.height)),
      { steps: 1 },
    );
    if (i % 4 === 0) {
      await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth;
        window.__dbg.maxScrollWidth = Math.max(window.__dbg.maxScrollWidth, sw);
        document.querySelectorAll(".cta-service-card").forEach((el) => {
          const t = getComputedStyle(el).transform;
          if (t === "none") return;
          const m = t.match(/matrix\(([^)]+)\)/);
          if (!m) return;
          const p = m[1].split(",").map(Number);
          window.__dbg.maxCardShift = Math.max(
            window.__dbg.maxCardShift,
            Math.abs(p[4] || 0),
            Math.abs(p[5] || 0),
          );
        });
      });
    }
  }
}

const dbg = await page.evaluate(() => window.__dbg);
const overflow = dbg.maxScrollWidth > dbg.clientWidth + 2;
const green = !overflow;

console.log(
  JSON.stringify(
    {
      green,
      overflow,
      maxScrollWidth: dbg.maxScrollWidth,
      clientWidth: dbg.clientWidth,
      maxCardShift: Math.round(dbg.maxCardShift * 10) / 10,
    },
    null,
    2,
  ),
);

await browser.close();
process.exit(green ? 0 : 1);
