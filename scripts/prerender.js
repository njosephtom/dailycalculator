// Pre-renders every sitemap route into dist/<route>/index.html so crawlers that
// do not run JavaScript (GPTBot, CCBot, PerplexityBot, ...) get real content.
// Run after `vite build`. Uses the Playwright already in devDependencies.
// ponytail: no hydrateRoot. main.jsx still createRoot()s, so the client re-renders
// the same DOM. Add hydrateRoot later only if the first-paint flash matters.
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { chromium } from "playwright";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

// Without Firebase config the app shows only its "Setup Required" screen, so there is
// nothing to prerender. Plain CI builds (GitHub Actions has no secrets) skip here; Vercel
// builds, which pull the project env, still fail loudly if the config is missing.
const env = loadEnv("production", root, "VITE_");
if (!env.VITE_FIREBASE_API_KEY && !process.env.VERCEL) {
  console.log("prerender skipped: no VITE_FIREBASE_* config in this build (CI check build)");
  process.exit(0);
}

const sitemap = await readFile(path.join(root, "public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

// Keep the untouched SPA shell in memory: pages are written over dist/ as we go.
const shell = await readFile(path.join(dist, "index.html"));
const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json",
};

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(dist, pathname);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  const s = await stat(file).catch(() => null);
  if (s && s.isFile()) {
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } else {
    res.writeHead(200, { "content-type": "text/html" }).end(shell); // SPA fallback
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

// Vercel's build image ships without Playwright's browser. If it is missing, download
// the version this project uses (same as `npx playwright install chromium`) and retry.
async function launchBrowser() {
  // On Vercel, use the Chromium from @sparticuz/chromium: it ships the shared libraries
  // (libnspr4 etc.) that the build image lacks, so Playwright's own download can't start.
  if (process.env.VERCEL) {
    const { default: sparticuz } = await import("@sparticuz/chromium");
    return chromium.launch({
      executablePath: await sparticuz.executablePath(),
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });
  }
  try {
    return await chromium.launch();
  } catch (err) {
    if (!/Executable doesn't exist/.test(err.message)) throw err;
    console.log("Playwright browser missing, installing chromium...");
    execSync("npx playwright install chromium", { stdio: "inherit" });
    return chromium.launch();
  }
}

const browser = await launchBrowser();
let failures = 0;
try {
  for (const route of routes) {
    const page = await browser.newPage();
    // Only the local build is needed; block analytics, ads and Firebase network calls.
    await page.route("**/*", (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
    try {
      await page.goto(origin + route, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#root h1", { timeout: 20000 });
      // react-helmet-async flushes <head> asynchronously; every page sets a canonical,
      // so wait for it or the snapshot keeps the shell's generic title and no JSON-LD.
      // state "attached": <head> elements are never "visible", so the default wait would hang.
      await page.waitForSelector('link[rel="canonical"][data-rh="true"]', { state: "attached", timeout: 20000 });
      const html = await page.content();
      const outFile = route === "/"
        ? path.join(dist, "index.html")
        : path.join(dist, route, "index.html");
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, html);
      console.log("prerendered", route);
    } catch (err) {
      failures++;
      console.error("FAILED", route, err.message.split("\n")[0]);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failures) {
  console.error(`${failures} route(s) failed to prerender`);
  process.exit(1);
}
console.log(`prerendered ${routes.length} routes`);
