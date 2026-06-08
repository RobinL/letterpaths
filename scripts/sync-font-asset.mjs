import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const sourceFont = path.join(
  repoRoot,
  "packages",
  "letterpaths-font",
  "fonts",
  "Letterpaths.woff2"
);
const targetFont = path.join(
  repoRoot,
  "packages",
  "writing_app",
  "public",
  "homepage",
  "Letterpaths.woff2"
);
const writingAppIndex = path.join(
  repoRoot,
  "packages",
  "writing_app",
  "index.html"
);

if (!fs.existsSync(sourceFont)) {
  throw new Error(`Missing font build output: ${sourceFont}`);
}

fs.mkdirSync(path.dirname(targetFont), { recursive: true });
const fontBytes = fs.readFileSync(sourceFont);
fs.writeFileSync(targetFont, fontBytes);

const cacheKey = crypto.createHash("sha256").update(fontBytes).digest("hex").slice(0, 12);
const indexHtml = fs.readFileSync(writingAppIndex, "utf8");
const nextIndexHtml = indexHtml.replace(
  /url\("\.\/homepage\/Letterpaths\.woff2(?:\?v=[a-f0-9]+)?"\)/,
  `url("./homepage/Letterpaths.woff2?v=${cacheKey}")`
);

if (nextIndexHtml === indexHtml) {
  throw new Error(`Could not find Letterpaths font URL in ${writingAppIndex}`);
}

fs.writeFileSync(writingAppIndex, nextIndexHtml);

console.log(
  `Synced ${path.relative(repoRoot, sourceFont)} -> ${path.relative(repoRoot, targetFont)}`
);
console.log(`Updated homepage font cache key: ${cacheKey}`);
