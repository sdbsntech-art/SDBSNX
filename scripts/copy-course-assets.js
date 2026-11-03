import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distributionDirectory = path.join(rootDirectory, "dist");
const publishedCoursesDirectory = path.join(distributionDirectory, "courses");
const outputDirectory = path.join(distributionDirectory, "pdfjs", "cmaps");
const cMapSourceDirectory = path.join(rootDirectory, "node_modules", "pdfjs-dist", "cmaps");

function countFiles(directory) {
  let count = 0;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    count += entry.isDirectory() ? countFiles(entryPath) : 1;
  }

  return count;
}

if (!fs.existsSync(cMapSourceDirectory)) {
  throw new Error(`Missing PDF.js character map directory: ${cMapSourceDirectory}`);
}

if (fs.existsSync(publishedCoursesDirectory)) {
  fs.rmSync(publishedCoursesDirectory, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(outputDirectory), { recursive: true });
fs.cpSync(cMapSourceDirectory, outputDirectory, { recursive: true });
const copiedCMaps = countFiles(outputDirectory);
if (copiedCMaps === 0) {
  throw new Error("No PDF.js character maps were copied.");
}

console.log(`Copied ${copiedCMaps} PDF.js character maps to dist/pdfjs/cmaps.`);
console.log("Course documents were excluded from dist; see docs/AUTORISATIONS.md.");
