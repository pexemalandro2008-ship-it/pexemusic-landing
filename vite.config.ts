import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" = funciona no GitHub Pages, Lovable, Vercel ou Netlify sem ajuste
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 5173 },
});
