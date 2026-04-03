import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  resolve: {
    alias:
      mode === "development"
        ? {
            letterpaths: path.resolve(
              __dirname,
              "../letterpaths/src/index.ts"
            ),
          }
        : {},
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
}));
