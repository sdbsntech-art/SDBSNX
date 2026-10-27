import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(rootDirectory, "dist");
const siteOrigin = new URL(process.env.SITE_URL || "https://ida-cours.netlify.app").origin;
const urls = new Map([[`${siteOrigin}/`, null]]);
const indexablePages = [
  "cours/licence-1",
  "cours/licence-2",
  "cours/licence-3",
  "videos",
  "bibliotheque",
  "cybersecurite",
  "entrepreneuriat",
  "formateurs",
  "communaute",
  "faq",
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function collectPdfs(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectPdfs(entryPath);
      continue;
    }

    if (path.extname(entry.name).toLowerCase() !== ".pdf") continue;

    const relativePath = path.relative(outputDirectory, entryPath);
    const encodedPath = relativePath
      .split(path.sep)
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const location = new URL(`/${encodedPath}`, `${siteOrigin}/`).href;
    const lastModified = fs.statSync(entryPath).mtime.toISOString().slice(0, 10);
    urls.set(location, lastModified);
  }
}

for (const page of indexablePages) {
  urls.set(`${siteOrigin}/${page}`, null);
}

collectPdfs(path.join(outputDirectory, "courses"));

const entries = [...urls]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([location, lastModified]) => {
    const lastmod = lastModified ? `\n    <lastmod>${lastModified}</lastmod>` : "";
    return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmod}\n  </url>`;
  });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(path.join(outputDirectory, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(
  path.join(outputDirectory, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  "utf8",
);
console.log(`Generated dist/sitemap.xml with ${urls.size} URLs.`);
