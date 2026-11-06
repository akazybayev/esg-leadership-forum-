import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, ".next/server/app");
const staticDir = path.join(root, ".next/static");
const publicDir = path.join(root, "public");
const assetDir = path.join(publicDir, "static");

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function toStaticHtml(html) {
  const withoutScripts = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link rel="preload" as="script"[^>]*>/gi, "")
    .replace(/<link rel="preload" href="\/_next\/static\/chunks[^>]*>/gi, "");
  return withoutScripts
    .replaceAll("/_next/static/css/", "/static/css/")
    .replaceAll("/_next/static/media/", "/static/media/");
}

await rm(assetDir, { recursive: true, force: true });
await mkdir(path.join(assetDir, "css"), { recursive: true });
await mkdir(path.join(assetDir, "media"), { recursive: true });
await cp(path.join(staticDir, "css"), path.join(assetDir, "css"), {
  recursive: true,
});
await cp(path.join(staticDir, "media"), path.join(assetDir, "media"), {
  recursive: true,
});

for (const cssFile of await readdir(path.join(assetDir, "css"))) {
  if (!cssFile.endsWith(".css")) continue;
  const cssPath = path.join(assetDir, "css", cssFile);
  const css = await readFile(cssPath, "utf8");
  await writeFile(
    cssPath,
    css.replaceAll("/_next/static/media/", "/static/media/"),
  );
}

for (const file of await htmlFiles(appDir)) {
  const rel = path.relative(appDir, file);
  if (rel === "index.html" || rel.startsWith("_not-found")) continue;

  const html = toStaticHtml(await readFile(file, "utf8"));
  const htmlDest = path.join(publicDir, rel);
  await mkdir(path.dirname(htmlDest), { recursive: true });
  await writeFile(htmlDest, html);

  const withoutExt = rel.slice(0, -".html".length);
  const indexDest = path.join(publicDir, withoutExt, "index.html");
  await mkdir(path.dirname(indexDest), { recursive: true });
  await writeFile(indexDest, html);
}

await cp(path.join(publicDir, "ru.html"), path.join(publicDir, "index.html"));
