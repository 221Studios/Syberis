/**
 * Sums forced synchronous layouts on the homepage.
 *
 * A Layout trace event with a JS stack is a forced reflow: script read
 * geometry after invalidating styles. Durations are microseconds in the
 * trace and printed as milliseconds.
 *
 * Before the homepage stopped repeating ScrollTrigger.refresh and measuring
 * SVG path length, this machine recorded about 91 ms. The budget stays under
 * that and above the fixed run (~55 ms).
 *
 * Usage: node scripts/measure-forced-reflow.mjs [url]
 */
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:3456/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const client = await page.context().newCDPSession(page);
const events = [];
client.on("Tracing.dataCollected", (payload) => {
  events.push(...payload.value);
});

await client.send("Tracing.start", {
  categories: [
    "devtools.timeline",
    "disabled-by-default-devtools.timeline",
    "disabled-by-default-devtools.timeline.stack",
  ].join(","),
});

try {
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(8000);
} finally {
  await client.send("Tracing.end");
  await new Promise((resolve) => client.once("Tracing.tracingComplete", resolve));
  await browser.close();
}

const BUDGET_MS = 75;

let forcedUs = 0;
let forcedCount = 0;
const sampleNames = new Map();

for (const event of events) {
  if (event.name !== "Layout" || event.ph !== "X") continue;
  const begin = event.args?.beginData;
  const stack = begin?.stackTrace || event.args?.stackTrace;
  if (!stack) continue;
  forcedUs += event.dur || 0;
  forcedCount += 1;
  const frame = stack[0];
  const key = frame?.functionName || frame?.url || "anonymous";
  sampleNames.set(key, (sampleNames.get(key) ?? 0) + (event.dur || 0));
}

const forcedMs = forcedUs / 1000;
const top = [...sampleNames.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([name, us]) => `${name} ${(us / 1000).toFixed(1)}ms`);

console.log(`forced-reflows: ${forcedCount}`);
console.log(`forced-layout-ms: ${forcedMs.toFixed(1)}`);
for (const line of top) console.log(`- ${line}`);

if (forcedCount === 0) process.exitCode = 2;
else if (forcedMs > BUDGET_MS) process.exitCode = 1;
