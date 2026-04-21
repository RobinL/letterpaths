import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(repoRoot, "dist-pages");
const editorDistDir = path.join(repoRoot, "packages", "editor", "dist");
const writingAppDistDir = path.join(repoRoot, "packages", "writing_app", "dist");
const writingAppPublishedSubdir = "writing_app";
const writingAppRouteDirs = ["cursive_worksheet_generator", "score_points", "snake"];

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

copyDirectoryContents(editorDistDir, outputDir);
copyDirectoryContents(writingAppDistDir, path.join(outputDir, writingAppPublishedSubdir));

for (const routeDir of writingAppRouteDirs) {
  copyDirectoryContents(
    path.join(writingAppDistDir, routeDir),
    path.join(outputDir, routeDir)
  );
}
