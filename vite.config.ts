import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base './' keeps asset paths working on GitHub Pages project sites.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        // Keep rarely-changing vendor code in separate cached chunks so
        // content edits don't force visitors to re-download everything.
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["framer-motion"],
          scroll: ["lenis"],
        },
      },
    },
  },
});
