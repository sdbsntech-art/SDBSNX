import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(rootDirectory, "dist");
const siteOrigin = new URL(process.env.SITE_URL || "https://ida-cours.netlify.app").origin;
const urls = new Map([[`${siteOrigin}/`, { lastModified: null, priority: "1.0", changefreq: "daily" }]]);
const indexablePages = [
  { path: "licence", priority: "1.0", changefreq: "daily" },
  { path: "cybersecurite", priority: "0.9", changefreq: "weekly" },
  { path: "entrepreneuriat", priority: "0.9", changefreq: "weekly" },
  { path: "videos", priority: "0.9", changefreq: "daily" },
  { path: "bibliotheque", priority: "0.8", changefreq: "weekly" },
  { path: "formateurs", priority: "0.8", changefreq: "monthly" },
  { path: "forum", priority: "0.7", changefreq: "daily" },
  { path: "faq", priority: "0.8", changefreq: "monthly" },
  { path: "L1", priority: "0.9", changefreq: "weekly" },
  { path: "L2", priority: "0.9", changefreq: "weekly" },
  { path: "L3", priority: "0.9", changefreq: "weekly" },
  { path: "FAQ", priority: "0.7", changefreq: "monthly" },
  { path: "bibliotheques", priority: "0.8", changefreq: "weekly" },
  { path: "videos", priority: "0.9", changefreq: "daily" },
  { path: "exercicel1", priority: "0.8", changefreq: "weekly" },
  { path: "exerciceL2", priority: "0.8", changefreq: "weekly" },
  { path: "exerciceL3", priority: "0.8", changefreq: "weekly" },
  { path: "mention_legale", priority: "0.3", changefreq: "yearly" },
  { path: "politique_confidentialite", priority: "0.3", changefreq: "yearly" },
  { path: "condition_d'utilisation", priority: "0.3", changefreq: "yearly" },
  { path: "commentaire", priority: "0.5", changefreq: "daily" },
  { path: "formateur", priority: "0.7", changefreq: "monthly" },
  { path: "pdftuto", priority: "0.7", changefreq: "weekly" },
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
    urls.set(location, {
      lastModified: lastModified,
      priority: "0.7",
      changefreq: "monthly"
    });
  }
}

for (const page of indexablePages) {
  const pageData = typeof page === 'string' ? { path: page, priority: "0.8", changefreq: "weekly" } : page;
  urls.set(`${siteOrigin}/${pageData.path}`, {
    lastModified: null,
    priority: pageData.priority,
    changefreq: pageData.changefreq
  });
}

collectPdfs(path.join(outputDirectory, "courses"));

const entries = [...urls]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([location, data]) => {
    const lastmod = data.lastModified ? `\n    <lastmod>${data.lastModified}</lastmod>` : "";
    const priority = data.priority ? `\n    <priority>${data.priority}</priority>` : "";
    const changefreq = data.changefreq ? `\n    <changefreq>${data.changefreq}</changefreq>` : "";
    return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmod}${priority}${changefreq}\n  </url>`;
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
  `# robots.txt pour SDBSNX IDA
# Permettre l'indexation de tout le site

User-agent: *
Allow: /

# Interdire l'accès aux fichiers de configuration et aux scripts
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /.env
Disallow: /scripts/
Disallow: /dist/
Disallow: /*.js$
Disallow: /*.jsx$
Disallow: /*.ts$
Disallow: /*.tsx$
Disallow: /*.json$
Disallow: /*.md$
Disallow: /admin
Disallow: /private

# Sitemap
Sitemap: ${siteOrigin}/sitemap.xml

# Crawl-delay pour éviter de surcharger le serveur
Crawl-delay: 1
`,
  "utf8",
);
console.log(`Generated dist/sitemap.xml with ${urls.size} URLs.`);
