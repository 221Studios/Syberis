/**
 * Fails when the largest paint is the preloader title or lands after 2.5s.
 *
 * PageSpeed reported LCP as h2.preloader-title-base ("Syberis") with a
 * 1600 ms element render delay and a 0-point LCP score. On a throttled
 * phone that delay stretched past 6s.
 *
 * Usage: node scripts/measure-lcp.mjs [url]
 */
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:3456/";
const BUDGET_MS = 2500;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 1.75,
  isMobile: true,
  hasTouch: true,
});
await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const element = entry.element;
      window.__lcp.push({
        startTime: entry.startTime,
        renderTime: entry.renderTime,
        loadTime: entry.loadTime,
        size: entry.size,
        tag: element?.tagName?.toLowerCase() ?? null,
        className: typeof element?.className === "string" ? element.className : null,
        text: element?.textContent?.trim().slice(0, 40) ?? null,
        url: entry.url || null,
      });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
const client = await page.context().newCDPSession(page);
await client.send("Network.enable");
await client.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await page.goto(url, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(9000);

const report = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paints = window.__lcp ?? [];
  const last = paints.at(-1) ?? null;
  return {
    ttfb: nav ? Math.round(nav.responseStart) : null,
    candidates: paints.map((entry) => ({
      t: Math.round(entry.startTime),
      size: Math.round(entry.size),
      tag: entry.tag,
      className: entry.className,
      text: entry.text,
      url: entry.url,
    })),
    lcp: last ? Math.round(last.startTime) : null,
    size: last?.size ?? null,
    tag: last?.tag ?? null,
    className: last?.className ?? null,
    text: last?.text ?? null,
  };
});

console.log(`url: ${url}`);
console.log(JSON.stringify(report, null, 2));

const isPreloaderTitle =
  typeof report.className === "string" && report.className.includes("preloader-title");
const late = report.lcp == null || report.lcp > BUDGET_MS;

if (isPreloaderTitle || late) {
  console.log(
    `lcp-fail: element=${report.tag}.${report.className} time=${report.lcp} budget=${BUDGET_MS}`,
  );
  process.exitCode = 1;
}

await browser.close();
