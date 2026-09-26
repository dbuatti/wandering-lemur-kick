import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
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
