import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(rootDirectory, "dist", "courses");
const courseSources = [
  ["LICENCE 1", "L1"],
  ["LICENCE 2", "L2"],
  [path.join("COURS LICENCE 3 SEMESTRE 5", "COURS LICENCE 3 SEMESTRE 5"), "L3"],
];

function countFiles(directory) {
  let count = 0;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    count += entry.isDirectory() ? countFiles(entryPath) : 1;
  }

  return count;
}

for (const [source, level] of courseSources) {
  const sourceDirectory = path.join(rootDirectory, source);
  if (!fs.existsSync(sourceDirectory)) {
    throw new Error(`Missing course source directory: ${sourceDirectory}`);
  }

  const destinationDirectory = path.join(outputDirectory, level);
  fs.cpSync(sourceDirectory, destinationDirectory, { recursive: true });

  const copiedFiles = countFiles(destinationDirectory);
  if (copiedFiles === 0) {
    throw new Error(`No course files were copied for ${level}.`);
  }

  console.log(`Copied ${copiedFiles} course files to dist/courses/${level}.`);
}
