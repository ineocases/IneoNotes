import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative asset URLs work for local Vite, GitHub Pages project sites,
// and custom domains without hard-coding a repository name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
