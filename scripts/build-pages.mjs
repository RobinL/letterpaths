import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(repoRoot, "dist-pages");
const writingAppDistDir = path.join(repoRoot, "packages", "writing_app", "dist");

const ensureDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const copyDirectoryContents = (sourceDir, targetDir) => {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing build output: ${sourceDir}`);
  }

  ensureDirectory(targetDir);
  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(targetDir, entry), {
      recursive: true
    });
  }
};

fs.rmSync(outputDir, { recursive: true, force: true });
ensureDirectory(outputDir);

copyDirectoryContents(writingAppDistDir, outputDir);
