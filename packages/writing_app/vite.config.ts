import path from "node:path";
import { defineConfig } from "vite";

const githubPagesBase = "/letterpaths/writing_app/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? githubPagesBase : "/",
  resolve: {
    alias: {
      letterpaths: path.resolve(__dirname, "../letterpaths/src/index.ts")
    }
  },
  server: {
    fs: {
      allow: [".."]
    }
  }
}));
