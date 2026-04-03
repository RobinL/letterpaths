import { defineConfig } from "vite";
import path from "node:path";

const githubPagesBase = "/letterpaths/";

export default defineConfig(({ command }) => ({
  base: command === "build" ? githubPagesBase : "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        editor: path.resolve(__dirname, "editor.html"),
      },
    },
  },
  resolve: {
    alias: {
      letterpaths: path.resolve(__dirname, "../letterpaths/src/index.ts"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
}));
