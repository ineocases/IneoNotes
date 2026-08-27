import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project sites are served from /<repository>/ while local
// development should stay at /. The repository name is detected in Actions.
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  plugins: [react()],
  base: isGitHubPagesBuild && repositoryName ? `/${repositoryName}/` : "/",
});
