/**
 * Feedback loop: folding "SYBERIS" ink must appear BESIDE the expanding photo
 * (same Y-band), not only scraps under it.
 *
 * Exit 0 = GREEN, Exit 1 = RED
 */
import { chromium } from "playwright";
import { writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";

const URL = process.env.SHOWREEL_URL || "http://127.0.0.1:3000/";
const WIDTH = Number(process.env.SHOWREEL_WIDTH || 1440);
const HEIGHT = Number(process.env.SHOWREEL_HEIGHT || 900);
const MIN_BESIDE_PCT = Number(
  process.env.MIN_BESIDE_PCT || (WIDTH < 1000 ? 0.8 : 2.0),
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove("is-intro");
  document.querySelector(".preloader")?.remove();
});
await page.waitForSelector(".showreel", { timeout: 30000 });
await page.waitForTimeout(700);
await page.locator(".showreel").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.evaluate(() => window.dispatchEvent(new Event("resize")));
await page.waitForTimeout(500);
await page.locator(".showreel").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const visual = await page.evaluate(() => {
  const v = document.querySelector(".showreel-visual")?.getBoundingClientRect();
  const headers = [...document.querySelectorAll(".showreel-header")].map((h) => {
    const r = h.getBoundingClientRect();
    return { id: h.id, top: Math.round(r.top), h: Math.round(r.height) };
  });
  return {
    box: v
      ? { left: v.left, right: v.right, top: v.top, bottom: v.bottom, w: v.width }
      : null,
    headers,
    compact: document
      .querySelector(".showreel-visual")
      ?.classList.contains("showreel-visual--compact"),
  };
});

const tmp = `/tmp/showreel-beside-${WIDTH}x${HEIGHT}.png`;
writeFileSync(tmp, await page.screenshot({ type: "png" }));
await browser.close();

const py = `
from PIL import Image
import json
im = Image.open(${JSON.stringify(tmp)}).convert("RGB")
w, h = im.size
v = ${JSON.stringify(visual.box)}
beside=below=above=blue=0
total=w*h
for y in range(h):
  for x in range(w):
    r,g,b = im.getpixel((x,y))
    if not (b>r+30 and b>90 and r<130):
      continue
    blue+=1
    if v is None:
      continue
    in_y = v["top"]-2 <= y <= v["bottom"]+2
    in_x = v["left"]-2 <= x <= v["right"]+2
    if in_y and not in_x: beside+=1
    elif y > v["bottom"]+2: below+=1
    elif y < v["top"]-2: above+=1
print(json.dumps({
  "bluePct": round(100*blue/total,2),
  "besidePct": round(100*beside/total,2),
  "belowPct": round(100*below/total,2),
  "abovePct": round(100*above/total,2),
}))
`;
const stats = JSON.parse(execFileSync("python3", ["-c", py], { encoding: "utf8" }));
try { unlinkSync(tmp); } catch {}

const green = stats.besidePct >= MIN_BESIDE_PCT;
console.log(JSON.stringify({ green, WIDTH, HEIGHT, MIN_BESIDE_PCT, stats, visual }, null, 2));
process.exit(green ? 0 : 1);
