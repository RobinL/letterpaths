import path from "node:path";
import { defineConfig } from "vite";

const githubPagesBase = "/letterpaths/writing_app/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? githubPagesBase : "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        scorePoints: path.resolve(__dirname, "score_points/index.html"),
        snake: path.resolve(__dirname, "snake/index.html")
      }
    }
  },
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
