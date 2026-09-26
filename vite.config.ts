import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import type { Plugin } from "vite";

// vercel.json serves app.html for every route except "/". Write it on every
// client build so the portal still works even if the prerender step is skipped;
// scripts/prerender.mjs then refreshes it along with the prerendered index.html.
const appShell = (): Plugin => ({
  name: "app-shell",
  apply: "build",
  closeBundle() {
    if (this.environment?.config.build.ssr) return;
    const dist = path.resolve(__dirname, "dist");
    const indexFile = path.join(dist, "index.html");
    if (!fs.existsSync(indexFile)) return;
    const html = fs
      .readFileSync(indexFile, "utf8")
      .replace("<!--app-head-->", '<meta name="robots" content="noindex" />');
    fs.writeFileSync(path.join(dist, "app.html"), html);
  },
});

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react(), appShell()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks so app deploys don't bust library caches
        manualChunks: isSsrBuild
          ? undefined
          : {
              react: ["react", "react-dom", "react-router-dom"],
              supabase: ["@supabase/supabase-js"],
            },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
