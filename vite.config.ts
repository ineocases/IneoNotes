import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project sites are served under /IneoNotes/.
// Override with VITE_BASE_PATH for another deployment target.
const base = process.env.VITE_BASE_PATH || "/IneoNotes/";

export default defineConfig({
  plugins: [react()],
  base,
});
