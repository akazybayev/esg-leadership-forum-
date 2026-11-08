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

function postForms(html) {
  return html.replace(/<form\b([^>]*)>/gi, (_, attrs) => {
    let next = attrs;
    if (/\bmethod\s*=/i.test(next)) {
      next = next.replace(/\bmethod\s*=\s*(["'])get\1/gi, 'method="post"');
    } else {
      next += ' method="post"';
    }
    return `<form${next}>`;
  });
}

function toStaticHtml(html) {
  const withoutScripts = html
    .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link rel="preload" as="script"[^>]*>/gi, "")
    .replace(/<link rel="preload" href="\/_next\/static\/chunks[^>]*>/gi, "");
  let page = postForms(withoutScripts)
    .replaceAll("/_next/static/css/", "/static/css/")
    .replaceAll("/_next/static/media/", "/static/media/");
  const scripts = [];
  if (page.includes("topic-details") && !page.includes("/scripts/topic-agenda.js")) {
    scripts.push('<script src="/scripts/topic-agenda.js" defer></script>');
  }
  if (page.includes("data-program-explorer") && !page.includes("/scripts/program-explorer.js")) {
    scripts.push('<script src="/scripts/program-explorer.js" defer></script>');
  }
  if (scripts.length) {
    page = page.replace("</body>", `${scripts.join("")}</body>`);
  }
  return page;
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
