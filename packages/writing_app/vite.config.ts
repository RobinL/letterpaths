import path from "node:path";
import { defineConfig } from "vite";

const githubPagesBase = "/letterpaths/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? githubPagesBase : "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        cursiveWorksheetGenerator: path.resolve(
          __dirname,
          "cursive_worksheet_generator/index.html"
        ),
        singleLetterWorksheetGenerator: path.resolve(
          __dirname,
          "single_letter_worksheet_generator/index.html"
        ),
        guidedTracing: path.resolve(__dirname, "guided_tracing/index.html"),
        freehandTracing: path.resolve(__dirname, "freehand_tracing/index.html"),
        editor: path.resolve(__dirname, "editor.html"),
        gallery: path.resolve(__dirname, "gallery.html"),
        joinStats: path.resolve(__dirname, "join_stats/index.html")
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
