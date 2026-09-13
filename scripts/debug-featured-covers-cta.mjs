/**
 * FeaturedCards must not be position:fixed over CTA while CTA is on screen.
 * Exit 0 = GREEN, Exit 1 = RED (covers "Co zapewniamy" / Znajdź nas too early)
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
// Wait until Showreel + FeaturedCards pin spacers exist (async SVG decode).
await page.waitForFunction(
  () =>
    document.querySelectorAll(".pin-spacer").length >= 2 ||
    window.innerWidth < 1000,
  { timeout: 15000 },
);
await page.waitForTimeout(400);

const result = await page.evaluate(async () => {
  const cta = document.querySelector(".cta");
  const featured = document.querySelector(".featured-cards");
  const y = cta.getBoundingClientRect().top + window.scrollY - 60;
  window.scrollTo(0, y);
  await new Promise((r) => setTimeout(r, 500));

  const cr = cta.getBoundingClientRect();
  const fr = featured.getBoundingClientRect();
  const cs = getComputedStyle(featured);
  const ctaOnScreen = cr.top < window.innerHeight * 0.85 && cr.bottom > 80;
  const featuredFixed = cs.position === "fixed";
  const coversCta =
    ctaOnScreen &&
    featuredFixed &&
    fr.top <= 40 &&
    fr.height >= window.innerHeight * 0.8;

  return {
    coversCta,
    ctaOnScreen,
    featuredFixed,
    scrollY: Math.round(window.scrollY),
    ctaTop: Math.round(cr.top),
    ctaBottom: Math.round(cr.bottom),
    featTop: Math.round(fr.top),
    featPos: cs.position,
    pinSpacers: document.querySelectorAll(".pin-spacer").length,
  };
});

console.log(JSON.stringify({ green: !result.coversCta, ...result }, null, 2));
await browser.close();
process.exit(result.coversCta ? 1 : 0);
